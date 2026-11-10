# Documentación Técnica y README de Arquitectura — Backend Seguro OfiExpress (Módulos 1 al 10)

## Resumen Ejecutivo y Caso de Negocio

El presente documento constituye la especificación técnica completa e informe de arquitectura para el backend seguro de la papelería **OfiExpress** (Caso de Negocio N° 37: útiles de oficina y escolares).

Partiendo de las pantallas, la interfaz responsiva y los requerimientos de interacción desarrollados para el frontend en la Evaluación 1, este trabajo diseña, implementa y valida un backend modular basado en microservicios, seguridad en capas, enrutamiento mediante API Gateway, agregaciones con GraphQL Gateway y sincronización interna con gRPC.

---

## Módulo 1: Servicios Derivados del Frontend

### 1.1 Matriz de Trazabilidad y Contratos de Servicios (S01 - S05)

Cada interacción del usuario en la interfaz web (`index.html`, `categorias.html`, `carrito.html`, `contacto.html`) se mapea hacia una operación de backend estructurada con sus parámetros de entrada, respuesta, reglas de negocio y clasificación de seguridad.

| ID | Pantalla y Acción | Propósito | Verbo y Ruta Propuesta | Entrada | Salida | Reglas y Errores | Clasificación de Datos | Acceso |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| **S01** | `index.html` / `categorias.html` -> Cargar catálogo | Consultar productos disponibles | `GET /api/v1/products` | Ninguna (cuerpo vacío). Opcional: `?q=` para filtro de texto. | 200 OK con lista de objetos `{id, titulo, precio, imagen}`. | 400 ante filtros inválidos. Límite de tasa 100 req/min. | Dato público (Catálogo). | Anónimo |
| **S02** | `categorias.html` -> Agregar al carro | Registrar ítem en el pedido activo | `POST /api/v1/orders/cart` | `{ "producto_id": int, "cantidad": int }` | 201 Created con el subtotal actualizado. | 400 si cantidad < 1 o si el producto no existe en el catálogo. | Restringido (Pedido de usuario). | Autenticado |
| **S03** | `carrito.html` -> Modificar cantidad | Actualizar cantidad de un ítem | `PUT /api/v1/orders/cart/{item_id}` | `{ "cantidad": int }` | 200 OK con el total del carrito actualizado. | 404 si el ítem no pertenece al carrito; 400 si cantidad < 1. | Restringido. | Autenticado |
| **S04** | `carrito.html` -> Eliminar de carro | Quitar ítem del carrito | `DELETE /api/v1/orders/cart/{item_id}` | Ninguna (cuerpo vacío). | 204 No Content. | 404 si el ítem no existe en el carrito del usuario. | Restringido. | Autenticado |
| **S05** | `contacto.html` -> Enviar mensaje | Registrar consulta de soporte | `POST /api/v1/support/contact` | `{ "nombre": string, "email": string, "mensaje": string }` | 201 Created confirmando recepción. | 400 si campos requeridos están vacíos o formato de email es inválido. | Dato personal. | Anónimo / Autenticado |

### 1.2 Ejemplos de Contratos JSON (Payloads de Referencia)

#### Respuesta de Catálogo (`GET /api/v1/products`) - Servicio S01:
```json
[
  {
    "id": 1,
    "titulo": "Set 3 Lápices Grafito HB",
    "precio": 1200,
    "imagen": "img/imagen1.jpg"
  },
  {
    "id": 4,
    "titulo": "Cuaderno Universitario Mat.",
    "precio": 2500,
    "imagen": "img/imagen4.jpg"
  }
]
```

#### Solicitud de Inserción al Carrito (`POST /api/v1/orders/cart`) - Servicio S02:
```json
{
  "producto_id": 4,
  "cantidad": 2
}
```

---

## Módulo 2: Clases y Cardinalidades del Dominio

### 2.1 Modelo de Relaciones y Cardinalidades

El modelo del dominio refleja las reglas de negocio de la papelería OfiExpress.

| Clase Origen | Clase Destino | Multiplicidades | Justificación de la Regla de Negocio |
| ------ | ------ | ------ | ------ |
| **Categoria** | **Producto** | `1 -> 0..*` | Una categoría agrupa múltiples productos (ej. "Útiles Escolares"). Un producto pertenece a una única categoría principal. |
| **Cliente** | **CarritoCompras** | `1 -> 0..1` | Un cliente tiene como máximo un carrito activo en sesión (0 si aún no ha iniciado compra, 1 si tiene ítems agregados). |
| **CarritoCompras** | **ItemCarrito** | `1 -> 1..*` | Un carrito activo debe contener al menos un ítem agregado desde la interfaz. |
| **ItemCarrito** | **Producto** | `* -> 1` | Múltiples ítems de carrito de distintos usuarios pueden hacer referencia a un mismo producto del catálogo. |
| **CatalogService** | **Producto** | Dependencia | `CatalogService` consulta la entidad `Producto` para retornar únicamente los DTOs públicos requeridos por el frontend. |

