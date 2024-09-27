// Simulación de una verificación de sesión (por ejemplo, usando localStorage)
const isLoggedIn = localStorage.getItem('loggedIn'); // Cambia esto según tu lógica de sesión

const toolsLink = document.getElementById('tools-link');

if (!isLoggedIn) {
    // Si no está logueado, cambia el enlace y el texto
    toolsLink.href = "/login"; // Redirige a la página de login u otro lugar
    toolsLink.textContent = "Iniciar Sesión"; // Cambia el texto
}