<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Planes</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>

</head>
<body class="d-flex flex-column min-vh-100">
    <!-- A grey horizontal navbar that becomes vertical on small screens -->
<nav class="navbar navbar-expand-lg bg-success">
  <div class="container-fluid">
    <a class="navbar-brand m-3 fw-bold fs-2" href="index.php">Gimnasio</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-end px-5" id="navbarNavAltMarkup">
      <div class="navbar-nav">
        <a class="nav-link active " aria-current="page" href="planes.php">Planes</a>
        <a class="nav-link active" href="#">Empresa</a>
        <a class="nav-link active" href="#">Opiniones</a>
      </div>
    </div>
  </div>
</nav>

<div class="container mt-5">
            <h2 class="text-center mb-5">Planes de TuGimnasio</h2>
            
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body text-center p-4">
                            <div class="feature-icon">
                                <i class="bi bi-cash"></i>
                            </div>
                            <h3 class="h4">Plan Mensual</h3>
                            <p class="text-muted">$20.000</p>
                            <p class="text-muted">Acceso a Sucursal Unica</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body text-center p-4">
                            <div class="feature-icon">
                                <i class="bi bi-cash-coin"></i>
                            </div>
                            <h3 class="h4">Plan Semestral</h3>
                            <p class="text-muted">$100.000</p>
                            <p class="text-muted">Acceso a 3 Sucursales</p>
                            <p class="text-muted">1 Evaluacion Gratis</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body text-center p-4">
                            <div class="feature-icon">
                                <i class="bi bi-cash-stack"></i>
                            </div>
                            <h3 class="h4">Plan Anual</h3>
                            <p class="text-muted">$210.000</p>
                            <p class="text-muted">Acceso a Todas las Sucursales</p>
                            <p class="text-muted">3 Evaluaciones por año</p>
                            <p class="text-muted">Entrenador Asignado</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

<!--Footer-->
<div class="container-fluid bg-success py-3 mt-auto">
  <div class="row">
    <div class="col-12 text-center text-white">
      <strong>TuGimnasio</strong>
    </div>
  </div> 
</div>

</body>
</html>