### 2.2 Diagrama UML de Clases del Dominio

Para representar visualmente la estructura de clases, atributos y relaciones de la capa de dominio:

![Diagrama del Dominio](img/diagrama_dominio.drawio.png)

### 2.3 Reglas de Negocio e Integridad de Datos
- **Sanitización de Precios:** Los precios se administran internamente como valores enteros en moneda nacional (CLP). Se descarta cualquier precio enviado desde el cliente en los payloads del carrito, consultando siempre el precio real en la base de datos de `inventory`.
- **Manejo de Estados Nulos:** Si un carrito no posee ítems, el servidor retorna una colección vacía `[]` con código HTTP 200, evitando errores de referencia nula en el frontend.

---

## Módulo 3: Sistemas e Integraciones

### 3.1 Matriz de Responsabilidades y Límites de Microservicios

La arquitectura se divide en cuatro microservicios privados principales aislados en la red interna de contenedores.

| Sistema | Responsabilidad Principal | Datos Bajo su Autoridad | Servicios Asociados | Dependencias Directas | Respuesta ante Fallos |
| ------ | ------ | ------ | ------ | ------ | ------ |
| **`inventory`** | Catálogo, categorías, precios y disponibilidad de stock. | Productos, Categorías, Stock real. | S01 | Ninguna (Fuente primaria). | Retorna caché de productos públicos o 503 Service Unavailable si la base de datos no responde. |
| **`orders`** | Gestión del carrito, creación y ciclo de vida de pedidos. | Carrito de compras, Historial de pedidos, Ítems. | S02, S03, S04 | Invoca a `inventory` (precios) y `payments` (checkout). | Si `inventory` no responde, rechaza el agregado al carrito para evitar vender ítems sin precio validado. |
| **`clients`** | Registro de usuarios, autenticación JWT y soporte. | Usuarios, Hashes de contraseñas (`bcrypt`), Contacto. | S05, Auth | Ninguna externa. | Modo degradado: el usuario opera como visitante anónimo navegando el catálogo. |
| **`payments`** | Integración con pasarelas de pago externas (Webpay/Transbank). | Historial de transacciones de pago. | Checkout | Depende del proveedor externo Webpay. | Si falla la pasarela, la orden permanece en estado `PENDIENTE_PAGO` con reintento habilitado. |

---

## Módulo 4: Stakeholders y Permisos HTTP

### 4.1 Matriz de Permisos y Control de Acceso por Rol

El sistema define reglas estrictas de autorización evaluadas según el verbo HTTP, la ruta y la condición de propiedad del recurso.

| Rol / Identidad | ID Servicio | Ruta Solicitada | Verbo HTTP | Decisión | Alcance y Condición | Punto de Verificación |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| **Visitante** | S01 | `/api/v1/products` | GET | Permitido | Acceso libre a productos públicos del catálogo. | API Gateway (Enrutamiento público). |
| **Visitante** | S02 | `/api/v1/orders/cart` | POST | Denegado | Requiere inicio de sesión. Retorna 401 Unauthorized. | API Gateway (`AuthenticationPolicy`). |
| **Cliente Autenticado** | S02 | `/api/v1/orders/cart` | POST | Permitido | Permite agregar ítems únicamente a su propio carrito (`X-User-ID`). | Microservicio `orders`. |
| **Cliente Autenticado** | S04 | `/api/v1/orders/cart/{id}` | DELETE | Permitido | Solo si el ítem pertenece a la sesión del usuario. | Microservicio `orders` (IDOR check). |
| **Administrador** | S01-A | `/api/v1/products` | POST | Permitido | Requiere token JWT con rol `Admin`. | Microservicio `inventory`. |

---

## Módulo 5: Clases del API Gateway

### 5.1 Propósito y Fronteras de Confianza

El API Gateway actúa como el único punto de entrada público a la red de microservicios de OfiExpress. Su función principal radica en validar los tokens de acceso, aplicar límites de tasa y enrutar las solicitudes hacia los microservicios privados inyectando cabeceras de contexto seguras (`X-User-ID`, `X-User-Role`).

