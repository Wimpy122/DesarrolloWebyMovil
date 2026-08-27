<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TuGimnasio</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
</head>

<body onload="cargarOpiniones();">

    <nav class="navbar navbar-expand-lg bg-success">
        <div class="container-fluid">
            <a class="navbar-brand m-3 fw-bold fs-2" href="index.php">TuGimnasio</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end px-5" id="navbarNavAltMarkup">
                <div class="navbar-nav">
                    <a class="nav-link active" href="planes.php">Planes</a>
                    <a class="nav-link active" href="empresa.php">Empresa</a>
                    <a class="nav-link active" href="opiniones.php">Opiniones</a>
                </div>
            </div>
        </div>
    </nav>



    <style>
        #myCarousel .carousel-item {
            padding: 20px 60px 50px 60px;
        }

        #myCarousel .carousel-indicators {
            margin-bottom: 0.5rem;
        }

        #myCarousel .carousel-control-prev-icon,
        #myCarousel .carousel-control-next-icon {
            filter: invert(1) grayscale(100);
        }

        #myCarousel .carousel-indicators [data-bs-target] {
            background-color: #000;
            opacity: 0.5;
        }

        #myCarousel .carousel-indicators .active {
            background-color: #000;
            opacity: 1;
        }
    </style>

    <div class="container">

        <div class="container py-5">
            <div class="text-center mb-5">
                <h2 class="fw-bold">Opiniones de Clientes</h2>
                <p class="lead text-muted">Lo que dicen quienes ya entrenan con nosotros.</p>
            </div>

            <div id="myCarousel" class="carousel slide" data-bs-ride="carousel">
                <!-- Indicadores: se llenan por JS en cargarOpiniones() -->
                <div class="carousel-indicators" id="carouselIndicators"></div>

                <!-- Wrapper para slides: se llena por JS en cargarOpiniones() -->
                <div class="carousel-inner" id="carouselInner"></div>

                <!-- Left and right controls -->
                <button class="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>

        <div class="row text-center g-4 mt-5">
            <div class="col-md-4">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body">
                        <i class="bi bi-star-fill text-success fs-1 mb-3"></i>
                        <h3 class="fw-bold">4.8/5</h3>
                        <p class="text-muted mb-0">Calificación promedio de nuestros socios</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body">
                        <i class="bi bi-people-fill text-success fs-1 mb-3"></i>
                        <h3 class="fw-bold">500+</h3>
                        <p class="text-muted mb-0">Socios activos entrenando con nosotros</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body">
                        <i class="bi bi-hand-thumbs-up-fill text-success fs-1 mb-3"></i>
                        <h3 class="fw-bold">95%</h3>
                        <p class="text-muted mb-0">Recomendaría TuGimnasio a un amigo</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="text-center mt-5 mb-5 pb-4">
            <h5 class="fw-bold">¿Quieres ser parte de estas historias?</h5>
            <p class="text-muted">Súmate hoy y empieza tu propio cambio.</p>
            <a href="planes.php" class="btn btn-success btn-lg">Ver planes y precios</a>
            <br>
        </div>

        <div class="text-center mb-5">
            <h5 class="fw-bold mb-3">¿Ya entrenaste con nosotros? Cuéntanos tu experiencia</h5>
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <textarea id="txtOpinion" class="form-control mb-3" rows="3"
                        placeholder="Escribe tu opinión aquí..."></textarea>
                    <button type="button" class="btn btn-success" onclick="agregarOpinion();">
                        Publicar opinión
                    </button>
                </div>
            </div>
        </div>
    </div>


    <!-- FOOTER  -->
    <div class="container-fluid bg-success py-3 mt-auto">
        <div class="row">
            <div class="col-12 text-center text-white">
                <strong>TuGimnasio</strong>
            </div>
        </div>
    </div>

    <script>
        // Simula la "data" que en un caso real vendría de una llamada a una API
        // (mismo patrón que respuestaAPI.data en practica1.js / practica2.js)
        const opiniones = [
            {
                texto: "Se lo recomiendo a todos mis amigos y familiares. El espacio es grande y las máquinas están bien mantenidas."
            },
            {
                texto: "Los entrenadores personales son muy amigables y siempre están dispuestos a ayudar."
            },
            {
                texto: "Me gusta mucho el ambiente del gimnasio. Nunca está muy lleno, los entrenadores son simpáticos y el volumen de la música no molesta."
            }
        ];

        // Crea UN slide (carousel-item) + SU indicador, y los agrega al DOM.
        // Se reutiliza tanto para la carga inicial como para las opiniones nuevas.
        function crearSlideOpinion(texto, indice, activo) {
            const contenedorSlides = document.getElementById("carouselInner");
            const contenedorIndicadores = document.getElementById("carouselIndicators");

            // --- Slide (carousel-item) ---
            const slide = document.createElement("div");
            slide.setAttribute("class", "carousel-item" + (activo ? " active" : ""));

            const quote = document.createElement("blockquote");
            const parrafo = document.createElement("p");
            parrafo.setAttribute("class", "text-center");
            parrafo.innerText = texto;

            quote.appendChild(parrafo);
            slide.appendChild(quote);
            contenedorSlides.appendChild(slide);

            // --- Indicador (el botoncito de abajo) ---
            const indicador = document.createElement("button");
            indicador.setAttribute("type", "button");
            indicador.setAttribute("data-bs-target", "#myCarousel");
            indicador.setAttribute("data-bs-slide-to", indice);
            indicador.setAttribute("aria-label", `Slide ${indice + 1}`);
            if (activo) {
                indicador.setAttribute("class", "active");
                indicador.setAttribute("aria-current", "true");
            }
            contenedorIndicadores.appendChild(indicador);
        }

        // Evento onload del body: recorre el array "opiniones" con forEach
        // y construye TODO el carrusel apenas termina de cargar la página.
        function cargarOpiniones() {
            opiniones.forEach((opinion, indice) => {
                crearSlideOpinion(opinion.texto, indice, indice === 0);
            });
        }

        // Evento onclick del botón "Publicar opinión": lee lo que el usuario
        // escribió en el textarea y agrega un slide nuevo al carrusel, en vivo.
        function agregarOpinion() {
            const input = document.getElementById("txtOpinion");
            const texto = input.value.trim();

            if (texto === "") {
                alert("Escribe tu opinión antes de publicarla.");
                return;
            }

            // La agregamos también al array, por si luego queremos recorrerlo de nuevo
            opiniones.push({ texto: texto });

            // El nuevo slide nunca es el "activo" (no le robamos el foco al carrusel)
            crearSlideOpinion(texto, opiniones.length - 1, false);

            input.value = "";
        }
    </script>

</body>

</html>
