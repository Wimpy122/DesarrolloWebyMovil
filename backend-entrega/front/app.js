document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. LÓGICA DE INTERFAZ (Buscador y Viñeta) ---
    const btnBuscar = document.getElementById("btn-buscar");
    const searchContainer = document.getElementById("search-container");

    if (btnBuscar && searchContainer) {
        btnBuscar.addEventListener("click", () => {
            searchContainer.classList.toggle("hidden");
            if (!searchContainer.classList.contains("hidden")) {
                searchContainer.querySelector("input").focus();
            }
        });
    }

    const btnCarrito = document.getElementById("btn-carrito");
    const miniCarrito = document.getElementById("mini-carrito");

    if (btnCarrito && miniCarrito) {
        btnCarrito.addEventListener("click", (e) => {
            e.stopPropagation();
            miniCarrito.classList.toggle("hidden");
        });

        document.addEventListener("click", (e) => {
            if (!miniCarrito.contains(e.target) && e.target !== btnCarrito) {
                miniCarrito.classList.add("hidden");
            }
        });
    }

    // --- 2. CARRUSEL ---
    const carouselInner = document.querySelector(".carousel-inner");
    const slides = document.querySelectorAll(".carousel-item");
    const dots = document.querySelectorAll(".dot");
    let slideIndex = 0;

    if (carouselInner && slides.length > 0) {
        function showSlide(index) {
            if (index >= slides.length) slideIndex = 0;
            if (index < 0) slideIndex = slides.length - 1;
            carouselInner.style.transform = `translateX(-${slideIndex * 100}%)`;
            dots.forEach(dot => dot.classList.remove("active"));
            if(dots[slideIndex]) dots[slideIndex].classList.add("active");
        }

        window.moveSlide = step => { slideIndex += step; showSlide(slideIndex); };
        window.currentSlide = index => { slideIndex = index; showSlide(slideIndex); };
        setInterval(() => moveSlide(1), 5000); 
    }

    // --- 3. LÓGICA DEL CARRITO (LocalStorage) ---
    let carrito = JSON.parse(localStorage.getItem("ofiExpressCart")) || [];

    function guardarCarrito() {
        localStorage.setItem("ofiExpressCart", JSON.stringify(carrito));
        actualizarMiniCarrito();
        actualizarCarritoCompleto();
    }

    // Formatear a CLP (ej: 6500 -> $6.500)
    function formatearPrecio(precio) {
        return "$" + precio.toLocaleString("es-CL");
    }

    function actualizarMiniCarrito() {
        const miniCarritoContainer = document.querySelector(".mini-carrito-items");
        if (!miniCarritoContainer) return;

        if (carrito.length === 0) {
            miniCarritoContainer.innerHTML = "<p>El carrito está vacío.</p>";
            return;
        }

        let total = 0;
        let html = '<ul style="list-style: none; padding: 0; margin-bottom: 10px;">';
        
        carrito.forEach((prod, index) => {
            total += prod.precio * prod.cantidad;
            html += `
                <li style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 5px 0; font-size: 0.9rem;">
                    <span>${prod.cantidad}x ${prod.titulo}</span>
                    <span style="font-weight: bold; color: var(--color-2);">${formatearPrecio(prod.precio * prod.cantidad)}</span>
                </li>
            `;
        });
        
        html += `</ul>
                 <div style="text-align: right; font-weight: bold; font-size: 1.1rem; color: var(--color-3);">
                    Total: ${formatearPrecio(total)}
                 </div>`;
                 
        miniCarritoContainer.innerHTML = html;
    }

    function actualizarCarritoCompleto() {
        const cartTableBody = document.getElementById("cart-table-body");
        const cartTotalSpan = document.getElementById("cart-total");
        if (!cartTableBody) return; // Solo se ejecuta si estamos en carrito.php

        if (carrito.length === 0) {
            cartTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem;">No hay productos en tu carrito aún.</td></tr>`;
            cartTotalSpan.innerText = "$0";
            return;
        }

        let total = 0;
        cartTableBody.innerHTML = "";

        carrito.forEach((prod, index) => {
            total += prod.precio * prod.cantidad;
            cartTableBody.innerHTML += `
                <tr style="border-bottom: 1px solid var(--color-5);">
                    <td style="padding: 1rem;"><img src="${prod.imagen}" width="50" style="border-radius: 4px;"></td>
                    <td style="padding: 1rem; font-weight: 500;">${prod.titulo}</td>
                    <td style="padding: 1rem;">${formatearPrecio(prod.precio)}</td>
                    <td style="padding: 1rem;">
                        <input type="number" value="${prod.cantidad}" min="1" onchange="cambiarCantidad(${index}, this.value)" style="width: 60px; padding: 0.3rem; border-radius: 4px; border: 1px solid var(--color-5);">
                    </td>
                    <td style="padding: 1rem; font-weight: bold; color: var(--color-2);">${formatearPrecio(prod.precio * prod.cantidad)}</td>
                    <td style="padding: 1rem;">
                        <button onclick="eliminarProducto(${index})" style="background-color: #ff4d4d; color: white; border: none; padding: 0.5rem; border-radius: 4px; cursor: pointer;">🗑️</button>
                    </td>
                </tr>
            `;
        });

        cartTotalSpan.innerText = formatearPrecio(total);
    }

    // Funciones globales para que el HTML (onclick) pueda usarlas
    window.cambiarCantidad = (index, nuevaCantidad) => {
        carrito[index].cantidad = parseInt(nuevaCantidad);
        guardarCarrito();
    };

    window.eliminarProducto = (index) => {
        carrito.splice(index, 1);
        guardarCarrito();
    };

    // Escuchar clics en los botones "Agregar al Carrito"
    const botonesAgregar = document.querySelectorAll(".btn-add");
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", (e) => {
            const card = e.target.closest(".product-card");
            const titulo = card.querySelector(".product-title").innerText;
            // Limpiar el texto del precio para convertirlo a número (quita $ y puntos)
            const precioTexto = card.querySelector(".product-price").innerText;
            const precio = parseInt(precioTexto.replace("$", "").replace(/\./g, "")); 
            const imagen = card.querySelector("img").src;

            // Revisar si ya existe
            const productoExistente = carrito.find(item => item.titulo === titulo);
            if (productoExistente) {
                productoExistente.cantidad += 1;
            } else {
                carrito.push({ titulo, precio, imagen, cantidad: 1 });
            }

            guardarCarrito();
            
            // Abrir la viñeta para dar feedback visual de que se agregó
            miniCarrito.classList.remove("hidden");
            
            // Animación al botón
            const originalText = boton.innerText;
            boton.innerText = "¡Agregado!";
            boton.style.backgroundColor = "var(--color-2)";
            setTimeout(() => {
                boton.innerText = originalText;
                boton.style.backgroundColor = "";
            }, 1000);
        });
    });

    // Inicializar vistas
    actualizarMiniCarrito();
    actualizarCarritoCompleto();
});