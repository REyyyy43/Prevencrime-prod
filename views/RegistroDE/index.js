async function fetchAllReports() {
  try {
      const response = await fetch('/api/reports');

      if (!response.ok) {
          throw new Error('Error al obtener los informes');
      }

      const reports = await response.json();

      // Procesar los informes recibidos
      reports.forEach(report => {
          // Aquí puedes hacer lo que necesites con cada reporte
        const reportInfo = document.createElement('div');
          console.log(report);
          // Por ejemplo, construir tu HTML dinámicamente
          reportInfo.classList.add('bg-neutral-200', 'p-4', 'w-full', 'border-red-700', 'border-s-4', 'flex', 'flex-col', 'items-center');
          reportInfo.innerHTML = `
              <p class="mb-2">Fecha: ${report.date}</p>
              <p>Tipo: ${report.type}</p>
              <p>Cantidad de víctimas: ${report.victimCount}</p>
              <p>Distrito: ${report.district}</p>
              <p>¿Uso de arma?: ${report.weaponUsed ? 'Sí' : 'No'}</p>
              <p>¿Uso de motocicleta?: ${report.motorcycleUsed ? 'Sí' : 'No'}</p>
          `;
          document.getElementById('reports-container').appendChild(reportInfo);
      });
  } catch (error) {
      console.error('Error:', error);
  }
}

fetchAllReports();