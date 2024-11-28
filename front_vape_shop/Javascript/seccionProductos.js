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


    const h2 = document.createElement('h2');
    h2.textContent = product.nombre;
    article.appendChild(h2);

    const div = document.createElement('div');
    div.className = 'div-cont';
    article.appendChild(div);

    const p = document.createElement('p');
    p.textContent = `Precio: Bs ${product.precio}`;;
    div.appendChild(p);

    const btn = document.createElement('button');
    btn.textContent = 'Comprar';
    div.appendChild(btn);
    
    

    productosCont.appendChild(article);
}