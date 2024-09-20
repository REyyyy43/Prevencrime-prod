async function fetchAllUsers() {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Error al obtener los datos de los usuarios');
      }
      const users = await response.json();
      // Itera sobre cada usuario y muestra sus datos en el HTML
      users.forEach(user => {
        const userInfo = document.createElement('div');
        userInfo.innerHTML = `
        <ul dir="ltr" class="bg-neutral-200 p-4 w-full border-red-700 border-s-4 flex flex-col items-center">
        <li class="mb-2">${user.name}</li>
        <li>${user.email}</li>
    </ul>
        `;
        document.getElementById('users-container').appendChild(userInfo);
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Llama a la función para obtener y mostrar todos los usuarios
  fetchAllUsers();