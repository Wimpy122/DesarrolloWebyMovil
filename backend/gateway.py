from fastapi import FastAPI, Request, HTTPException, Depends
import httpx
import os

app = FastAPI(title="API Gateway")
AUTH_URL = "http://localhost:8100"
BACKEND_URL = "http://localhost:9000"
VAULT_URL = "http://localhost:8200" 

def get_secrets():
    return {
        "backend_secret": os.getenv("INTERNAL_GATEWAY_SECRET", "gateway-api-secret-456"),
        "auth_secret": os.getenv("AUTH_INTROSPECTION_SECRET", "gateway-auth-secret-789")
    }

async def authenticate_client(request: Request):
    """
    Aquí implementamos la lógica: extraer el token, validar contra Auth Service y preparar datos.
    """
    secrets = get_secrets()
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
         raise HTTPException(status_code=401, detail="Token no proporcionado o formato inválido")
    
    token = auth_header.split(" ")[1]

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{AUTH_URL}/introspect",
                json={"token": token},
                headers={"Authorization": f"Bearer {secrets['auth_secret']}"}
            )
            response.raise_for_status()
            identidad = response.json()
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Servicio de autenticación no disponible")
        except httpx.HTTPStatusError:
             raise HTTPException(status_code=401, detail="Error validando token con Auth Service")

    if not identidad.get("active"):
        raise HTTPException(status_code=401, detail="Sesión inactiva o token expirado")

    return {
        "backend_secret": secrets["backend_secret"],
        "client_id": identidad.get("user_id", "unknown-client"),
        "username": identidad.get("username", ""),
        "roles": ",".join(identidad.get("roles", [])) if isinstance(identidad.get("roles"), list) else identidad.get("roles", "")
    }
