let contactsA = [];
let contact = {};
let activeContact;
let regUserMail = localStorage.getItem('loginEmail');
let userData;
let userArrayId;

let orderedContacts = new Array([], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []);

/**
 * This function loads data from server
 */
async function init() {
    await getAllUsers();
    await insertContactsToContactList();
    document.body.classList.add('overflow');
    displayInitialsFromCurrentUser();
};

/**
 * This function show an animation div
 */
function showAlert() {
    document.getElementById('alert').classList.add('animate');
    setTimeout(() => {
        document.getElementById('alert').classList.remove('animate');
    }, 2500);
}

/**
 * This function saves the users in backend
 */
async function addContacts() {
    await setItem('users', JSON.stringify(contactsA));
}

/**
 * load all Contacts to contacts list
 * 
 */
async function insertContactsToContactList() {
    let container = document.getElementById('contacts-list');
    container.innerHTML = '';
    orderContacts();
    for (let i = 0; i < orderedContacts.length; i++) {
        if (orderedContacts[i].length > 0) {
            container.innerHTML += genContactsHeader(i);
            for (let j = 0; j < orderedContacts[i].length; j++) {
                const contact = orderedContacts[i][j];
                container.innerHTML += genContactHtml(contact);
            }
        }
    }
}

/**
 * Sort Contacts by Firstname from A to Z
 */
function sortContacts() {
    contactsA = contactsA.sort(function (a, b) {
        return a.name.toLowerCase().localeCompare(
            b.name.toLowerCase()
        );
    });
}

/**
 * Sort Contacts alphabetical to orderedContacts
 */
function orderContacts() {
    sortContacts();
    orderedContacts = new Array([], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []);
    // move contacts to array with beginning letter
    for (let i = 0; i < contactsA.length; i++) {
        let letter = contactsA[i].name.toLowerCase().toString();
        letter = letter.replace(/\u00e4/g, "ae").replace(/\u00fc/g, "ue").replace(/\u00f6/g, "oe");
        letter = letter.slice(0, 1);
        letter = letter.charCodeAt(0) - 97;
        orderedContacts[letter].push(contactsA[i]);
    }
}

/**
 * The function returns the first letter of the first name and last name.
 * If the last name does not exist, then only the first letter of the first name is output
 * @example
 * getInitial('Max Mustermann');
 * @returns {String} MM
 * @param {String} username The name of the person you want to get the initials of.
 * @returns first letter of the first name and last name or only the first letter of the first name.
 * 
 */
function getInitial(username) {
    if (username.includes(' ')) {
        return username.charAt(0).toUpperCase() + username.charAt(username.lastIndexOf(' ') + 1).toUpperCase();
    } else {
        return username.charAt(0).toUpperCase();
    }
}

/**
 * This function changes the highlighted contact
 */
function changeActiv() {
    let btnContainer = document.getElementById('contacts-list');
    let btns = btnContainer.getElementsByClassName('list-contact');
    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function () {
            var current = document.getElementsByClassName("list-contact-activ");
            current[0].className = current[0].className.replace("list-contact-activ", "");
            this.className += " list-contact-activ";
        }
        );
    }
}

/**
 * shows the first Contact at the details
 */
async function showContact(id) {
    let btnContainer = document.getElementById('contacts-list');
    let btns = btnContainer.getElementsByClassName('list-contact');
    let contactId = id;
    let contactElement = document.getElementById(contactId);
    Array.from(document.querySelectorAll('.list-contact.list-contact-activ')).forEach((el) => el.classList.remove('list-contact-activ'));
    contactElement.className += " list-contact-activ";
    showDetails(contactId);
}

/**
 * Loads all user and set the userData
 */
async function getAllUsers() {
    await loadUsers();
    await getCurrentUserData();
}

/**
 * Set the current userData
 */
