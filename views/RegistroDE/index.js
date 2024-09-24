async function fetchAllReports() {
    try {
        const response = await fetch('/api/reports');

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al obtener los informes');
        }

        const reports = await response.json();

        // Limpiar el contenedor de reportes
        const reportsContainer = document.getElementById('reports-container');
        reportsContainer.innerHTML = '';

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
                <p>¿Uso de motocicleta?: ${report.motorcycleUsed ? 'Sí' : 'No'}</p>
            `;

            reportsContainer.appendChild(reportInfo);
        });

    } catch (error) {
        console.error('Error:', error);

        // Mostrar un mensaje de error al usuario en la página
        const errorMessage = document.createElement('p');
        errorMessage.classList.add('text-red-600', 'font-bold', 'text-center');
        errorMessage.textContent = 'Ocurrió un error al cargar los informes. Por favor, inténtalo más tarde.';

        document.getElementById('reports-container').appendChild(errorMessage);
    }
}

// Función para ajustar el botón "Volver" según el rol del usuario
async function setBackButton() {
    try {
        // Hacer una solicitud para obtener el usuario autenticado
        const response = await fetch('/api/users');

        if (!response.ok) {
            throw new Error('Error al obtener la información del usuario');
        }

        const user = await response.json();
        console.log(user);  // Verificar la información del usuario
        const backButton = document.getElementById('back-button');

        // Si el usuario es administrador, volver al menú de admin, de lo contrario, al menú de usuario
        backButton.href = user.role === 'admin' ? '/Admin/' : '/RegisterDE/';
    } catch (error) {
        console.error('Error al obtener el rol del usuario:', error);
    }
}

// Llamadas iniciales para cargar los informes y ajustar el botón
document.addEventListener('DOMContentLoaded', () => {
    fetchAllReports();
    setBackButton();
});