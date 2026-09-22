# README - Modelo de Desarrollo "OfiExpress"

Este documento detalla cómo se conceptualizó, estructuró y desarrolló el modelo de la aplicación web para la papelería "OfiExpress", partiendo desde el boceto inicial y los requerimientos de interacción.

## 1. Contexto y Definición del Modelo
El proyecto nace de la necesidad de diseñar la interfaz y la experiencia de usuario (Frontend) para un sistema de ventas online de una papelería (útiles de oficina y escolares). Tomando como inspiración la estructura de modelos de negocio de venta digital, el objetivo fue crear un flujo donde el cliente pueda explorar un catálogo, seleccionar productos y gestionar una orden de compra, todo simulado desde el navegador.

## 2. Modelo de Negocio (Flujo del Usuario)
El modelo de interacción se diseñó siguiendo las etapas clásicas de un E-commerce:
*   **Atracción y Exploración:** Un carrusel promocional dinámico y un catálogo dividido por categorías (Escolares, Oficina, Arte y Diseño, Cuadernos).
*   **Selección (Micro-interacción):** Al interactuar con un producto, un mini-carrito flotante (viñeta) se actualiza de inmediato, brindando retroalimentación visual al usuario sin sacarlo del catálogo.
*   **Consolidación de la Orden:** Una vista dedicada (`carrito.php`) donde el modelo de datos calcula subtotales, permite la edición de cantidades y gestiona la eliminación de ítems, simulando el paso previo a una pasarela de pago.

## 3. Arquitectura y Construcción del Modelo
Para cumplir con el requisito de generar un prototipo donde la lógica funcionara de forma independiente al servidor, el modelo se construyó en tres capas técnicas:

### Capa de Estructura (Vistas en PHP/HTML)
*   Se diseñó una arquitectura multipágina (`index.php`, `categorias.php`, `carrito.php`, `contacto.php`) corriendo sobre un servidor local Apache (XAMPP).
*   Se mapeó exactamente la distribución del boceto de referencia: barra de navegación superior con buscador y accesos rápidos, área de banners, y grillas de contenido modular para los productos.

### Capa de Presentación (UI/UX y Paleta de Colores)
*   El modelo visual se construyó utilizando CSS puro. Se implementó la paleta de colores exacta requerida desde el inicio a través de variables CSS (`:root`).
*   Para modernizar el boceto sin alterar su esencia, se aplicaron técnicas contemporáneas: tipografía sin serifa (Google Fonts 'Poppins'), sombras dinámicas (`box-shadow`), bordes redondeados y renderizado de imágenes escalado (`object-fit: contain`) para mantener la proporción de los productos.

### Capa de Lógica y Persistencia de Datos (JavaScript + LocalStorage)
*   **El Modelo de Datos:** Se prescindió de una base de datos relacional para este prototipo. En su lugar, el modelo de negocio opera interceptando los eventos del DOM (clics en "Agregar al Carrito").
*   **Persistencia:** Mediante JavaScript, los atributos de cada producto (título, precio, imagen) se empaquetan en objetos JSON y se almacenan en el `localStorage` del navegador. Esto garantiza que el "estado" de la aplicación (el carrito de compras) persista mientras el usuario navega entre las diferentes páginas `.php`.
*   **Procesamiento:** El motor en `app.js` lee los datos en memoria, realiza los cálculos aritméticos (cantidad x precio), formatea los resultados a moneda local y renderiza (inyecta HTML) dinámicamente tanto la viñeta flotante como la tabla principal del carrito.

## 4. Conclusión
El modelo construido resuelve el requerimiento de una interfaz funcional e interactiva manejada 100% mediante JavaScript y URLs. La estructura modular elegida deja el proyecto completamente preparado para una futura integración backend, donde las funciones de guardado en `localStorage` podrán ser reemplazadas por peticiones a una base de datos real sin alterar el diseño ni la experiencia del usuario.