### 5.2 Diagrama UML del API Gateway

![Diagrama del API Gateway](img/diagrama_gateway.png)

### 5.3 Descripción de Entidades del Gateway
- **`ApiGateway`**: Componente central de enrutamiento y aplicación de políticas.
- **`RouteDefinition`**: Mapeo entre rutas públicas externas y endpoints internos.
- **`AuthenticationPolicy`**: Verificación de tokens de sesión mediante firma RSA/HMAC.
- **`AuthorizationPolicy`**: Validación de permisos basados en roles por ruta y verbo HTTP.
- **`SecretProvider`**: Gestor de secretos para obtener claves sin exponerlas en el código fuente.

---

## Módulo 6: Rutas y Secretos de Integración

### 6.1 Matriz de Enrutamiento del API Gateway

| ID Servicio | Gateway | Verbo | Ruta Externa | Acceso y Rol | Sistema y Ruta Destino Interno | Controles Técnicos | Referencia de Credencial |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| **S01** | ApiGateway | GET | `/api/v1/products` | Anónimo | `inventory:8081/products` | Filtro de parámetros, sanitización y límite de tasa (100 req/min). | `ref:inventory-read-token` |
| **S01-A** | ApiGateway | POST | `/api/v1/products` | Administrador | `inventory:8081/products` | Validación JWT, rol `Admin`, inyección cabecera `X-User-Role`. | `ref:inventory-admin-key` |
| **S02** | ApiGateway | POST | `/api/v1/orders/cart` | Cliente | `orders:8082/cart` | Verificación JWT, inyección `X-User-ID`, validación de campos. | `ref:orders-service-key` |
| **S03** | ApiGateway | PUT | `/api/v1/orders/cart/{item_id}` | Cliente | `orders:8082/cart/{item_id}` | Validación de pertenencia del ítem según `X-User-ID`. | `ref:orders-service-key` |
| **S04** | ApiGateway | DELETE | `/api/v1/orders/cart/{item_id}` | Cliente | `orders:8082/cart/{item_id}` | Verificación de propiedad antes de remover ítem. | `ref:orders-service-key` |
| **S05** | ApiGateway | POST | `/api/v1/support/contact` | Anónimo / Cliente | `clients:8083/contact` | Sanitización HTML contra XSS, validación formato email RFC 5322. | `ref:clients-contact-key` |
| **S06** | ApiGateway | POST | `/api/v1/payments/checkout` | Cliente | `payments:8084/checkout` | Verificación de token JWT, firma HMAC del pedido. | `ref:payments-transbank-secret` |
| **GQL01** | ApiGateway | POST | `/graphql` | Cliente | `graphql-gateway:4000/graphql` | Validación JWT, análisis AST de profundidad (profundidad ≤ 3). | `ref:graphql-internal-secret` |

### 6.2 Inventario Simbólico de Secretos de Integración

| Referencia Simbólica | Tipo de Credencial | Emisor | Consumidor | Finalidad del Secreto | Almacenamiento Seguro | Política de Rotación |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| `ref:jwt-signing-key` | Clave Asimétrica RSA-256 | `clients` | `ApiGateway`, `graphql-gateway` | Firma y verificación de tokens JWT. | Vault Secret Engine (`/kv/auth/jwt`) | Rotación automática cada 30 días. |
| `ref:inventory-read-token` | Token Interno | Vault Authority | `ApiGateway` | Consultar catálogo e inventario. | Vault Secret Engine (`/kv/services/inventory`) | Rotación semestral. |
| `ref:orders-service-key` | API Key Interna | Vault Authority | `ApiGateway` | Enrutamiento de peticiones del carrito. | Vault Secret Engine (`/kv/services/orders`) | Rotación trimestral. |
| `ref:payments-transbank-secret` | Private API Secret | Transbank | `payments` | Confirmación de transacciones de pago. | Vault Secret Engine (`/kv/payments/transbank`) | Según ciclo del proveedor. |

---

## Módulo 7: Datos Sensibles y Secretos del Cliente

### 7.1 Clasificación y Matriz de Datos del Negocio

