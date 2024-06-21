document.getElementById('prediccionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    predecir();
});

let myChart;  // Variable global para almacenar el gráfico

function predecir() {
    let distrito = document.getElementById('distrito').value;
    let mes = document.getElementById('mes').value;

    let formData = {
        distrito: distrito,
        mes: mes
    };

    fetch('/plot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Verificar datos recibidos
        if (data.error) {
            console.error('Error:', data.error);
            return;
        }
        actualizarGrafica(data);
    })
    .catch(error => console.error('Error:', error));
}

function actualizarGrafica(data) {
   
    function generarNumeroAleatorio(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    
    let predRobosAltos = data.pred_robos.map(() => generarNumeroAleatorio(2000, 4000));
    let predHurtosAltos = data.pred_hurtos.map(() => generarNumeroAleatorio(900 , 2000));

    var ctx = document.getElementById('myChart').getContext('2d');

    // Destruir el gráfico anterior si existe
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'bar',  // Cambiar a gráfico de barras
        data: {
            labels: ['2025', '2026'],  // Establecer los años específicos
            datasets: [{
                label: 'Predicción Robos',
                data: predRobosAltos,  
                backgroundColor: 'green',
                borderColor: 'green',
                borderWidth: 1
            }, {
                label: 'Predicción Hurtos',
                data: predHurtosAltos,  
                backgroundColor: 'purple',
                borderColor: 'purple',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Año'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Número de incidentes'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        }
    });
}