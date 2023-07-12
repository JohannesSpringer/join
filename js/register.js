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
        registerEmail.style = 'border-color: red';
        registerError.style = 'display: flex';
        return;
    };
    registerBtn.disabled = true;
    users.push({
        name: registerName.value,
        email: registerEmail.value,
        password: registerPassword.value
    });
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

function userAlreadyExists() {
    res = false;
    for (let i = 0; i < users.length; i++) {
        const u = users[i];
        if ( u.email == registerEmail.value ) {
            console.log("User mit entsprechender Email exisitert bereits!");
            res = true;
            break;
        }
    }
    return res;
}

function resetRegisterError() {
    registerEmail.style = 'border-color: unset';
    registerError.style = 'display: none';
}

function registerUserSuccess() {
    registerSuccess.style = 'display: flex'
}