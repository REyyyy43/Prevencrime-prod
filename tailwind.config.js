/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.{html,js}', // Incluye archivos HTML y JS en la carpeta 'views'
    './*.html',               // Incluye archivos HTML en la raíz del proyecto (si es necesario)
    './components/**/*.js',   // Incluye archivos JS en la carpeta 'components' (si tienes JS aquí)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}