// Función para logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    const token = localStorage.getItem('token');

    fetch('http://127.0.0.1:5000/logout', {
        method: 'GET',
        // headers: {
        //     'Authorization': `Bearer ${token}`
        // }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.success);
            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'index.html';
        } else {
            alert(data.error || 'Error desconocido al cerrar sesión');
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
