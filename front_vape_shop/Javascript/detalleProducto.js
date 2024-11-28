document.addEventListener('DOMContentLoaded', function() {
    const productCont = document.getElementById('contendinoProducto');
    const imgCont = document.getElementById('imagneProducto');
    const urlParams = new URLSearchParams(window.location.search);
    const producto = urlParams.get('producto');
    console.log('Fetching product with ID:', producto); 

    if (!producto) {
        console.error('No se encontró el parámetro "producto" en la URL');
        return;
    }

    let apiURL = `http://localhost:3000/api/producto/${encodeURIComponent(producto)}`;
    console.log('API URL:', apiURL); // Agregar console.log aquí

    fetch(apiURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(product => {
            console.log('Product fetched:', product); // Agregar console.log aquí
            if (productCont && imgCont) {
                addProductToSection(productCont, imgCont, product);
            }
        })
        .catch(error => console.error('Error fetching product:', error));
});

function addProductToSection(productCont, imgCont, product) {
    console.log('Adding product to section:', product); // Agregar console.log aquí

    const img = document.createElement('img');
    img.src = `http://localhost:3000/api/producto/imagen/${product.id_producto}`;
    img.alt = product.nombre;
    imgCont.appendChild(img);

    const h2 = document.createElement('h2');
    h2.textContent = product.nombre;
    productCont.appendChild(h2);

    const pDesc = document.createElement('p');
    pDesc.textContent = `Descripción: ${product.descripcion}`;
    productCont.appendChild(pDesc);

    const pPrecio = document.createElement('p');
    pPrecio.textContent = `Precio: ${product.precio}`;
    productCont.appendChild(pPrecio);
    // Añadir el contador
    const counterContainer = createCounter();
    productCont.appendChild(counterContainer);

    // Botón de comprar
    const btn = document.createElement('button');
    btn.textContent = 'Comprar';
    btn.addEventListener('click', () => {
        addToCart(product.id_producto, counterContainer.querySelector('p').textContent, product.precio);
    });
    productCont.appendChild(btn);
}

function createCounter() {
    const counterContainer = document.createElement('div');
    counterContainer.className = 'counter-container';

    const counterDisplay = document.createElement('p');
    let counterValue = 0;
    counterDisplay.textContent = counterValue;

    const decrementBtn = document.createElement('button');
    decrementBtn.textContent = '-';
    decrementBtn.addEventListener('click', () => {
        if (counterValue > 0) {
            counterValue--;
            counterDisplay.textContent = counterValue;
        }
    });
    counterContainer.appendChild(decrementBtn);
    counterContainer.appendChild(counterDisplay);

    const incrementBtn = document.createElement('button');
    incrementBtn.textContent = '+';
    incrementBtn.addEventListener('click', () => {
        counterValue++;
        counterDisplay.textContent = counterValue;
    });
    counterContainer.appendChild(incrementBtn);

    return counterContainer;
}

function addToCart(id_producto, cantidad, precioventa) {
    const carritoId = localStorage.getItem('id_carrito');
    
    if (!carritoId) {
        console.error('No se encontró el carrito en el localStorage');
        return;
    }

    fetch('http://localhost:3000/api/carritoProducto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_producto,
            id_carrito:carritoId,
            cantidad,
            precioventa
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Producto agregado al carrito:', data);
        alert('Producto agregado al carrito');
    })
    .catch(error => console.error('Error agregando el producto al carrito:', error));
}