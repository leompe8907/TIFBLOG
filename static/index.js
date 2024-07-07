// Verificar si el usuario está logueado
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn) {
        document.getElementById('loginLink').style.display = 'none';
        document.getElementById('registerLink').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'block';
        document.getElementById('createPostFormContainer').style.display = 'block';
    } else {
        document.getElementById('loginLink').style.display = 'block';
        document.getElementById('registerLink').style.display = 'block';
        document.getElementById('logoutBtn').style.display = 'none';
        document.getElementById('createPostFormContainer').style.display = 'none';
    }

    cargarPublicaciones(isLoggedIn);
});

function cargarPublicaciones(isLoggedIn) {
    fetch('https://leonard27.pythonanywhere.com/publicaciones', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        const publicacionesList = document.getElementById('publicaciones-list');
        publicacionesList.innerHTML = '';
        data.forEach(publicacion => {
            const publicacionElement = document.createElement('div');
            publicacionElement.className = 'card mb-3';
            let botones = '';
            let formularioComentario = '';
            if (isLoggedIn) {
                botones = `
                    <button class="btn btn-primary btn-sm edit-btn" data-id="${publicacion.id}">Editar</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${publicacion.id}">Eliminar</button>
                `;
                formularioComentario = `
                    <form class="comment-form" data-id="${publicacion.id}">
                        <div class="form-group">
                            <label for="comentario-${publicacion.id}">Añadir comentario</label>
                            <input type="text" class="form-control" id="comentario-${publicacion.id}" required>
                        </div>
                        <button type="submit" class="btn btn-secondary btn-sm">Comentar</button>
                    </form>
                `;
            }
            const comentariosHTML = publicacion.comentarios.map(comentario => `
                <div class="card mb-2">
                    <div class="card-body">
                        <h6 class="card-subtitle mb-2 text-muted">${comentario.autor}</h6>
                        <p class="card-text">${comentario.contenido}</p>
                        <p class="card-text"><small class="text-muted">${new Date(comentario.date).toLocaleString()}</small></p>
                    </div>
                </div>
            `).join('');

            publicacionElement.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${publicacion.autor}</h5>
                    <p class="card-text">${publicacion.contenido}</p>
                    <p class="card-text"><small class="text-muted">${new Date(publicacion.date).toLocaleString()}</small></p>
                    ${botones}
                    <div class="mt-3">
                        ${comentariosHTML}
                    </div>
                    ${formularioComentario}
                </div>
            `;
            publicacionesList.appendChild(publicacionElement);
        });

        if (isLoggedIn) {
            // Añadir eventos a los botones de editar y eliminar
            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', function() {
                    editarPublicacion(this.getAttribute('data-id'));
                });
            });

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', function() {
                    eliminarPublicacion(this.getAttribute('data-id'));
                });
            });

            // Añadir eventos a los formularios de comentarios
            document.querySelectorAll('.comment-form').forEach(form => {
                form.addEventListener('submit', function(event) {
                    event.preventDefault();
                    const publicacionId = this.getAttribute('data-id');
                    const comentario = document.getElementById(`comentario-${publicacionId}`).value;
                    enviarComentario(publicacionId, comentario);
                });
            });
        }
    })
    .catch(error => console.error('Error:', error));
}

// Manejo del formulario de creación de publicaciones
document.getElementById('createPostForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const contenido = document.getElementById('contenido').value;
    const token = localStorage.getItem('token');

    fetch('https://leonard27.pythonanywhere.com/publicaciones', {
        method: 'POST',
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
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            cargarPublicaciones(isLoggedIn);
            document.getElementById('createPostForm').reset();
        }
    })
    .catch(error => console.error('Error:', error));
});

// Función para eliminar una publicación
function eliminarPublicacion(id) {
    const token = localStorage.getItem('token');

    fetch(`https://leonard27.pythonanywhere.com/eliminar/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert(data.success);
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            cargarPublicaciones(isLoggedIn);
        }
    })
    .catch(error => console.error('Error:', error));
}

// Función para enviar un comentario
function enviarComentario(publicacionId, contenido) {
    const token = localStorage.getItem('token');

    fetch(`https://leonard27.pythonanywhere.com/comentar/${publicacionId}`, {
        method: 'POST',
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
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            cargarPublicaciones(isLoggedIn);
        }
    })
    .catch(error => console.error('Error:', error));
}


// Función para redirigir a la página de edición
function editarPublicacion(id) {
    window.location.href = `editar_publicacion.html?id=${id}`;
}
