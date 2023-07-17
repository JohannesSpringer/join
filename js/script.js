

/**
 * go to sign_up.html
 */
function goToSignUp() {
    window.location.href = "sign_up.html";
}

/**
 * go to index.html
 */
function goToIndex() {
    window.location.href = "index.html";
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
        handleLoginSuccess(email, password, rememberMe, user);
    } else {
        handleLoginFailure();
    }
    //     if ( hashWithSHA256(loginPassword.value) === curUser.password ) {
    //         goToSummary();
    //     } else {
    //         showLoginError();
    //     }
    // };
}

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