let users = [];

/**
 * This function initializes the login webpage
 * 
 */
async function initRegister() {
    loadUsers();
}

/**
 * This function loads the users from backend
 * 
 */
async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**
 * This function registers a new user with email and password
 * 
 */
async function registerUser() {
    if ( userAlreadyExists() ) {
        handleUserAlreadyRegisteredError();
        return;
    };
    addUserToLocalArray();
    await setItem('users', JSON.stringify(users));
    registerUserSuccess();
    resetForm();
}

/**
 * This functions resets the register form
 * 
 */
function resetForm() {
    registerName.value = '';
    registerEmail.value = '';
    registerPassword.value = '';
    registerBtn.disabled = false;
    resetRegisterError();
}

/**
 * This function checks the existing user emails and compares it with the
 * new user email
 * 
 * @returns True if the email already exists in backend
 */
function userAlreadyExists() {
    return users.some(user => user.email === registerEmail.value);
}

/**
 * This functions resets the register form after existing error with email
 */
function resetRegisterError() {
    registerEmail.style = 'border-color: unset';
    registerError.style = 'display: none';
}

/**
 * This functions shows a message after successfully registered new user
 */
function registerUserSuccess() {
    registerSuccess.style = 'display: block'
}

/**
 * This function shows the Error message for already existing Email 
 * and mark the email input field
 */
function handleUserAlreadyRegisteredError() {
    registerEmail.style = 'border-color: red';
    registerError.style = 'display: block';
    registerPassword.value = '';
    setTimeout(hideEmailExistsMessage, 3000);
}

/**
 * This functions resets the Error message for already existing Email
 * and resets the email input field
 */
function hideEmailExistsMessage() {
    registerEmail.style = 'border-color: unset';
    registerError.style = 'display: none';
    registerEmail.value = '';
}

function addUserToLocalArray() {
    registerBtn.disabled = true;
    users.push({
        name: registerName.value,
        email: registerEmail.value,
        password: registerPassword.value
    });
}