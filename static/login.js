document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    const data = { email, password, remember };

    const backendUrl = 'http://localhost:5000/login';

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
    .catch(error => console.error('Error:', error));
});
