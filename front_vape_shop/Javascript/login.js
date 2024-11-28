document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-container form');
    const errorMessage = document.getElementById('error-message');
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect') || 'index.html'; // Redirigir a 'index.html' si no hay parámetro 'redirect'

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Evita el envío del formulario por defecto

        const correo = loginForm.querySelector('input[type="text"]').value;
        const contrasenya = loginForm.querySelector('input[type="password"]').value;

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correo, contrasenya })
            });

            if (!response.ok) {
                // Mostrar mensaje de error genérico
                errorMessage.textContent = 'Error al ingresar contraseña o usuario';
                return;
            }

            const usuario = await response.json();
            console.log('Usuario autenticado:', usuario);

            // Guardar id_usuario en el localStorage
            localStorage.setItem('id_usuario', usuario.id_usuario);

            // Redirigir según el tipo de usuario
            if (usuario.tipo === 'admin') {
                window.location.href = 'admin/menuAdmin.html';
                return;
            } else if (usuario.tipo === 'usuario') {
                // Obtener id_carrito del localStorage
                const id_carrito = localStorage.getItem('id_carrito');

                if (id_carrito) {
                    // Verificar si el usuario tiene un carrito inactivo
                    const carritoResponse = await fetch(`http://localhost:3000/api/carrito/inactivo/${usuario.id_usuario}`);
                    const carritoData = await carritoResponse.json();
                    localStorage.setItem('id_carrito', carritoData.carrito.id_carrito);

                    if (carritoData.tieneCarritoInactivo) {
                        // Guardar el id_carrito inactivo en el localStorage
                        localStorage.setItem('id_carrito', carritoData.carrito.id_carrito);
                    } else {
                        // Enviar solicitud PUT para actualizar el carrito
                        await fetch('http://localhost:3000/api/carrito', {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                id_carrito: id_carrito,
                                id_usuario: usuario.id_usuario,
                                activo: false
                            })
                        });
                    }
                }

                window.location.href = redirectUrl;
            } else {
                errorMessage.textContent = 'Tipo de usuario desconocido';
                console.error('Tipo de usuario desconocido:', usuario.tipo);
            }
        } catch (error) {
            // Mostrar mensaje de error genérico
            errorMessage.textContent = 'Error al ingresar contraseña o usuario';
            console.error('Error en el login:', error);
        }
    });
});