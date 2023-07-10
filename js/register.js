let users = [];

/**
 * This function initializes the login webpage
 * 
 */
async function initLogin() {
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
async function register() {
    registerBtn.disabled = true;
    users.push({
        email: email.value,
        password: password.value
    });
    await setItem('users', JSON.stringify(users));
    resetForm();
}

/**
 * This functions resets the register form
 * 
 */
function resetForm() {
    email.value = '';
    password.value = '';
    registerBtn.disabled = false;
}