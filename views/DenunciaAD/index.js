// Función para obtener todos los informes y mostrarlos en el contenedor
async function fetchAllReports() {
    try {
        const token = Cookies.get('adminToken'); // Asegúrate de que el token se llame 'adminToken'
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        
        // Realiza la solicitud a la API
        const response = await axios.get('/api/reports/admin', config);

        // No necesitas verificar response.ok, ya que axios lanza un error en caso de fallos

        const reports = response.data; // Aquí ya tienes los datos en formato JSON

        // Limpiar el contenedor de reportes
        const reportsContainer = document.getElementById('reports-container2');
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
        console.error('Error al obtener los informes:', error);
        const notification = document.getElementById('notification');
        if (notification) {
            notification.textContent = 'Error al cargar los informes.';
            notification.classList.add('bg-red-500', 'text-white');

            setTimeout(() => {
                notification.innerText = '';
                notification.classList.remove('bg-green-500', 'bg-red-500', 'text-white', 'text-black');
            }, 3000);
        }
    }
}

// Llamar a la función para cargar los informes al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    fetchAllReports();
});