document.addEventListener('DOMContentLoaded', function() {
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

    document.querySelector("#registro-cat").addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = document.querySelector("#nombre").value;
        const imagen = document.querySelector("#archivo").files[0];

        if (!nombre || !imagen) {
            alert('Todos los campos son obligatorios');
            return;
        }

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('imagen', imagen); // Cambiado a 'imagen'

        try {
            const response = await fetch('http://localhost:3000/api/categoria/singel', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error en la creación de la categoría: ${errorText}`);
            }

            const result = await response.json();
            alert('Categoría creada exitosamente');
            console.log('Category created:', result);
        } catch (error) {
            console.error('Error creating category:', error);
            alert(`Hubo un error al crear la categoría: ${error.message}`);
        }
    });
});