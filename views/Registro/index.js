// Importación de la función de notificación
import { createNotification } from '../Components/notification.js';

// Selectores
const countries = document.querySelector("#countries");
const nameInput = document.querySelector("#name-input");
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");
const matchInput = document.querySelector("#match-input");
const phoneInput = document.querySelector("#phone-input");
const phoneCode = document.querySelector("#phone-code");
const formBtn = document.querySelector('#form-btn');
const form = document.querySelector('#form');
const notification = document.querySelector('#notification');

// Limpiar opciones de países
[...countries.options].forEach(option => {
    option.textContent = option.textContent.split('(')[0];
});

// Validaciones Regex
const EMAIL_VALIDATION = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const PASSWORD_VALIDATION = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
const NAME_VALIDATION = /^[A-Z\u00d1][a-zA-Z-ÿ\u00f1\u00d1]+(\s*[A-Z\u00d1][a-zA-Z-ÿ\u00f1\u00d1\s]*)$/;
const PHONE_VALIDATION = /^[0-9]{9,9}$/;

// Variables de validación
let nameValidation = false;
let emailValidation = false;
let passwordValidation = false;
let matchValidation = false;
let phoneValidation = false;
let countriesValidation = false;

// Función de validación
const validation = (input, regexValidation) => {
    const parent = input.parentElement;
    const information = parent ? parent.querySelector('.information') : null;

    if (!information) {
        console.error('No se puede encontrar el elemento de información.');
        return;
    }

    formBtn.disabled = !nameValidation || !emailValidation || !passwordValidation || !matchValidation || !phoneValidation || !countriesValidation;

    if (input.value === '') {
        input.classList.remove('outline-red-500', 'outline-2', 'outline');
        input.classList.remove('outline-green-500', 'outline-2', 'outline');
        input.classList.add('outline-none');
        information.classList.add('hidden');
    } else if (regexValidation) {
        input.classList.remove('outline-none');
        input.classList.remove('outline-red-500', 'outline-2', 'outline');
        input.classList.add('outline-green-500', 'outline-2', 'outline');
        formBtn.classList.remove('disabled', 'cursor-not-allowed', 'opacity-50');
        information.classList.add('hidden');
    } else {
        input.classList.remove('outline-none');
        input.classList.remove('outline-green-500', 'outline-2', 'outline');
        input.classList.add('outline-red-500', 'outline-2', 'outline');
        formBtn.classList.add('disabled', 'cursor-not-allowed', 'opacity-50');
        information.classList.remove('hidden');
    }
};

// Función para habilitar/deshabilitar el botón del formulario
const enableFormButton = () => {
    const isFormValid = nameValidation && emailValidation && passwordValidation && matchValidation && phoneValidation && countriesValidation;
    formBtn.classList.toggle('disabled', !isFormValid);
    formBtn.classList.toggle('cursor-not-allowed', !isFormValid);
    formBtn.classList.toggle('opacity-50', !isFormValid);
    formBtn.disabled = !isFormValid;
};

// Eventos de entrada para validaciones
nameInput.addEventListener('input', e => {
    nameValidation = NAME_VALIDATION.test(e.target.value);
    validation(nameInput, nameValidation);
    enableFormButton();
});
emailInput.addEventListener('input', e => {
    emailValidation = EMAIL_VALIDATION.test(e.target.value);
    validation(emailInput, emailValidation);
    enableFormButton();
});
phoneInput.addEventListener('input', e => {
    phoneValidation = PHONE_VALIDATION.test(e.target.value);
    const information = phoneInput.parentElement.parentElement.children[1];

    if (phoneInput.value === '') {
        phoneInput.classList.remove('outline-red-500', 'outline-2' , 'outline' );
        phoneInput.classList.remove('outline-green-500' , 'outline-2' , 'outline');
        phoneInput.classList.add('outline-none');
        information.classList.add('hidden');
    } else if (phoneValidation) {
        phoneInput.classList.remove('outline-none');
        phoneInput.classList.add('outline-green-500'  , 'outline-2' , 'outline');
        phoneInput.classList.remove('outline-red-500', 'outline', 'outline');
        formBtn.classList.remove('disabled' , 'cursor-not-allowed');
        information.classList.add('hidden');
    } else if (!phoneValidation){
        phoneInput.classList.remove('outline-none');
        phoneInput.classList.remove('outline-green-500' , 'outline-2' , 'outline' );
        phoneInput.classList.add('outline-red-500' , 'outline-2' , 'outline');
        formBtn.classList.add('disabled' , 'cursor-not-allowed');
        information.classList.remove('hidden');
    }
    enableFormButton();
});
passwordInput.addEventListener('input', e => {
    passwordValidation = PASSWORD_VALIDATION.test(e.target.value);
    matchValidation = e.target.value === matchInput.value;
    validation(passwordInput, passwordValidation);
    validation(matchInput, matchValidation);
    enableFormButton();
});
matchInput.addEventListener('input', e => {
    matchValidation = e.target.value === passwordInput.value;
    validation(matchInput, matchValidation);
    enableFormButton();
});
countries.addEventListener('change', e => {
    const optionSelected = [...e.target.options].find(option => option.selected);
    phoneCode.innerHTML = `+${optionSelected ? optionSelected.value : '##'}`;
    countries.classList.add('outline-green-500', 'outline-2', 'outline');
    phoneCode.classList.add('outline-green-500', 'outline-2', 'outline');
    countriesValidation = optionSelected && optionSelected.value !== '';
    enableFormButton();
    validation(e.target, countriesValidation);
});

// Evento de envío del formulario
form.addEventListener('submit', async e => {
    e.preventDefault();
    try {
        const newUser = {
            name: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
            phone: `${phoneCode.innerHTML} ${phoneInput.value}`
        };
        const { data } = await axios.post('/api/users' , newUser);
        createNotification(false, data);
       setTimeout(() => {
           notification.innerHTML = '';
       }, 5000);

nameInput.value = '';
emailInput.value = '';
phoneInput.value = '';
passwordInput.value = '';
matchInput.value = '';
validation(nameInput, false);
validation(emailInput, false);
validation(phoneInput, false);
validation(passwordInput, false);
validation(matchInput, false);
        
    } catch (error) {
        createNotification(true, error.response.data.error);
    setTimeout(() => {
        notification.innerHTML = '';
    }, 5000);
    form.reset();
        nameValidation = emailValidation = passwordValidation = matchValidation = phoneValidation = countriesValidation = false;
        enableFormButton();
    }
});

// Funciones para alternar la visibilidad de las contraseñas
const togglePassword = document.querySelector('#toggle-password');
const toggleMatchPassword = document.querySelector('#toggle-matchPassword');

togglePassword.addEventListener('click', () => {
    const passwordField = passwordInput;
    const icon = togglePassword.querySelector('i');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

toggleMatchPassword.addEventListener('click', () => {
    const matchPasswordField = matchInput;
    const icon = toggleMatchPassword.querySelector('i');

    if (matchPasswordField.type === 'password') {
        matchPasswordField.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        matchPasswordField.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

