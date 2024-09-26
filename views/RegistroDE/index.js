async function fetchUserReports() {
    try {
        // Obtén el token del usuario almacenado en las cookies
        const token = Cookies.get('accessToken'); // Asegúrate de que el nombre sea correcto
        console.log('Token obtenido:', token); // Verifica el token

        // Configura el encabezado de la solicitud con el token
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // Realiza la solicitud a la API para obtener solo los informes del usuario autenticado
        const response = await axios.get('/api/reports/user', config);

        if (response.status !== 200) {
            throw new Error('Error al obtener los informes del usuario');
        }

        const reports = response.data;

        // Limpiar el contenedor de reportes
        const reportsContainer = document.getElementById('reports-container');
        reportsContainer.innerHTML = ''; // Limpiar contenido anterior

        // Procesar y mostrar los informes recibidos
        reports.forEach(report => {
            const reportInfo = document.createElement('div');

            reportInfo.classList.add(
                'bg-neutral-200',
                'p-4',
                'w-full',
                'border-red-700',
                'border-s-4',
                'flex',
                'flex-col',
                'items-center'
            );

            // Convertir la fecha a un formato legible
            const reportDate = new Date(report.date).toLocaleDateString('es-PE'); // Usar 'es-PE' para formato Perú

            reportInfo.innerHTML = `
                <p class="mb-2">Fecha: ${reportDate}</p>
                <p>Tipo: ${report.type}</p>
                <p>Cantidad de víctimas: ${report.victimCount}</p>
                <p>Distrito: ${report.district}</p>
                <p>¿Uso de arma?: ${report.weaponUsed ? 'Sí' : 'No'}</p>
                <p>¿Uso de moto?: ${report.motorcycleUsed ? 'Sí' : 'No'}</p>
            `;

            reportsContainer.appendChild(reportInfo);
        });
    } catch (error) {
        console.error('Error al obtener los informes del usuario:', error);
        const notification = document.getElementById('notification');
        notification.textContent = 'Error al cargar los informes del usuario.';
        notification.classList.add('bg-red-500', 'text-white');

        setTimeout(() => {
            notification.innerText = '';
            notification.classList.remove('bg-green-500', 'bg-red-500', 'text-white', 'text-black');
        }, 3000);
    }
}

// Llamar a la función para cargar los informes del usuario al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    fetchUserReports();
});