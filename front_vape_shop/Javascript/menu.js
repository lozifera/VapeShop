document.addEventListener('DOMContentLoaded', function() {
    const menuCategories = document.getElementById('menu-categories');
    const menuLogin = document.getElementById('menu-user');
    const menuShop = document.getElementById('menu-shop');
    const menuHome = document.getElementById('home');
    const menupedido = document.getElementById('menu-pedido');
    const menucerrar = document.getElementById('cerrar-secion');
    // Obtener todas las categorías
    fetch('http://localhost:3000/api/categorias')
        .then(response => response.json())
        .then(categories => {
            categories.forEach(category => {
                // Para el menú de categorías
                if (menuCategories) {
                    addCategoryToMenu(menuCategories, category);
                    
                    
                }
            });
        })
        .catch(error => console.error('Error fetching categories:', error));
            // Añadir enlace de login
    if (menuLogin) {
        login(menuLogin);
    }
    if(menuShop){
        carrito(menuShop);
    }
    if(menuHome){
        home(menuHome);
    }
    if(menupedido){
        pedido(menupedido);
    }
    if(menucerrar){
       logout(menucerrar);
    }
});

function addCategoryToMenu(menuCategories, category) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `productoCategoria.html?categoria=${encodeURIComponent(category.nombre)}`;
    a.innerHTML = `<span>${category.nombre}</span>`;
    li.appendChild(a);
    menuCategories.appendChild(li);
}

function login(menuLogin){
    const a = document.createElement('a');
    const currentUrl = window.location.href; 
    a.href = `login.html?redirect=${encodeURIComponent(currentUrl)}`; 

    const img = document.createElement('img');
    img.src = `../image/iconos/usuario.svg`;
    img.className = 'logo';
    a.appendChild(img);

    menuLogin.appendChild(a);
}

function carrito(menuShop){
    const a = document.createElement('a');
    a.href = `carrito.html`;

    const img = document.createElement('img');
    img.src = `../image/iconos/carrito-de-compras.svg`;
    img.className = 'logo';
    a.appendChild(img);

    menuShop.appendChild(a);
}

function home(menuHome){
    const a = document.createElement('a');
    a.href = `index.html`;

    const img = document.createElement('img');
    img.src = `../image/iconos/hogar.svg`;
    img.className = 'logo';
    a.appendChild(img);

    menuHome.appendChild(a);
}
function pedido(menupedido){
    const a = document.createElement('a');
    a.href = `listaPedidos.html`;

    const img = document.createElement('img');
    img.src = `../image/iconos/icons8-shopping-bag-50.png`;
    img.className = 'logo';
    a.appendChild(img);

    menupedido.appendChild(a);
}

function logout(menucerrar) {
    const a = document.createElement('a');
    a.href = `index.html`;

    const img = document.createElement('img');
    img.src = `../image/iconos/cruz.svg`;
    img.className = 'logo';
    a.appendChild(img);

    menucerrar.appendChild(a);
    a.addEventListener('click', function() {
        localStorage.clear();
        
    });
}