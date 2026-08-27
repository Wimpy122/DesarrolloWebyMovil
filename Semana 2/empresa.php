<!DOCTYPE html>
<html lang="es">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>TuGimnasio</title>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</head>

<body>

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


	<section class="container py-5">
		<div class="text-center mb-5">
			<h2 class="fw-bold">Nuestra Empresa</h2>
			<p class="lead text-muted">Más que un gimnasio, el lugar donde vas a lograr tus metas.</p>
		</div>

		<div class="row align-items-center mb-5">
			<div class="col-md-6">
				<h4 class="fw-bold mb-3">Entrena como siempre quisiste, hoy mismo</h4>
				<p>
					En <strong>TuGimnasio</strong> sabemos que empezar es lo más difícil. Por eso creamos
					un espacio con equipamiento de última generación, entrenadores certificados y una
					comunidad que te va a acompañar en cada paso, sin importar tu nivel actual.
				</p>
				<p>
					Más de <strong>500 socios activos</strong> ya transformaron su rutina con nosotros.
					Es tu turno.
				</p>
				<a href="planes.php" class="btn btn-success btn-lg mt-2">Agenda tu clase de prueba gratis</a>
			</div>
			<div class="col-md-6 text-center mt-4 mt-md-0">
				<img src="img/gimnasio.jpg" class="img-fluid rounded shadow" alt="Instalaciones de TuGimnasio">
			</div>
		</div>

		<div class="row text-center g-4">
			<div class="col-md-4">
				<div class="card h-100 border-0 shadow-sm">
					<div class="card-body">
						<i class="bi bi-award-fill text-success fs-1 mb-3"></i>
						<h5 class="card-title fw-bold">Entrenadores certificados</h5>
						<p class="card-text text-muted">
							Un equipo profesional guiando cada uno de tus entrenamientos.
						</p>
					</div>
				</div>
			</div>
			<div class="col-md-4">
				<div class="card h-100 border-0 shadow-sm">
					<div class="card-body">
						<i class="bi bi-clock-fill text-success fs-1 mb-3"></i>
						<h5 class="card-title fw-bold">Horario extendido</h5>
						<p class="card-text text-muted">
							Abierto todos los días para que entrenes cuando te acomode.
						</p>
					</div>
				</div>
			</div>
			<div class="col-md-4">
				<div class="card h-100 border-0 shadow-sm">
					<div class="card-body">
						<i class="bi bi-people-fill text-success fs-1 mb-3"></i>
						<h5 class="card-title fw-bold">Comunidad real</h5>
						<p class="card-text text-muted">
							Un ambiente cercano donde nadie entrena solo.
						</p>
					</div>
				</div>
			</div>
		</div>

		<div class="text-center mt-5">
			<h5 class="fw-bold">¿Listo para empezar?</h5>
			<p class="text-muted">Sin letra chica. Sin excusas. Solo resultados.</p>
			<a href="planes.php" class="btn btn-outline-success btn-lg">Ver planes y precios</a>
		</div>
	</section>


	<!-- FOOTER  -->
	<div class="container-fluid bg-success py-3 mt-auto">
		<div class="row">
			<div class="col-12 text-center text-white">
				<strong>TuGimnasio</strong>
			</div>
		</div>
	</div>

</body>

</html>