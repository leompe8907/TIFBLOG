document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const nombre = document.getElementById('nombre').value;
  
    if (password !== confirmPassword) {
      document.getElementById('confirmPasswordError').innerText = 'Las contraseñas no coinciden';
      return;
    }
  
    const data = { email, password, nombre };
  
    // Reemplaza esta URL con la URL de tu servidor backend
    const backendUrl = 'https://leonard27.pythonanywhere.com/register';  // URL corregida
  
    fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        // Manejo de errores
        if (data.error.includes('Correo Existente')) {
          document.getElementById('emailError').innerText = data.error;
        } else {
          alert(data.error);
        }
      } else {
        // Registro exitoso
        alert(data.success);
        window.location.href = './login.html';
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