async function getCurrentUserData() {
    // setGuestUserData();
    await users.forEach(function users(value, index) {
        if (value.email === regUserMail) {
            userData = value;
            userArrayId = index;
            contactsA = value.contacts || [];
        }
    })
}

/**
 * This function set userData for the Guest Login
 */
function setGuestUserData() {
    userData = {
        name: 'Guest',
        initials: 'GU',
        id: -1,
        color: '#00FF00',
        email: 'test@test.de',
        contacts: []
    }
}

/**
 * Deleting a contact by userId
 * 
 * @param {number} userId 
 */
function delContact(userId) {
    contactsA.splice(contactsA.indexOf(getIndexOfArray(contactsA, userId)), 1);
    animationAndPushToServer();
    document.getElementById('contactDetails').innerHTML = '';
    let overlay = document.getElementById('overlayContent');
    if (!overlay.classList.contains('d-none')) {
        toggleDNone('overlayContent'); // only toggle if overlay is shown
    }
    hideDetailsAtMobile();
}

/**
 * Hiding contact details in mobile version
 */
function hideDetailsAtMobile() {
    let windowWidth = window.innerWidth;
    if (windowWidth < 1000) {
        document.getElementById('contacts-container').getElementsByClassName('contact-info')[0].classList.add('d-none-mobile');
        document.getElementById('contacts-container').getElementsByClassName('contacts')[0].classList.remove('d-none');
    }
}

/**
 * Adding a new contact
 */
function addContact() {
    let name = document.getElementById('name-input').value;
    let email = document.getElementById('email-input').value;
    let phone = document.getElementById('phone-input').value;
    let initials = getInitialsFromName(name);
    let color = getRandomColor();
    let singleContact = {
        name: name,
        email: email,
        phone: phone,
        initials: initials,
        color: color,
        id: getUnusedContactsId()
    }

    contactsA.push(singleContact);
    animationAndPushToServer();
    showAlert();
    showContact(singleContact.id);
}

/**
 * 
 * @returns An unused unique userId to identify the contact
 */
function getUnusedContactsId() {
    let contactsFromCurrentUser = users[userArrayId].contacts;
    let alreadyUsedIds = [];
    contactsFromCurrentUser.forEach(u => {
        alreadyUsedIds.push(u.id);
    });
    for (let i = 0; i < alreadyUsedIds.length + 1; i++) {
        if (!alreadyUsedIds.includes(i)) return i;
    }
}

/**
 * 
 * @param {Integer} id - id from user you want to edit
 */
function editContact(id) {
    let name = document.getElementById('name-input').value;
    let email = document.getElementById('email-input').value;
    let phone = document.getElementById('phone-input').value;
    let initials = getInitialsFromName(name);
    let cntctElem = getIndexOfArray(contactsA, id);
    let idInContactsA = contactsA.indexOf(cntctElem);
    contactsA[idInContactsA].name = name;
    contactsA[idInContactsA].email = email;
    contactsA[idInContactsA].phone = phone;
    contactsA[idInContactsA].initials = initials;
    animationAndPushToServer();
    showContact(id);
}

/**
 * Displays an animation after adding a user and push the data to the server
 */
function animationAndPushToServer() {
    addContactsToUser();
    toggleDNone('overlayContent');
    insertContactsToContactList();
}

/**
 * Push users to the server
 */
async function pushToServer() {
    await setItem('users', JSON.stringify(users));
}

/**
 * Adding the new user to the contacts of the current registered user
 */
function addContactsToUser() {
    userData = { ...userData, contacts: contactsA };
    users.splice(userArrayId, 1);
    users.push(userData);
    overwriteContactsForOtherUsers();
    pushToServer();
}

function overwriteContactsForOtherUsers() {
    users.forEach(usr => {
        usr.contacts = userData.contacts;
    });
}

/**
 * This function renders the contact details for mobile version
 */
