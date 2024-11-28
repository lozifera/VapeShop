document.addEventListener('DOMContentLoaded', function() {
    const productosCont = document.getElementById('productos-cont');
    const urlParams = new URLSearchParams(window.location.search);
    const categoria = urlParams.get('categoria');
   
    let apiURL = 'http://localhost:3000/api/productos';
    if (categoria) {
        apiURL = `http://localhost:3000/api/producto/categoria/${encodeURIComponent(categoria)}`;
    }

    fetch(apiURL)
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
                if (productosCont) {
                    addProductToSection(productosCont, product);
                }
            });
        })
        .catch(error => console.error('Error fetching products:', error));
});

function addProductToSection(productosCont, product) {
    const article = document.createElement('article');
    article.className = 'item-conten';

    const a = document.createElement('a');
    a.href = `productoDetalle.html?producto=${encodeURIComponent(product.id_producto)}`;
    
    const img = document.createElement('img');
    img.src = `http://localhost:3000/api/producto/imagen/${product.id_producto}`;
    img.alt = product.nombre;

    a.appendChild(img);
    article.appendChild(a);

    const div1 = document.createElement('div');
    div1.className = 'cont-div';
    article.appendChild(div1);

    const h2 = document.createElement('h2');
    h2.textContent = product.nombre;
    div1.appendChild(h2);

    const div = document.createElement('div');
    div.className = 'div-cont';
    div1.appendChild(div);

    const p = document.createElement('p');
    p.textContent = `Precio: Bs ${product.precio}`;
    div.appendChild(p);

    const p2 = document.createElement('p');
    p2.textContent =  `Cantidad: ${product.stock}`
    div.appendChild(p2);

    const btnEdit = document.createElement('button');
    btnEdit.textContent = 'Editar';
    btnEdit.addEventListener('click', () => {
        window.location.href = `formularioPro.html?producto=${encodeURIComponent(product.id_producto)}`;
    });
    div.appendChild(btnEdit);

    const btnDelete = document.createElement('button');
    btnDelete.textContent = 'Eliminar';
    btnDelete.addEventListener('click', () => {
        if (confirm(`¿Estás seguro de que deseas eliminar el producto "${product.nombre}"?`)) {
            deleteProduct(product.id_producto);
        }
    });
    div.appendChild(btnDelete);

    productosCont.appendChild(article);
}

function deleteProduct(productId) {
    fetch(`http://localhost:3000/api/producto/${productId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar el producto');
        }
        alert('Producto eliminado exitosamente');
        location.reload();
    })
    .catch(error => console.error('Error deleting product:', error));
}