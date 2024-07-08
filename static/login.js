document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    const data = { email, password, remember };

    const backendUrl = 'https://leonard27.pythonanywhere.com/login';

    fetch(backendUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'  // Incluir cookies en la solicitud
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert(data.success);
            localStorage.setItem('isLoggedIn', true);
            localStorage.setItem('token', data.token);
            window.location.href = './index.html';
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
