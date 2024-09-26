document.addEventListener('DOMContentLoaded', () => {
    const logout = document.querySelector(".logout");

    if (logout) { // Verifica si el elemento fue encontrado
        logout.addEventListener('click', async (e) => { 
            e.preventDefault(); // Evita el comportamiento por defecto del enlace
            try {
                await axios.get('/api/logout/admin'); // Llama a la API de cierre de sesión
                window.location.replace('/login'); // Redirige a la página de login
            } catch (error) {
                console.log('Error al cerrar sesión:', error);
            }
        });
    } else {
        console.error('El botón de cierre de sesión no se encontró.');
    }
});