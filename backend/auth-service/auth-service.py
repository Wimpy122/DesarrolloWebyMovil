from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
import secrets
import os

app = FastAPI(title="Auth Service")

USERS = {
    "ana": {
        "user_id": "USR-001",
        "password": "1234",
        "roles": ["user"]
    },
    "ernesto": {
        "user_id": "USR-003",
        "password": "admin123", 
        "roles": ["user", "admin"]
    }
}

SESSIONS = {}

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenRequest(BaseModel):
    token: str

@app.post("/login")
async def login(request: LoginRequest):
    """Verifica credenciales y emite un token de sesión opaco."""
    user = USERS.get(request.username)
    
    if not user or user["password"] != request.password:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrecta")
    
    access_token = secrets.token_hex(32)
    
    SESSIONS[access_token] = {
        "user_id": user["user_id"],
        "username": request.username,
        "roles": user["roles"],
        "active": True
    }
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": 900
    }

@app.post("/introspect")
async def introspect(request: TokenRequest, authorization: str = Header(None)):
    """El Gateway usa este endpoint para preguntar si un token es válido."""
    expected_secret = os.getenv("AUTH_INTROSPECTION_SECRET", "gateway-auth-secret-789")
    
    if authorization != f"Bearer {expected_secret}":
        raise HTTPException(status_code=403, detail="Gateway no autorizado para consultar")

    session = SESSIONS.get(request.token)
    if session and session["active"]:
        return {
            "active": True,
            "user_id": session["user_id"],
            "username": session["username"],
            "roles": session["roles"]
        }
    
    return {"active": False}

@app.post("/logout")
async def logout(request: TokenRequest):
    """Invalida la sesión en el servidor."""
    if request.token in SESSIONS:
        del SESSIONS[request.token]
    return {"message": "Sesión revocada exitosamente"}