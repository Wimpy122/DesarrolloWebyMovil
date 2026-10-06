import os
import secrets
from fastapi import FastAPI, Header, HTTPException, Depends

app = FastAPI(
    title="BackEnd API",
    description="API ubicada en servidor enrutada por API Gateway"
)

INTERNAL_GATEWAY_SECRET = os.getenv("INTERNAL_GATEWAY_SECRET", "gateway-api-secret-456")

if not INTERNAL_GATEWAY_SECRET:
    raise RuntimeError("INTERNAL_GATEWAY_SECRET no está configurado")

def verify_gateway(x_gateway_secret: str = Header(default="")):
    """
    Verifica que la petición provenga del API Gateway validando el secreto.
    """
    valid = secrets.compare_digest(
        x_gateway_secret,
        INTERNAL_GATEWAY_SECRET
    )
    if not valid:
        raise HTTPException(
            status_code=403,
            detail="Solicitud no autorizada desde Gateway"
        )

def get_current_user(
    x_authenticated_user: str = Header(default=""),
    x_authenticated_username: str = Header(default=""),
    x_authenticated_roles: str = Header(default="")
):
    if not x_authenticated_user:
        raise HTTPException(status_code=401, detail="Identidad no propagada")
    return {
        "user_id": x_authenticated_user,
        "username": x_authenticated_username,
        "roles": x_authenticated_roles.split(",") if x_authenticated_roles else []
    }

# ---------------------------------------------------------
# RUTAS PROTEGIDAS (Equivalentes a /products o /orders)
# ---------------------------------------------------------

@app.get("/health", dependencies=[Depends(verify_gateway)])
def health():
    return {
        "status": "OK",
        "service": "Backend API"
    }

@app.get("/opiniones", dependencies=[Depends(verify_gateway)])
def get_opiniones(user: dict = Depends(get_current_user)):
    return [
        {"id": 1, "usuario": "Juan", "comentario": "Excelente gimnasio"},
        {"id": 2, "usuario": "María", "comentario": "Faltan más máquinas de cardio"}
    ]

@app.get("/planes", dependencies=[Depends(verify_gateway)])
def get_planes():
    return [
        {"nombre": "Básico", "precio": 20000},
        {"nombre": "Premium", "precio": 35000}
    ]

@app.get("/empresa", dependencies=[Depends(verify_gateway)])
def get_empresa():
    return {
        "nombre": "TuGimnasio",
        "socios_activos": 450,
        "direccion": "Avenida Siempre Viva 123"
    }