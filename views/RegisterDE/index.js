$(function() {
    // Obtener la fecha actual en formato yyyy-mm-dd
    const today = new Date().toISOString().split('T')[0];

    // Establecer la fecha en el campo de entrada y hacerla no editable
    $("#fecha").val(today).prop('readonly', true);
});

// El resto de tu código permanece igual
document.getElementById('form-btn').addEventListener('click', async (event) => {
    event.preventDefault();

    const date = document.getElementById('fecha').value; // La fecha ya estará predefinida con el valor actual
    const type = document.getElementById('tipo').value;
    const victimCount = document.getElementById('number').value;
    const district = document.getElementById('distrito').value;

    const weaponUsed = document.getElementById('weapon-yes').classList.contains('selected') ? 'yes' : 'no';
    const motorcycleUsed = document.getElementById('motorcycle-yes').classList.contains('selected') ? 'yes' : 'no';

    console.log({ date, type, victimCount, district, weaponUsed, motorcycleUsed });

    if (!date || !type || !victimCount || !district) {
        showNotification('Todos los campos son requeridos', 'error');
        return;
    }

    const report = {
        date,
        type,
        victimCount,
        district,
        weaponUsed,
        motorcycleUsed,
    };

    try {
        const response = await fetch('/api/reports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(report),
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            showNotification('Informe registrado exitosamente', 'success');
        } else {
            const errorData = await response.json();
            showNotification('Error al registrar el informe: ' + errorData.error, 'error');
        }
    } catch (error) {
        showNotification('Error al registrar el informe', 'error');
    }
});

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
    notification.classList.remove('bg-green-500', 'bg-red-500', 'text-white', 'text-red-50');
    
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
        notification.classList.remove('bg-green-500', 'bg-red-500', 'text-white');
    }, 3000);
}