document.getElementById('registroForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el envío del formulario por defecto

    const formData = new FormData(this);
    const nombre = formData.get('name');
    const correo = formData.get('email');
    const contrasenya = formData.get('password');
    const direccion = formData.get('address');

    // Limpiar mensajes de error previos
    document.querySelectorAll('.error-message').forEach(el => el.remove());

    // Validaciones
    let valid = true;

    if (!nombre) {
        showError('name', 'El nombre es obligatorio.');
        valid = false;
    }

    if (!correo) {
        showError('email', 'El correo es obligatorio.');
        valid = false;
    } else if (!validateEmail(correo)) {
        showError('email', 'El correo no es válido.');
        valid = false;
    }

    if (!contrasenya) {
        showError('password', 'La contraseña es obligatoria.');
        valid = false;
    } else if (contrasenya.length < 8) {
        showError('password', 'La contraseña debe tener al menos 8 caracteres.');
        valid = false;
    }

    if (!direccion) {
        showError('address', 'La dirección es obligatoria.');
        valid = false;
    }

    if (!valid) {
        return;
    }

    const data = {
        nombre: nombre,
        correo: correo,
        contrasenya: contrasenya,
        direccion: direccion
    };

    fetch('http://localhost:3000/api/usuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'Error en el registro');
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.id_usuario) {
            localStorage.setItem('id_usuario', data.id_usuario);
            alert('Registro exitoso');
            window.location.href = 'index.html'; // Redirigir de nuevo al carrito
        } else {
            alert('Error en el registro');
        }
    })
    .catch(error => {
        alert(error.message);
        console.error('Error en el registro:', error);
    });
});

function showError(inputId, message) {
    const inputElement = document.getElementById(inputId);
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.color = 'red';
    errorElement.textContent = message;
    inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}