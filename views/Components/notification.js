const div = document.querySelector('#notification');

export const createNotification = (isError, message) => { 
    if (isError) {
        div.innerHTML= `
            <div class="flex justify-center">
                <p class="text-red-600 font-bold text-base">${message}</p>
            </div>
        `;
    } else {
        div.innerHTML= `
            <div class="flex justify-center">
                <p class="text-green-600 font-bold text-base">${message}</p>
            </div>
        `;
    }
};