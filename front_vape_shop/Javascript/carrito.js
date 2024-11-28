document.addEventListener('DOMContentLoaded', function() {
    const carritoId = localStorage.getItem('id_carrito');

    if (!carritoId) {
        // No hay carrito en el localStorage, crear uno nuevo
        fetch('http://localhost:3000/api/carrito', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ /* datos necesarios para crear el carrito */ })
        })
        .then(response => response.json())
        .then(data => {
            // Guardar el id_carrito en el localStorage
            localStorage.setItem('id_carrito', data.id_carrito);
            console.log('Carrito creado:', data);
        })
        .catch(error => console.error('Error creando el carrito:', error));
    } else {
        // Ya existe un carrito en el localStorage
        console.log('Carrito existente:', carritoId);
    }
});