$(function() {
    $("#fecha").datepicker({
        dateFormat: "dd-mm-yy"
    });
});

document.getElementById('form-btn').addEventListener('click', async (event) => {
    event.preventDefault();

    const date = document.getElementById('fecha').value;
    const type = document.getElementById('tipo').value;
    const victimCount = document.getElementById('number').value;
    const district = document.getElementById('distrito').value;

    // Obtener el valor de los botones "Sí" y "No"
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
document.getElementById('weapon-yes').addEventListener('click', () => {
    document.getElementById('weapon-yes').classList.add('selected');
    document.getElementById('weapon-no').classList.remove('selected');
});

document.getElementById('weapon-no').addEventListener('click', () => {
    document.getElementById('weapon-yes').classList.remove('selected');
    document.getElementById('weapon-no').classList.add('selected');
});

document.getElementById('motorcycle-yes').addEventListener('click', () => {
    document.getElementById('motorcycle-yes').classList.add('selected');
    document.getElementById('motorcycle-no').classList.remove('selected');
});

document.getElementById('motorcycle-no').addEventListener('click', () => {
    document.getElementById('motorcycle-yes').classList.remove('selected');
    document.getElementById('motorcycle-no').classList.add('selected');
});

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.innerText = message;
    notification.className = type === 'success' ? 'text-green-100' : 'text-red-100';
    setTimeout(() => {
        notification.innerText = '';
        notification.className = '';
    }, 1000);
}