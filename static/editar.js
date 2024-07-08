// Obtener el ID de la publicación desde la URL
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

// Cargar el contenido actual de la publicación
document.addEventListener('DOMContentLoaded', function() {
    fetch(`https://leonard27.pythonanywhere.com/publicaciones/${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('contenido').value = data.contenido;
        })
        .catch(error => {
            console.error('Error:', error);
            // Comprobar si el error es debido a un token expirado
            if (error.message && (error.message.includes('token expired') || error.message.includes('Token inválido o expirado'))) {
                localStorage.removeItem('token');
                localStorage.removeItem('isLoggedIn');
                window.location.href = 'index.html';
            } else {
                alert('Error desconocido al cerrar sesión');
            }
        });
});


// Manejar la edición de la publicación
document.getElementById('editPostForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const contenido = document.getElementById('contenido').value;
    const token = localStorage.getItem('token');

    fetch(`https://leonard27.pythonanywhere.com/editar/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ contenido })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert(data.success);
            window.location.href = 'index.html';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Comprobar si el error es debido a un token expirado
        if (error.message && (error.message.includes('token expired') || error.message.includes('Token inválido o expirado'))) {
            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'index.html';
        } else {
            alert('Error desconocido al cerrar sesión');
        }
    });
});