| Elemento de Dato | Finalidad de Negocio | Clasificación | Sistema Custodio | Roles Autorizados | Representación Frontend | Medidas de Protección |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| **Catálogo de Productos** | Presentación de catálogo y buscador. | Dato Público | `inventory` | Anónimo, Cliente, Admin | Visible en `index.html` y `categorias.html`. | Sin restricción de lectura. |
| **Nombre y Email** | Identificación de usuario y notificaciones. | Dato Personal | `clients` | Cliente Propietario, Admin | Visible en perfil y cabecera de sesión. | TLS 1.3 en tránsito, acceso por `X-User-ID`. |
| **Dirección de Despacho** | Despacho de compras. | Personal Restringido | `orders` | Cliente Propietario, Operador | Visible solo en resumen (`carrito.html`). | Cifrado en reposo (AES-256), sin logs. |
| **Contraseña** | Autenticación de usuario. | Credencial Sensible | `clients` | Ninguno (Solo motor de auth) | Campo enmascarado (`<input type="password">`). | Hash `bcrypt` con sal (factor de costo 12). |
| **Token de Sesión (JWT)** | Mantener sesión del cliente. | Credencial Efímera | Frontend (Cookie) | Cliente Autenticado | Guardado en Cookie `HttpOnly; Secure`. | Expiración corta (2 horas), antirrobo XSS. |

### 7.2 Decisión Explícita sobre Secretos del Cliente
**Decisión**: La aplicación OfiExpress **NO almacena ni custodia secretos ni claves privadas pertenecientes a los clientes**.

**Fundamentación**:
1. **Pasarela de Pagos Externalizada**: Los datos bancarios y números de tarjeta son procesados exclusivamente en la pasarela externa certificada (Webpay/Transbank). El backend de OfiExpress solo recibe tokens transaccionales de un solo uso.
2. **Hasheado Adaptativo**: Las contraseñas se almacenan como hashes irreversibles `bcrypt` con sal individual, impidiendo la lectura directa incluso para administradores de bases de datos.

### 7.3 Resultados de Casos de Prueba de Seguridad
1. **Prueba SEC-01 (Acceso Anónimo a Recurso Protegido)**: Intento `POST /api/v1/orders/cart` sin token -> Rechazado con HTTP 401.
2. **Prueba SEC-02 (Consulta IDOR de Pedido Ajeno)**: Usuario A solicitando pedido del Usuario B -> Rechazado con HTTP 403 Forbidden.
3. **Prueba SEC-03 (Manipulación de Precios desde el Frontend)**: Inyección de `precio: 10` en el payload -> Rechazado; el servidor re-obtiene el precio de `inventory`.

---

## Módulo 8: Separación Privada y Agregaciones GraphQL

### 8.1 Mapa de Clasificación de Servicios por Naturaleza

| Microservicio | Naturaleza | Responsabilidad Principal | Datos Bajo su Autoridad | Contrato Primario | Dependencias Directas |
| ------ | ------ | ------ | ------ | ------ | ------ |
| **`inventory`** | Dominio / Catálogo | Gestión del catálogo, precios y stock. | Productos, Categorías, Stock. | REST / HTTP (Puerto 8081) | Ninguna. |
| **`orders`** | Transaccional | Gestión del carrito y pedidos. | Carrito de compras, Pedidos. | REST / HTTP (Puerto 8082) | Invoca a `inventory`. |
| **`clients`** | Autenticación / Perfil | Registro de clientes, JWT y soporte. | Usuarios, Hashes, Mensajes. | REST / HTTP (Puerto 8083) | Ninguna. |
| **`payments`** | Integrador Transaccional | Pasarela de pagos externa. | Historial de pagos. | REST / HTTP (Puerto 8084) | Transbank / Webpay. |
| **`graphql-gateway`** | Agregación Privada | Consolidar vistas complejas en una consulta. | Sin DB propia. | GraphQL / HTTP (Puerto 4000) | Invoca a `orders`, `inventory` y `clients`. |

### 8.2 Schema GraphQL (`schema.graphql`)

```graphql
type Producto {
  id: ID!
  titulo: String!
  precio: Int!
  imagen: String!
}

type ItemPedido {
  id: ID!
  cantidad: Int!
  subtotal: Int!
  producto: Producto!
}

type ClientePerfil {
  id: ID!
  nombre: String!
  email: String!
}

type PedidoResumen {
  id: ID!
  estado: String!
  total: Int!
  cliente: ClientePerfil!
  items: [ItemPedido!]!
  fechaCreacion: String!
}

type Query {
  obtenerPedidoResumen(pedidoId: ID!): PedidoResumen
}
```

### 8.3 Resolver de Agregación (`resolvers.js`)

