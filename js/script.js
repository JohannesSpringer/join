let rememberMeChecked;
let previousSelectedMenuItems = [];

/**
 * This functions executes the back arrow in legal notice and go back one page. This function is needed
 * for the selected menu item.
 */
async function goBackToPrevious() {
    previousSelectedMenuItems = await JSON.parse(localStorage.getItem('previousSelectedMenuItems'));
    previousSelectedMenuItems = shortenArrayTo2Elements(previousSelectedMenuItems);
    localStorage.setItem('previousSelectedMenuItems', JSON.stringify(previousSelectedMenuItems));
    goToPage(previousSelectedMenuItems[0]);
}

/**
 * This function shortens an array to his last 2 elements and returns this
 * 
 * @param {Array} arr 
 * @returns Array with only the last 2 elements of the input array
 */
function shortenArrayTo2Elements(arr) {
    while (arr.length > 2) {
        arr.shift();
    }
    return arr;
}

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
 * This function changes the displayed page
 * 
 * @param {string} page Name of the target page
 */
async function goToPage(page) {
    previousSelectedMenuItems = await JSON.parse(localStorage.getItem('previousSelectedMenuItems'));
    if (previousSelectedMenuItems == null) previousSelectedMenuItems = [];
    previousSelectedMenuItems.push(page);
    localStorage.setItem('previousSelectedMenuItems', JSON.stringify(previousSelectedMenuItems));
    window.location.href = `${page}.html`;
    localStorage.setItem('selectedMenuItem', page);
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
async function checkValidCredentials() {
    if ((curUser = await userIsExisting()) && await isPasswordValid(loginPassword.value, curUser.password)) {
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
    let hasehdLoginPassword = await hashWithSHA256(password)
    return hasehdLoginPassword.toString() === hashedPassword;
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
    if (string.length == 64) return string;
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

/**
 * This function resets the email and password value
 */
function clearLoginFields() {
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
}

/**
 * This function handle the successful login
 * Saving data if remember me checkbox is checked
 * Set the current user in local storage
 * Go to the summary webpage
 * 
 * @param {string} email - This is the email of the logged in user
 * @param {string} password - This is the hashed password of the logged in user
 * @param {boolean} rememberMe - This is the checkbox if the user should be automatically logged in the next time
 * @param {*} user - This is the user object of the logged in user
 */
function handleLoginSuccess(email, password, rememberMe, user) {
    if (rememberMe) {
        saveLoginData(email, password);
    } else {
        clearLoginData();
    }
    setCurrentUser(user);
    goToPage('summary');
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
    const bgPrivacyPolicy = document.getElementById('bg-privacy-policy');
    const bgLegalNotice = document.getElementById('bg-legal-notice');

    switch (selectedMenuItem) {
        case 'summary':
            bgSummary.classList.add('highlight-nav');
            break;
        case 'board':
            bgBoard.classList.add('highlight-nav');
            break;
        case 'add_task':
            bgAddTask.classList.add('highlight-nav');
            break;
        case 'contacts':
            bgContacts.classList.add('highlight-nav');
            break;
        case 'privacy_policy':
            bgPrivacyPolicy.classList.add('highlight-nav');
            break;
        case 'legal_notice':
            bgLegalNotice.classList.add('highlight-nav');
            break;
        default:
            break;
    }
}

/**
 * This function saves the credentials in the local storage
 * 
 * @param {string} email - This is the registered email
 * @param {string} password - This is the hashed password
 */
async function saveLoginData(email, password) {
    localStorage.setItem("loginEmail", email);
    if (!rememberMeChecked) localStorage.setItem("loginPassword", await hashWithSHA256(password));
    localStorage.setItem("rememberMeChecked", true);
}

/**
 * This function deletes the credentials from local storage
 */
function clearLoginData() {
    localStorage.removeItem("loginEmail");
    localStorage.removeItem("loginPassword");
    localStorage.removeItem("rememberMeChecked");
}

/**
 * This function saves the logged in username to local storage
 * 
 * @param {*} user 
 */
function setCurrentUser(user) {
    localStorage.setItem("currentUser", user.name);
    localStorage.setItem("loginEmail", user.email);
}

/**
 * This functions loads the stored login data from local storage
 */
function loadLoginData() {
    let storedEmail = localStorage.getItem("loginEmail");
    let storedPassword = localStorage.getItem("loginPassword");
    rememberMeChecked = localStorage.getItem("rememberMeChecked");

    if (storedEmail && storedPassword && rememberMeChecked) {
        document.getElementById("loginEmail").value = storedEmail;

        document.getElementById("loginPassword").value = storedPassword;
        rememberCheckbox.checked = true;
    } else {
        rememberCheckbox.checked = false;
    }
}

/**
 * Guest Login
 */
function guestLogin() {
    event.preventDefault();
    currentUser = 'Guest';
    localStorage.setItem('currentUser', 'Guest');
    clearLoginData();
    localStorage.setItem('loginEmail', 'test@test.de');
    goToPage('summary');
}

/**
 * This functions cuts the first letters of the surname and lastname
 * @param {string} name - The complete name of the user you want to have the initials
 * @returns Initials with 2 letters of the name
 */
function getInitialsFromName(name) {
    let nameParts = name.split(" ");
    if (nameParts.length == 1) {
        return nameParts[0].slice(0, 2).toUpperCase();
    } else {
        return (nameParts[0].slice(0, 1) + nameParts[nameParts.length - 1].slice(0, 1)).toUpperCase();
    };
}

/**
 * Return a random Color-Hexcode 
 * @returns random color hexcode (#7D735F)
 */
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * add/remove class d-none to your Object
 * @param {string} id - need the id from your Object
 */
function toggleDNone(id) {
    document.getElementById(`${id}`).classList.toggle('d-none');
}

/**
 * This function search the correct user in the contacts, this can be the 
 * current user too.
 * 
 * @param {Array} a - Array with users
 * @param {Integer} s - User ID or contact ID to find in array 
 * @returns - User with the User ID / contact ID
 */
function getIndexOfArray(a, s) {
    if (s == -1) {
        return userData;
    } else {
        return a.find((e) => {
            return e.id == s;
        });
    }
}

/**
 * This functions displays the initials of the current user in the top right corner
 */
function displayInitialsFromCurrentUser() {
    let divElem = document.getElementById('profil-icon');
    divElem.innerHTML = userData.initials;
    divElem.style.border = `2px solid ${userData.color}`;
}

/**
 * show and hide Log out Button in desktop_template.html
 */
function openProfilIconMenu() {
    let profilIconMenu = document.getElementById('profilIconMenu');

    if (profilIconMenu.style.display === 'block') {
        profilIconMenu.style.display = 'none';
    } else {
        profilIconMenu.style.display = 'block';
    }
}

/**
 * Logout 
 */
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html"
}

/**
 * This function loads the user data and display the initials of the current user
 */
async function initLegalNotice() {
    await getAllUsers();
    displayInitialsFromCurrentUser();
}

/**
 * show and hide E-Mail sent Popup
 */
function showEmailSentMessage() {
    let popup = document.getElementById('email-sent-popup');
    popup.style.display = 'flex';
    setTimeout(hideEmailSentMessage, 3000);
}

function hideEmailSentMessage() {
    document.getElementById('email-sent-popup').style.display = 'none';
}