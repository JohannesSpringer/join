

/**
 * go to sign_up.html
 */
function goToSignUp() {
    window.location.href = "sign_up.html";
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
    if ( (curUser = userIsExisting()) ) {
        if ( loginPassword.value === curUser.password ) {
            goToSummary();
        } else {
            showLoginError();
        }
    };
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
 * This function shows an error message for wrong login credentials. 
 * Reset password input value
 */
function showLoginError() {
    loginError.style.display = 'flex';
    loginPassword.value = '';
}

/**
 * This function changes the current shown webpage to summary site
 */
function goToSummary() {
    window.location.href = "summary.html";
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