<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pagina Principal</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>

</head>
<body>
    <!-- A grey horizontal navbar that becomes vertical on small screens -->
<nav class="navbar navbar-expand-lg bg-success">
  <div class="container-fluid">
    <a class="navbar-brand m-3 fw-bold fs-2" href="index.php">TuGimnasio</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-end px-5" id="navbarNavAltMarkup">
      <div class="navbar-nav">
        <a class="nav-link active " aria-current="page" href="planes.php">Planes</a>
        <a class="nav-link active" href="empresa.php">Empresa</a>
        <a class="nav-link active" href="opiniones.php">Opiniones</a>
      </div>
    </div>
  </div>
</nav>
<!-- Carousel -->
<div id="demo" class="carousel slide mb-4" data-bs-ride="carousel">

  <!-- Indicators/dots -->
  <div class="carousel-indicators">
    <button type="button" data-bs-target="#demo" data-bs-slide-to="0" class="active"></button>
    <button type="button" data-bs-target="#demo" data-bs-slide-to="1"></button>
    <button type="button" data-bs-target="#demo" data-bs-slide-to="2"></button>
  </div>

  <!-- The slideshow/carousel -->
  <div class="carousel-inner">

    <div class="carousel-item active">
      <img src="img/img1.jpg" alt="Fuerza" class="d-block w-100">
      <div class="carousel-caption">
      <h3>Entrenamientos de Fuerza</h3>
      <p>Todas las maquinas y equipamiento disponibles!</p>
      </div>
    </div>

    <div class="carousel-item">
      <img src="img/img2.jpg" alt="Cardio" class="d-block w-100">
      <div class="carousel-caption">
      <h3>Entrenamientos de Cardio</h3>
      <p>Contamos con caminadoras y escaleras!</p>
      </div>
    </div> 
    
    <div class="carousel-item">
      <img src="img/img3.jpg" alt="Bailoterapia" class="d-block w-100">
      <div class="carousel-caption">
      <h3>Bailoterapia</h3>
      <p>Todos los martes y jueves!</p>
      </div>
    </div>
  </div>

  <!-- Left and right controls/icons -->
  <button class="carousel-control-prev" type="button" data-bs-target="#demo" data-bs-slide="prev">
    <span class="carousel-control-prev-icon"></span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
    <span class="carousel-control-next-icon"></span>
  </button>

</div>







<!--Footer-->
<div class="container-fluid bg-success py-3 mt-5">
  <div class="row">
    <div class="col-12 text-center text-white">
      <strong>TuGimnasio</strong>
    </div>
  </div> 
</div>
</body>
</html>