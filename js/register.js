/**
 * This function initializes the login webpage
 * 
 */
function initRegister() {
    loadUsers();
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
    await addUserToLocalArray();
    await setItem('users', JSON.stringify(users));
    registerUserSuccess();
    resetForm();
    setTimeout(goToIndex, 1000);
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
    hideEmailExistsMessage();
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
    registerEmail.style = 'border-color: #D1D1D1';
    registerError.style = 'display: none';
    registerEmail.value = '';
}

/**
 * This function adds the new user to the local users array.
 */
async function addUserToLocalArray() {
    registerBtn.disabled = true;
    let hashedPassword = await hashWithSHA256(registerPassword.value);
    users.push({
        name: registerName.value,
        email: registerEmail.value,
        password: hashedPassword.toString(),
        color: getRandomColor(),
        id: -1,
        initials: getInitialsFromName(registerName.value),
        contacts: users[0].contacts
    });
}