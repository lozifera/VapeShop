document.addEventListener('DOMContentLoaded', function() {
    const categoriasCont = document.getElementById('categorias-cont');

    // Obtener todas las categorías
    fetch('http://localhost:3000/api/categorias')
        .then(response => response.json())
        .then(categories => {
            categories.forEach(category => {
                // Para la sección de categorías
                if (categoriasCont) {
                    addCategoryToSection(categoriasCont, category);
                }
            });
        })
        .catch(error => console.error('Error fetching categories:', error));
});

function addCategoryToSection(categoriasCont, category) {
    const article = document.createElement('article');
    article.className = 'item-cat';

    const a = document.createElement('a');
    a.href = `productoCategoria.html?categoria=${encodeURIComponent(category.nombre)}`;

    const img = document.createElement('img');
    img.src = `http://localhost:3000/api/categoria/imagen/${category.id_categoria}`;
    img.alt = category.nombre;
    a.appendChild(img);

    const h1 = document.createElement('h1');
    h1.textContent = category.nombre;
    a.appendChild(h1);

    article.appendChild(a);
    categoriasCont.appendChild(article);
}