document.addEventListener('DOMContentLoaded', function() {
    const id_usuario = localStorage.getItem('id_usuario');

    if (!id_usuario) {
        console.error('No se encontró el id_usuario en el localStorage');
        return;
    }

    fetch(`http://localhost:3000/api/pedidos/${id_usuario}`)
        .then(response => response.json())
        .then(data => renderPedidos(data))
        .catch(error => console.error('Error fetching data:', error));
});

function renderPedidos(pedidos) {
    const container = document.createElement('div');
    container.className = 'pedido-container';

    pedidos.forEach(pedido => {
        const pedidoDiv = document.createElement('div');
        pedidoDiv.className = 'pedido';

        const pedidoDetails = `
            <h2>Pedido ID: ${pedido.id_pedido}</h2>
            <p>Precio: ${pedido.pedido_precio}</p>
            <p>Fecha: ${new Date(pedido.fecha).toLocaleDateString()}</p>
            <button class="toggle-button">Mostrar Productos</button>
        `;

        pedidoDiv.innerHTML = pedidoDetails;

        const carrito = pedido.carritos[Object.keys(pedido.carritos)[0]];
        const productosList = document.createElement('ul');
        productosList.className = 'productos-list';

        carrito.productos.forEach(producto => {
            const productoItem = document.createElement('li');
            productoItem.className = 'producto-item';

            const img = document.createElement('img');
            img.src = `http://localhost:3000/api/producto/imagen/${producto.id_producto}`;
            img.alt = producto.producto_nombre;

            productoItem.innerHTML = `
                <h3>${producto.producto_nombre}</h3>
                <p>Descripción: ${producto.descripcion}</p>
                <p>Precio: ${producto.producto_precio}</p>
                <p>Cantidad: ${producto.cantidad}</p>
            `;

            productoItem.insertBefore(img, productoItem.firstChild);

            productosList.appendChild(productoItem);
        });

        pedidoDiv.appendChild(productosList);
        container.appendChild(pedidoDiv);

        const toggleButton = pedidoDiv.querySelector('.toggle-button');
        toggleButton.addEventListener('click', () => {
            productosList.style.display = productosList.style.display === 'none' ? 'block' : 'none';
            toggleButton.textContent = productosList.style.display === 'none' ? 'Mostrar Productos' : 'Ocultar Productos';
        });
    });

    const seccionPedidos = document.getElementById('seccion-pedidos');
    seccionPedidos.appendChild(container);
}