function showDetailsAtMobile() {
    let windowWidth = window.innerWidth;
    if (windowWidth < 1000) {
        document.getElementsByClassName('contacts')[0].classList.add('d-none');
        document.getElementsByClassName('contact-info')[0].classList.remove('d-none-mobile');
        document.getElementsByClassName('new-contact')[0].classList.add('d-none');
        document.getElementsByClassName('contact-changes')[0].classList.add('d-none');
        document.getElementById('mobile-menu').innerHTML = /*html */`
                <div class="mobile-icon"><img src="./assets/img/contactsMobileMenu.png"></div>
        `;
    }
}


/*Gen HTML Content */

/**
 * 
 * @param {JSON} contact - User from Database
 * @returns html template
 */
function genContactHtml(contact) {
    return /*html */`
        <div class="list-contact" onclick="showContact(${contact.id}); showDetailsAtMobile(${contact.id})" id="${contact.id}">
            <span class="contact-frame" style="background-color: ${contact.color}" >${contact.initials}</span>
            <div class="list-contact-info">
                <p>${contact.name}</p>
                <p>${contact.email}</p>
            </div>
        </div>   
    `;
}

/**
 * 
 * @param {Number} i formCharCode  
 * @returns HTML template Contactlist header
 */
function genContactsHeader(i) {
    return /*html */ `
        <div class="list-header">
               ${String.fromCharCode(i + 97).toUpperCase()}
        </div>
    `;
}

/**
 * Render the details of a contact
 * 
 * @param {number} id 
 */
function showDetails(id) {
    changeActiv();
    let editname = id;
    document.getElementById('contactDetails').innerHTML = '';
    document.getElementById('contactDetails').innerHTML = /*html */`
        <div class="contact-details-head">
        <span class="list-contact-frame" style="background-color: ${getIndexOfArray(contactsA, id).color}">${getIndexOfArray(contactsA, id).initials}</span>
        <div class="contactInfo">
            <span class="contact-name">${getIndexOfArray(contactsA, id).name}</span>
            <div class="contact-changes">
                <div class="contact-edit" onclick="editShowContact(${editname})">
                    <img src="./assets/img/edit.png" alt="">
                    <p>Edit</p>
                </div>
                <div class="contact-edit" onclick="delContact(${editname})">
                    <img src="./assets/img/delete.png" alt="">
                    <p>Delete</p>
                </div>
            </div>
        </div>
        </div>
        <div class="contact-info-head">
            <p>Contact Information</p>
        </div>
        <div class="contact-info-container">
            <div class="contact-info-segment">
                <span class="contact-info-title">Email</span>
                <a href="mailto:${getIndexOfArray(contactsA, id).email}">${getIndexOfArray(contactsA, id).email}</a>
            </div>
            <div class="contact-info-segment">
                <span class="contact-info-title">Phone</span>
                <a href="tel:${getIndexOfArray(contactsA, id).phone}">${getIndexOfArray(contactsA, id).phone}</a>
            </div>
        </div>
        <div id="mobile-menu" onclick="showMobileMenuContact(${id})"></div>`;
}

/**
 * Renders the editing mode for the contact
 * 
 * @param {number} contact 
 */
function editShowContact(contact) {
    document.getElementById('overlayContent').innerHTML = '';

    if (typeof contact !== 'undefined') {
        showEditContact(contact);
    } else {
        showCreateContact();
    }
    toggleDNone('overlayContent');
}

/**
 * Renders the contact menu for mobile version
 * 
 * @param {number} id 
 */
function showMobileMenuContact(id) {
    let mobilemenu = document.getElementById('mobile-menu');
    mobilemenu.setAttribute('onclick', `hideMobileMenuContact(${id})`);
    mobilemenu.innerHTML += `
        <div class="mobile-menu-contact" onclick="noClose(event)">
            <div class="mobile-menu-edit" onclick="editShowContact(${id})">
                <img src="./assets/img/edit.png">
                <span>Edit</span>
            </div>
            <div class="mobile-menu-delete" onclick="delContact(${id})">
                <img src="./assets/img/delete.png">
                <span>Delete</span>
            </div>
        </div>
        `;
}

