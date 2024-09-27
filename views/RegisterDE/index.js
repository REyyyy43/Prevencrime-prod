$(function() {
    // Función para obtener la fecha actual en el formato "yyyy-MM-dd"
    function getCurrentDate() {
        const date = new Date().toLocaleString('en-CA', {
            timeZone: 'America/Lima', // Zona horaria de Perú
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).split(',')[0]; // Extraer solo la fecha sin la hora
        return date;
    }

    // Establecer la fecha en el campo de entrada
    $("#fecha").val(getCurrentDate());

    // Hacer que el campo no sea editable
    $("#fecha").prop('readonly', true);
});

// Para actualizar automáticamente la fecha sin recargar la página, puedes usar un intervalo
setInterval(function() {
    $("#fecha").val(getCurrentDate());
}, 86400000); // 86400000 ms = 24 horas

// Manejar el envío del formulario
document.getElementById('form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar el envío tradicional del formulario

    const fecha = document.getElementById('fecha').value;
    const tipo = document.getElementById('tipo').value;
    const distrito = document.getElementById('distrito').value;
    const victimCount = document.getElementById('victimCount').value; // Asegúrate de que el ID sea correcto
    const weaponUsed = document.querySelector('input[name="weaponUsed"]:checked')?.value; 
    const motorcycleUsed = document.querySelector('input[name="motorcycleUsed"]:checked')?.value; 

    // Crear el objeto de datos para enviar
    const reportData = {
        date: fecha,
        type: tipo,
        district: distrito,
        victimCount: victimCount, 
        weaponUsed: weaponUsed === 'yes', 
        motorcycleUsed: motorcycleUsed === 'yes', 
    };

    // Verificación de campos requeridos
    if (!fecha || !tipo || !victimCount || !distrito || weaponUsed === undefined || motorcycleUsed === undefined) {
        document.getElementById('notification').textContent = 'Todos los campos son requeridos.';
        notification.classList.add('bg-green-500', 'text-white');
        setTimeout(() => {
            notification.innerText = '';
            notification.classList.remove('bg-green-500', 'bg-red-500', 'text-white', 'text-black');
        }, 3000);
        return;
    }

    console.log(reportData); // Verifica qué datos estás enviando

    try {
        const response = await axios.post('/api/reports', reportData); 

        if (response.status === 201) {
            document.getElementById('notification').textContent = 'Informe registrado exitosamente. Actualice la pagina para enviar otro informe';
            notification.classList.add('bg-green-500', 'text-white');
            setTimeout(() => {
                notification.innerText = '';
                notification.classList.remove('bg-green-500', 'bg-red-500', 'text-white', 'text-black');
            }, 3000);
            document.getElementById('form').reset(); // Limpiar el formulario
        }
    } catch (error) {
        console.error('Error al enviar el informe:', error);
        document.getElementById('notification').textContent = 'Error al registrar el informe. Inténtalo más tarde.';
        notification.classList.add('bg-green-500', 'text-white');
        setTimeout(() => {
            notification.innerText = '';
            notification.classList.remove('bg-green-500', 'bg-red-500', 'text-white', 'text-black');
        }, 3000);
    }
});

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
                <p>¿Uso de moto?: ${report.motorcycleUsed ? 'Sí' : 'No'}</p>
            `;

            reportsContainer.appendChild(reportInfo);
        });
    } catch (error) {
        console.error('Error al obtener los informes:', error);
        const notification = document.getElementById('notification');
        notification.textContent = 'Error al cargar los informes.';
        notification.classList.add('bg-green-500', 'text-white');
        
        setTimeout(() => {
            notification.innerText = '';
            notification.classList.remove('bg-green-500', 'bg-red-500', 'text-white', 'text-black');
        }, 3000);
    }
}

// Funciones de selección y notificaciones permanecen igual
const toggleSelection = (yesId, noId) => {
    document.getElementById(yesId).classList.add('selected');
    document.getElementById(noId).classList.remove('selected');
};

document.getElementById('weapon-yes').addEventListener('click', () => toggleSelection('weapon-yes', 'weapon-no'));
document.getElementById('weapon-no').addEventListener('click', () => toggleSelection('weapon-no', 'weapon-yes'));
document.getElementById('motorcycle-yes').addEventListener('click', () => toggleSelection('motorcycle-yes', 'motorcycle-no'));
document.getElementById('motorcycle-no').addEventListener('click', () => toggleSelection('motorcycle-no', 'motorcycle-yes'));

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    
    // Limpia las clases previas
    notification.classList.remove('bg-green-500', 'bg-red-500', 'text-white', 'text-red-50', 'text-black');
    
    // Establece el mensaje
    notification.innerText = message;

    // Aplica clases según el tipo
    if (type === 'success') {
        notification.classList.add('bg-green-500', 'text-white');
    } else {
        notification.classList.add('bg-red-500', 'text-white');
    }

    // Oculta la notificación después de 3 segundos
    setTimeout(() => {
        notification.innerText = '';
        notification.classList.remove('bg-green-500', 'bg-red-500', 'text-white', 'text-black');
    }, 3000);
}
