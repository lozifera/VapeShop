document.addEventListener('DOMContentLoaded', function() {
    const carritoId = localStorage.getItem('id_carrito') 

    fetch(`http://localhost:3000/api/carrito/${carritoId}`)
        .then(response => response.json())
        .then(data => {
            const carritoSection = document.getElementById('lista-carrito');
            let total = 0; // Inicializar el total

            if (data.productos && data.productos.length > 0) {
                data.productos.forEach(producto => {
                    const productoDiv = document.createElement('div');
                    productoDiv.classList.add('producto');
                    productoDiv.innerHTML = `
                        <img src="http://localhost:3000/api/producto/imagen/${producto.id_producto}" alt="${producto.nombre}">   
                        <div>                 
                        <h3>${producto.nombre}</h3>
                        <p>${producto.id_producto}</p>
                        <p>${producto.descripcion}</p>
                        <p>Precio: ${producto.precioventa}</p>
                        <p>Cantidad: <input type="number" value="${producto.cantidad}" min="1" id="cantidad-${producto.id_producto}"></p>
                        <p>Total: ${producto.precioventa * producto.cantidad}</p>
                        <button onclick="actualizarCantidad(${producto.id_producto}, ${carritoId}, ${producto.precioventa})">Actualizar Cantidad</button>
                        </div>
                    `;
                    carritoSection.appendChild(productoDiv);

                    // Sumar el total del producto al total general
                    total += producto.precioventa * producto.cantidad;
                });

                // Actualizar el total en el HTML
                document.getElementById('total').textContent = `$${total.toFixed(2)}`;
            } else {
                carritoSection.innerHTML = '<p>No hay productos en el carrito.</p>';
            }
        })
        .catch(error => console.error('Error obteniendo el carrito:', error));
});

function actualizarCantidad(productoId, carritoId, precioventa) {
    const nuevaCantidad = document.getElementById(`cantidad-${productoId}`).value;
    fetch(`http://localhost:3000/api/carritoProducto`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_producto: productoId,
            id_carrito: carritoId,
            cantidad: nuevaCantidad,
            precioventa: precioventa
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Error actualizando la cantidad');
            location.reload(); // Recargar la página para mostrar los cambios
        } else {
            alert('Cantidad actualizada correctamente');
            
            location.reload();
        }
    })
    .catch(error => console.error('Error actualizando la cantidad:', error));
}
function realizarPedido() {
    const id_usuario = localStorage.getItem('id_usuario');
    const id_carrito = localStorage.getItem('id_carrito');
    const total = parseFloat(document.getElementById('total').textContent.replace('$', ''));

    if (!id_usuario) {
        // Redirigir a registro.html si no hay id_usuario
        window.location.href = 'registro.html';
    } else {
        // Enviar solicitud PUT para actualizar el carrito
        fetch('http://localhost:3000/api/carrito', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_carrito: id_carrito,
                id_usuario: id_usuario,
                activo: true
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('Error al actualizar el carrito');
                return;
            }
            // Borrar id_carrito del localStorage
            localStorage.removeItem('id_carrito');

            // Enviar solicitud POST para crear el pedido
            return fetch('http://localhost:3000/api/pedido', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_carrito: id_carrito,
                    id_usuario: id_usuario,
                    precio: total
                })
            });
        })
        .then(response => response.json())
        .then(data => {
            if (data.id_pedido) {
                alert('Pedido realizado con éxito');
                window.location.href = 'index.html';
            } else {
                alert('Error al realizar el pedido');
            }
        })
        .catch(error => console.error('Error al realizar el pedido:', error));
    }
}