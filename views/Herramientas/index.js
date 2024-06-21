const logout = document.querySelector(".logout");

logout.addEventListener('click', async e => { 
    try {
        await axios.get('/api/logout');

        loggedOut = true; // Marcamos que el usuario ha cerrado la sesión
        window.location.replace('/login');

    } catch (error) {
        console.log(error);
    }
});
  
document.addEventListener('DOMContentLoaded', function() {
    let button = document.getElementById('redireccionarBtn');
    button.addEventListener('click', function() {
        window.location.href = 'http://127.0.0.1:5000';
    });
});