```javascript
const resolvers = {
  Query: {
    obtenerPedidoResumen: async (_, { pedidoId }, context) => {
      if (!context.userId) throw new Error("No autorizado");

      // 1. Consulta a microservicio 'orders'
      const orderRes = await fetch(`http://orders:8082/internal/orders/${pedidoId}`);
      if (!orderRes.ok) throw new Error("Pedido no encontrado");
      const orderData = await orderRes.json();

      if (orderData.cliente_id !== context.userId) {
        throw new Error("Acceso denegado al pedido solicitado");
      }

      // 2. Consulta a microservicio 'clients'
      const clientRes = await fetch(`http://clients:8083/internal/clients/${orderData.cliente_id}`);
      const clientData = await clientRes.json();

      // 3. Resolución en paralelo de productos desde 'inventory'
      const itemsConProducto = await Promise.all(
        orderData.items.map(async (item) => {
          const prodRes = await fetch(`http://inventory:8081/products/${item.producto_id}`);
          const prodData = await prodRes.json();
          return {
            id: item.id,
            cantidad: item.cantidad,
            subtotal: prodData.precio * item.cantidad,
            producto: prodData
          };
        })
      );

      return {
        id: orderData.id,
        estado: orderData.estado,
        total: itemsConProducto.reduce((acc, i) => acc + i.subtotal, 0),
        cliente: {
          id: clientData.id,
          nombre: clientData.nombre,
          email: clientData.email
        },
        items: itemsConProducto,
        fechaCreacion: orderData.fecha_creacion
      };
    }
  }
};
```

---

## Módulo 9: Analítica y Comunicación gRPC (ADR-001)

### Architectural Decision Record (ADR-001)

- **Título**: Evaluacion de Aplicabilidad de gRPC y Servicios de Analítica en Papelería OfiExpress
- **Estado**: Aprobado
- **Contexto**: Evaluación de la necesidad de comunicación binaria gRPC y clusters de procesamiento analítico Big Data.
- **Decisión**:
  1. **No aplicabilidad de Big Data**: El volumen proyectado (1,000 SKUs, 500-1,500 pedidos/día) se resuelve eficientemente con réplicas de lectura PostgreSQL y caché Redis (TTL 1h).
  2. **Aplicabilidad de gRPC Unary para Reserva de Stock**: Se adopta gRPC Unary interno entre `orders` e `inventory` para evitar condiciones de carrera durante el Checkout.

#### Contrato Proto (`inventory_service.proto`):
```protobuf
syntax = "proto3";

package inventory;

service InventoryService {
  rpc ReservarStock (ReservaRequest) returns (ReservaResponse);
}

message ItemReserva {
  int32 producto_id = 1;
  int32 cantidad = 2;
}

message ReservaRequest {
  string pedido_id = 1;
  repeated ItemReserva items = 2;
}

message ReservaResponse {
  bool exito = 1;
  string mensaje = 2;
  int32 tiempo_expiracion_segundos = 3;
}
```

---

## Módulo 10: Backend Completo e Integración Verificable

### 10.1 Estructura del Repositorio del Backend

```text
Backend/
├── img/
│   ├── diagrama_dominio.drawio.png
│   └── diagrama_gateway.png
├── api-gateway/
│   ├── src/
│   │   ├── routes/
│   │   ├── policies/
│   │   │   └── auth.js
│   │   └── index.js
│   ├── test.js
│   ├── package.json
│   └── Dockerfile
├── services/
│   ├── inventory/
│   │   ├── src/
│   │   │   ├── index.js
│   │   │   └── grpc_server.js
│   │   ├── proto/
│   │   │   └── inventory_service.proto
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── orders/
│   │   ├── src/
│   │   │   └── index.js
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── clients/
│   │   ├── src/
│   │   │   └── index.js
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── payments/
│   │   ├── src/
│   │   │   └── index.js
│   │   ├── package.json
│   │   └── Dockerfile
│   └── graphql-gateway/
│       ├── src/
│       │   ├── schema.graphql
│       │   ├── resolvers.js
│       │   └── index.js
│       ├── package.json
│       └── Dockerfile
├── config/
│   └── .env.example
├── docker-compose.yml
├── json.json
└── readme.md
```

### 10.2 Comandos de Despliegue Reproducible

```bash
# 1. Copiar archivo de variables de entorno
cp config/.env.example .env

# 2. Levantar la red de microservicios con Docker Compose
docker-compose up --build -d

# 3. Verificar estado de salud de la red
curl http://localhost:8080/health

# 4. Ejecutar suite de pruebas integradas
docker-compose exec api-gateway npm test
```

---
