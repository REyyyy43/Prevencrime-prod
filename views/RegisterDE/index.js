$(function() {
    $("#fecha").datepicker({
        dateFormat: "yy-mm-dd", // Cambia el formato a yyyy-MM-dd
        minDate: new Date(2024, 0, 1) // Establece la fecha mínima a 1 de enero de 2024
    });
});

document.getElementById('form-btn').addEventListener('click', async (event) => {
    event.preventDefault();

    const date = document.getElementById('fecha').value;
    const type = document.getElementById('tipo').value;
    const victimCount = document.getElementById('number').value;
    const district = document.getElementById('distrito').value;

    // Obtener el valor de los botones "Sí" y "No" para weapon y motorcycle
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
            credentials: 'include' // Para incluir cookies en la solicitud
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

// Manejar eventos de clic en los botones "Sí" y "No"
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
    notification.innerText = message;
    notification.className = type === 'success' ? 'text-green-500' : 'text-red-500'; // Cambia la clase dependiendo del tipo
    setTimeout(() => {
        notification.innerText = '';
        notification.className = '';
    }, 3000); // Extender el tiempo para que el mensaje permanezca visible por más tiempo
}