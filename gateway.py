from fastapi import FastAPI
import httpx

app = FastAPI(title="TuGimnasio API Gateway")

BACKEND_OPINIONES_URL = "http://localhost:9000"
BACKEND_PLANES_URL = "http://localhost:9100"


@app.get("/api/opiniones")
async def opiniones():
    
    # Alimenta el carrusel de opiniones.php.
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BACKEND_OPINIONES_URL}/opiniones"
        )
    return response.json()


@app.get("/api/planes")
async def planes():
    
    # Alimenta planes.php con la lista de planes y precios del gimnasio.
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BACKEND_PLANES_URL}/planes"
        )
    return response.json()


@app.get("/api/empresa")
async def empresa():
    """
    Alimenta empresa.php con datos institucionales
    (por ejemplo, cantidad de socios activos que hoy está fija en el HTML).
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BACKEND_PLANES_URL}/empresa"
        )
    return response.json()