/**
 * Hides the contact menu for mobile version
 * 
 * @param {number} id 
 */
function hideMobileMenuContact(id) {
    let mobilemenu = document.getElementById('mobile-menu');
    mobilemenu.setAttribute('onclick', `showMobileMenuContact(${id})`);
    mobilemenu.innerHTML = '<div class="mobile-icon"><img src="./assets/img/contactsMobileMenu.png"></div>';
}

/**
 * Renders the view to add/create a new contact
 */
function showCreateContact() {
    document.getElementById('overlayContent').innerHTML =  /*html */`
    <div class="close-top">
        <img src="./assets/img/contacts-icons/close-white.png" alt="" onclick="toggleDNone('overlayContent')" class="white">
    </div>
    <div class="overlay-left">        
        <img src="./assets/img/menu-logo.png" alt="" id="logo">
        <p class="overlay-title">Add contact</p>
        <p>Tasks are better with a team!</p>
        <div class="overlay-sep"></div>
    </div>
    <!-- createContact -->
    <div class="overlay-right">
        <img src="./assets/img/contacts-icons/userIcon.png" alt="" class="user-icon">
        <form action="#" onsubmit="addContact(); return false">
            <input class="name-input" id="name-input" placeholder="Name" type="text" pattern="[a-zA-ZÄäÜüÖöß ]*" maxlength="30" required>
            <input class="email-input" id="email-input" placeholder="Email" type="email" required>
            <input class="phone-input" id="phone-input" placeholder="Phone" type="tel" pattern="[0-9+ ]*" minlength="6" maxlength="30" required>
            <div class="buttons">
                <button type="button" class="cancel-contact-btn" onclick="toggleDNone('overlayContent')">Cancel </button>
                <button type="submit" class="add-contact-btn" >Create contact</button>
            </div>
        </form>
        <div class="close-contact">
            <img src="./assets/img/contacts-icons/close.png" alt="" onclick="toggleDNone('overlayContent')" class="dark">
        </div>
    </div>`
}

/**
 * Renders the view to edit the contact
 * 
 * @param {number} id 
 */
function showEditContact(id) {
    let userId = id;
    document.getElementById('overlayContent').innerHTML =  /*html */
    `<div class="close-top">
        <img src="./assets/img/contacts-icons/close-white.png" alt="" onclick="toggleDNone('overlayContent')" class="white">
    </div>
    <div class="overlay-left">
        <img src="./assets/img/menu-logo.png" alt="" id="logo">
        <p class="overlay-title">Edit contact</p>
        <div class="overlay-sep"></div>
    </div>
    <div class="overlay-right">
        <img src="./assets/img/contacts-icons/userIcon.png" alt="" class="user-icon">    
        <form action="#" onsubmit="editContact(${userId}); return false">
            <input class="name-input" id="name-input" placeholder="Name" type="text" pattern="[a-zA-ZÄäÜüÖöß ]*" maxlength="30" required value="${getIndexOfArray(contactsA, id).name}">
            <input class="email-input" id="email-input" placeholder="Email" type="email" required value="${getIndexOfArray(contactsA, id).email}">
            <input class="phone-input" id="phone-input" placeholder="Phone" type="tel" pattern="[0-9+ ]*" minlength="6" maxlength="30" required value="${getIndexOfArray(contactsA, id).phone}">
            <div class="buttons">
                <button type="button" class="cancel-contact-btn" onclick="delContact(${userId})">Delete</button>
                <button type="submit" class="add-contact-btn">Save</button>
            </div>        
        </form>
        <div class="close-contact">
            <img src="./assets/img/contacts-icons/close.png" alt="" onclick="toggleDNone('overlayContent')" class="dark">
        </div>
    </div>`
}