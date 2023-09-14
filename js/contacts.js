let contactsA = [];
let contact = {};
let activeContact;
// let allUsersDB;
let regUserMail = localStorage.getItem('loginEmail');
let userData;
let userArryId;

let orderedContacts = new Array([], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []);
// setURL('https://gruppe-5009.developerakademie.net/smallest_backend_ever');

/**
 * Load Data from server
 * 
 */
async function init() {
    // await downloadFromServer();
    // contacts = JSON.parse(backend.getItem('contacts')) || [];
    // await loadUsers();
    await getAllUsers();
    await insertContactsToContactList();
    // showContact(0);
    document.body.classList.add('overflow');
};

function showAlert() {
    document.getElementById('alert').classList.add('animate');
    setTimeout(() => {
        document.getElementById('alert').classList.remove('animate');
    }, 2500);
}
async function addContacts() {
    // await backend.setItem('contacts', JSON.stringify(contactsA));
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
 * 
 */
function orderContacts() {
    sortContacts();
    orderedContacts = new Array([], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []);
    for (let i = 0; i < contactsA.length; i++) {
        contactsA[i].id = i;
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
    let contactId = id;// || btns[0].id;
    let contactElement = document.getElementById(contactId);
    Array.from(document.querySelectorAll('.list-contact.list-contact-activ')).forEach((el) => el.classList.remove('list-contact-activ'));
    contactElement.className += " list-contact-activ";
    showDetails(contactId);
}

async function getAllUsers() {
    await loadUsers();
    await getCurrentUserData();
}

async function getCurrentUserData() {
    await users.forEach(function users(value, index) {
        if (value.email === regUserMail) {
            userData = value;
            userArryId = index;
            contactsA = value.contacts || [];
        }
    })
}

function delContact(userId) {
    contactsA.splice(userId, 1);
    animationAndPushToServer();  
    document.getElementById('contactDetails').innerHTML = '';
    toggleDNone('overlayContent');
}

function addContact() {
    let name = document.getElementById('name-input').value;
    let email = document.getElementById('email-input').value;
    let phone = document.getElementById('phone-input').value;
    // Verify that the user entered a name, email address, and phone number.
    // if (!name || !email || !phone) {
    //     alert('Bitte geben Sie einen Namen, eine E-Mail-Adresse und eine Telefonnummer ein.');
    //     return;
    // }

    let initials = getInitialsFromName(name);
    let color = getRandomColor();
    let singleContact = {
        name: name,
        email: email,
        phone: phone,
        initials: initials,
        color: color
    }

    contactsA.push(singleContact);
    animationAndPushToServer();
    // showAlert();
    showContact(contactsA.findIndex((elem) => {
        return elem == singleContact;
    }));
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
    contactsA[id].name = name;
    contactsA[id].email = email;
    contactsA[id].phone = phone;
    contactsA[id].initials = initials;
    animationAndPushToServer();
    showContact(contactsA.findIndex((elem) => {
        return elem.email == email;
    }));
}

function animationAndPushToServer() {
    addContactsToUser();
    toggleDNone('overlayContent');
    insertContactsToContactList();
}

async function pushToServer() {
    // await backend.setItem('users', JSON.stringify(allUsersDB));
    await setItem('users', JSON.stringify(users));
}

function addContactsToUser() {
    userData = { ...userData, contacts: contactsA };
    users.splice(userArryId, 1);
    users.push(userData);
    pushToServer();
}

function showDetailsAtMobile() {
    let windowWidth = window.innerWidth;
    if (windowWidth < 1000) {
        document.getElementById('contacts-list').classList.add('d-none')
        document.getElementsByClassName('contact-info')[0].classList.remove('d-none-mobile')
        document.getElementsByClassName('new-contact')[0].classList.add('d-none')
        document.getElementById('mobile-menu').innerHTML = /*html */`
                <div class="mobile-icon"><img src="./assets/img/contacts-icons/pen-white.png" alt=""></div>
        `;
    }
}

function hideContactInfo() {
    document.getElementById('contacts-list').classList.remove('d-none')
    document.getElementsByClassName('contact-info')[0].classList.add('d-none-mobile')
    document.getElementsByClassName('new-contact')[0].classList.remove('d-none')
    document.getElementById('mobile-menu').innerHTML = '';
}

function addScroll() {
    document.getElementById('overlayAddTask').classList.remove('display-none');
    document.getElementById('overlayAddTask').classList.add('overlay-add-task');
    document.getElementById('mobileCreate').style.visibility = 'visible';
    renderOverlayAddTask();
    getDateOverlay();
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

function showDetails(id) {
    changeActiv();
    let editname = id;
    document.getElementById('contactDetails').innerHTML = '';
    document.getElementById('contactDetails').innerHTML = /*html */`
        <div class="contact-details-head">
        <span class="list-contact-frame" style="background-color: ${contactsA[id].color}">${contactsA[id].initials}</span>
        <div class="contactInfo">
            <span class="contact-name">${contactsA[id].name}</span>
            <div class="contact-changes">
                <div class="contact-edit">
                    <img src="./assets/img/edit.png" alt="">
                    <p onclick="editShowContact(${editname})">Edit</p>
                </div>
                <div class="contact-edit">
                    <img src="./assets/img/delete.png" alt="">
                    <p onclick="delContact(${editname})">Delete</p>
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
                <a href="mailto:${contactsA[id].email}">${contactsA[id].email}</a>
            </div>
            <div class="contact-info-segment">
                <span class="contact-info-title">Phone</span>
                <a href="tel:${contactsA[id].phone}">${contactsA[id].phone}</a>
            </div>
        </div>
        <div id="mobile-menu" onclick="editShowContact(${editname})"></div>`;
}

function editShowContact(contact) {
    document.getElementById('overlayContent').innerHTML = ''; //createContact

    if (typeof contact !== 'undefined') {
        showEditContact(contact);
    } else {
        showCreateContact();
    }
    toggleDNone('overlayContent');
}



function showCreateContact() {
    document.getElementById('overlayContent').innerHTML =  /*html */`
    <div class="close-top">
        <img src="./assets/img/contacts-icons/close-white.png" alt="" onclick="toggleDNone('overlayContent')" class="white">
    </div><div class="overlay-left">        
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
                <button type="submit" class="add-contact-btn" >
                    Create contact
                </button>
            </div>
        </form>
        <div class="close">
            <img src="./assets/img/contacts-icons/close.png" alt="" onclick="toggleDNone('overlayContent')" class="dark">
        </div>
    </div>`
}

function showEditContact(id) {
    let userId = id;
    document.getElementById('overlayContent').innerHTML =  /*html */`<div class="overlay-left">
        <div class="close-top">
        <img src="./assets/img/contacts-icons/close-white.png" alt="" onclick="toggleDNone('overlayContent')" class="white">
    </div>
    <img src="./assets/img/menu-logo.png" alt="" id="logo">
    <p class="overlay-title">Edit contact</p>
    <div class="overlay-sep"></div>
</div>
<div class="overlay-right">
    <img src="./assets/img/contacts-icons/userIcon.png" alt="">    
    <form action="#" onsubmit="editContact(${userId}); return false">
        <input class="name-input" id="name-input" placeholder="Name" type="text" pattern="[a-zA-ZÄäÜüÖöß ]*" maxlength="30" required value="${contactsA[id].name}">
        <input class="email-input" id="email-input" placeholder="Email" type="email" required value="${contactsA[id].email}">
        <input class="phone-input" id="phone-input" placeholder="Phone" type="tel" pattern="[0-9+ ]*" minlength="6" maxlength="30" required value="${contactsA[id].phone}">
        <div class="buttons">
            <button type="button" class="cancel-contact-btn" onclick="delContact(${userId})">Delete</button>
            <button type="submit" class="add-contact-btn" >
                Save
            </button>
        </div>        
    </form>
    <div class="close">
        <img src="./assets/img/contacts-icons/close.png" alt="" onclick="toggleDNone('overlayContent')" class="dark">
    </div>
</div>`
}