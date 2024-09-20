const textInfo = document.querySelector('#text-info');

(async () => {
  try {
    const token = window.location.pathname.split('/')[3];
    const id = window.location.pathname.split('/')[2];
    await axios.patch(`/api/users/${id}/${token}`);
    window.location.pathname = '/login/';
  } catch (error) {
    textInfo.innerHTML = error.response.data.error;
  }
})();