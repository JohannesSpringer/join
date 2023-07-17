

/**
 * This function changes the current shown webpage to sign_up.html
 */
function goToSignUp() {
    window.location.href = "sign_up.html";
}

/**
 * This function changes the current shown webpage to index.html
 */
function goToIndex() {
    window.location.href = "index.html";
}

/**
 * This function changes the current shown webpage to summary.html
 */
function goToSummary() {
    window.location.href = "summary.html";
    localStorage.setItem('selectedMenuItem', 'summary');
}

/**
 * This functions loads all users from backend and checks if the current user
 * with the correct credentials.
 */
async function userLogin() {
    await loadUsers();
    checkValidCredentials();
}

/**
 * This functions is checking the login credentials. If they fit, the user
 * will be logged in
 */
function checkValidCredentials() {
    if ( (curUser = userIsExisting()) && isPasswordValid(loginPassword.value, curUser.password) ) {
        handleLoginSuccess(loginEmail.value, loginPassword.value, rememberCheckbox.checked, curUser);
    } else {
        handleLoginFailure();
    }
}

/**
 * This function checks if the password is correct of the current user
 * 
 * @param {string} password - The password in the password input field on login page
 * @param {*} hashedPassword - The hashed password from the server from the current user
 * @returns 
 */
async function isPasswordValid(password, hashedPassword) {
    return await hashWithSHA256(password) === hashedPassword;
}

/**
 * This function checks if the user already exists
 * 
 * @returns index of the user in users array
 */
function userIsExisting() {
    return users.find(u => u.email === loginEmail.value);
}

/**
* hash a string with SHA-256
*/
async function hashWithSHA256(string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(string);
    const hash = await crypto.subtle.digest('SHA-256', data);
    // convert hash to hex string
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

/**
 * This function handels the false login
 */
function handleLoginFailure() {
    showLoginFailureMessage();
    clearLoginFields();
}

/**
 * This function shows an error message for wrong login credentials. 
 * Reset password input value
 */
function showLoginFailureMessage() {
    document.getElementById('loginError').style.display = 'block';
    setTimeout(hideFalseData, 3000);
}

function clearLoginFields() {
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
}

function handleLoginSuccess(email, password, rememberMe, user) {
    if (rememberMe) {
        saveLoginData(email, password);
    } else {
        clearLoginData();
    }
    setCurrentUser(user);
    goToSummary();
}

/**
 * highlight the Menu Nav with a Bg. necessary because on Page change CSS Classes are resettet and now we get status from Local Storage
 */
function highlightSelectedMenuItem() {
    const selectedMenuItem = localStorage.getItem('selectedMenuItem');
    const bgSummary = document.getElementById('bg-summary');
    const bgBoard = document.getElementById('bg-board');
    const bgAddTask = document.getElementById('bg-add-task');
    const bgContacts = document.getElementById('bg-contacts');
    const bgLegalNotice = document.getElementById('bg-legal-notice');
    
    switch (selectedMenuItem) {
        case 'summary':
            bgSummary.classList.add('highlight-nav');
            break;
        case 'board':
            bgBoard.classList.add('highlight-nav');
            break;
        case 'addTask':
            bgAddTask.classList.add('highlight-nav');
            break;
        case 'contacts':
            bgContacts.classList.add('highlight-nav');
            break;
        case 'legalNotice':
            bgLegalNotice.classList.add('highlight-nav');
            break;
        default:
            break;
    }
}

function saveLoginData(email, password) {
    localStorage.setItem("loginEmail", email);
    localStorage.setItem("loginPassword", password);
    localStorage.setItem("rememberMeChecked", true);
}

function clearLoginData() {
    localStorage.removeItem("loginEmail");
    localStorage.removeItem("loginPassword");
    localStorage.removeItem("rememberMeChecked");
}

function setCurrentUser(user) {
    localStorage.setItem("currentUser", user.name);
}

/**
 * This functions loads the stored login data from local storage
 */
function loadLoginData() {
    let storedEmail = localStorage.getItem("loginEmail");
    let storedPassword = localStorage.getItem("loginPassword");
    let rememberMeChecked = localStorage.getItem("rememberMeChecked");

    if (storedEmail && storedPassword && rememberMeChecked) {
        document.getElementById("loginEmail").value = storedEmail;
        document.getElementById("loginPassword").value = storedPassword;
        rememberCheckbox.checked = true;
    } else {
        rememberCheckbox.checked = false;
    }
}