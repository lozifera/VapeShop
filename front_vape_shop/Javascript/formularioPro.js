document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('producto');

    if (productId) {
        fetch(`http://localhost:3000/api/producto/${productId}`)
            .then(response => response.json())
            .then(product => {
                document.querySelector("#nombre").value = product.nombre;
                document.querySelector("#descripcion").value = product.descripcion;
                document.querySelector("#precio").value = product.precio;
                document.querySelector("#stock").value = product.stock;
                document.querySelector("#id_categoria").value = product.id_categoria;

                const preview = document.getElementById('preview');
                preview.src = `http://localhost:3000/api/producto/imagen/${product.id_producto}`;
                preview.style.display = 'block';
            })
            .catch(error => console.error('Error fetching product:', error));
    }

    fetch('http://localhost:3000/api/categorias')
        .then(response => response.json())
        .then(data => {
            const idCategoriaInput = document.getElementById('id_categoria');
            data.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id_categoria;
                option.textContent = `${categoria.nombre} - ${categoria.id_categoria}`;
                idCategoriaInput.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching categories:', error));

    document.getElementById('archivo').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('preview');
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    document.querySelector("#registro-prod").addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = document.querySelector("#nombre").value;
        const descripcion = document.querySelector("#descripcion").value;
        const imagen = document.querySelector("#archivo").files[0];
        const precio = document.querySelector("#precio").value;
        const stock = document.querySelector("#stock").value;
        const id_categoria = document.querySelector("#id_categoria").value;

        if (!nombre || !descripcion || !precio || !stock || !id_categoria) {
            alert('Todos los campos son obligatorios');
            return;
        }

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        if (imagen) {
            formData.append('imagen', imagen); // Solo agregar si hay una nueva imagen
        }
        formData.append('precio', precio);
        formData.append('stock', stock);
        formData.append('id_categoria', id_categoria);

        try {
            const response = await fetch(`http://localhost:3000/api/producto/singel${productId ? `/${productId}` : ''}`, {
                method: productId ? 'PUT' : 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error en la ${productId ? 'edición' : 'creación'} del producto: ${errorText}`);
            }

            const result = await response.json();
            alert(`Producto ${productId ? 'editado' : 'creado'} exitosamente`);
            console.log(`Product ${productId ? 'edited' : 'created'}:`, result);
            window.location.href = 'menuAdmin.html'; // Redirigir a menuAdmin.html
        } catch (error) {
            console.error(`Error ${productId ? 'editing' : 'creating'} product:`, error);
            alert(`Hubo un error al ${productId ? 'editar' : 'crear'} el producto: ${error.message}`);
        }
    });
});