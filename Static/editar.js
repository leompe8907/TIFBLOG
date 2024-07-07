// Obtener el ID de la publicación desde la URL
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

// Cargar el contenido actual de la publicación
document.addEventListener('DOMContentLoaded', function() {
    fetch(`http://localhost:5000/publicaciones/${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('contenido').value = data.contenido;
        })
        .catch(error => console.error('Error:', error));
});


// Manejar la edición de la publicación
document.getElementById('editPostForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const contenido = document.getElementById('contenido').value;
    const token = localStorage.getItem('token');

    fetch(`http://localhost:5000/editar/${id}`, {
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
    .catch(error => console.error('Error:', error));
});
