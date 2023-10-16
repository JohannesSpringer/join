let menuOpenContacts;
let menuOpenCategory;
let categoryColors = [
    '#8AA4FF',
    '#FF0000',
    '#2AD300',
    '#FF8A00',
    '#E200BE',
    '#0038FF'
];
let selectedCategory = [];
let selectedContacts = [];
let currentPrio;
let subtasks = [];
let subtaskStatus = [];
let formIsFilled = false;
let inputIds = [
    'taskTitle',
    'taskDescription',
    'taskDate'
];

/**
 * This function initialize the addTask page
 */
async function initAddTask() {
    await loadUsers();
    await loadTasks();
    await loadCategories();
    renderAddTask();
    await getAllUsers();
    displayInitialsFromCurrentUser();
}

/**
 * This function calls the render functions for adding a task
 */
function renderAddTask() {
    document.getElementById('addTaskInputsLeft').innerHTML += genHtmlInputTitle();
    document.getElementById('addTaskInputsLeft').innerHTML += genHtmlInputDescription();
    document.getElementById('addTaskInputsLeft').innerHTML += genHtmlInputAssign();
    document.getElementById('addTaskInputsRight').innerHTML += genHtmlInputDueDate();
    document.getElementById('addTaskInputsRight').innerHTML += genHtmlInputPrio();
    document.getElementById('addTaskInputsRight').innerHTML += genHtmlInputCategory();
    document.getElementById('addTaskInputsRight').innerHTML += genHtmlInputSubtasks();
    document.getElementById('addTaskInputsSubmit').innerHTML = genHtmlInputSubmit();
    // document.getElementById('reqTaskTitle').style.color = 'red';
}

/**
 * This functions checks all needed input fields to be filled in in a new task
 * Error handling is set to avoid errors, when this function is called from another
 * instance, where the input fields are not available
 */
function checkFormFilled() {
    try {
        formIsFilled = true;
        inputIds.forEach(id => {
            let elem = document.getElementById(id);
            if (elem.value == '') formIsFilled = false;
        });
        if ((selectedContacts.length == 0) || !currentPrio || selectedCategory.length == 0) {
            formIsFilled = false;
        }
        toggleSubmitButton();
    } catch (e) {
        if (!e instanceof TypeError) throw e;
    }
}

/**
 * This function handles the dis-/enabling of the submit button in add task
 */
function toggleSubmitButton() {
    let btnSubmit = document.getElementById('submitButton');
    let inpSubmit = btnSubmit.querySelector('input');
    if (formIsFilled) {
        btnSubmit.disabled = false;
        inpSubmit.disabled = false;
    } else {
        btnSubmit.disabled = true;
        inpSubmit.disabled = true;
    }
}

/**
 * This function saves the new task in the backend and displays the board view
 */
async function addTask() {
    let newTask = getNewTaskData();
    tasks.push(newTask);
    await setItem('tasks', JSON.stringify(tasks));
    goToBoard();
}

/**
 * This function creates the JSON format of the new task
 * @returns Data of the new task in JSON format
 */
function getNewTaskData() {
    return {
        'title': document.getElementById('taskTitle').value,
        'description': document.getElementById('taskDescription').value,
        'contacts': selectedContacts,
        'date': document.getElementById('taskDate').value,
        'prio': currentPrio,
        'category': selectedCategory,
        'subtasks': subtasks,
        'done': new Array(subtasks.length).fill(false),
        'task-id': findUnusedTaskIndex(),
        'status': 'todo'
    };
}

/**
 * This function reads all used indexes and returns an unused index
 * 
 * @returns unused index for task to be identified with
 */
function findUnusedTaskIndex() {
    let indexes = [];
    tasks.forEach(task => {
        indexes.push(task['task-id']);
    });
    indexes.sort(function (a, b) { return a - b });
    if (indexes.length == 0) return 0;
    else {
        for (let i = 0; i < indexes.length; i++) if (!indexes.includes(i)) return i;
        return indexes.length;
    }
}

//displays the current date
function getDate() {
    let today = new Date();
    return today.toISOString().split('T')[0];
}

/**
 * This functions opens or closes the category drop down menu
 */
function toggleCategory() {
    if (!menuOpenCategory) {
        openMenu('categories', 'dropDownCategory')
        renderCategories();
    } else {
        closeMenuCategories('categories');
    }
    menuOpenCategory = !menuOpenCategory;
}

/**
 * This functions opens or closes the contacts drop down menu to assign users to the task
 */
function toggleContacts() {
    if (!menuOpenContacts) {
        openMenu('contacts', 'dropDownContacts')
        renderContacts('contacts');
        markAlreadySelectedContacts();
        createFilterOption();
        setFocus('findContact');
        document.getElementById('initials').style.display = 'none';
    } else {
        closeMenuContacts('contacts');
    }
    menuOpenContacts = !menuOpenContacts;
}

/**
 * This function selects the users which are already assigned to the task
 */
function markAlreadySelectedContacts() {
    selectedContacts.forEach(cntct => {
        let cntctBox = document.getElementById(`cntcts${cntct}`);
        cntctBox.classList.add('background-darkblue');
        cntctBox.querySelector('input').checked = true;
    });
}

/**
 * 
 */
function createFilterOption() {
    let filterDiv = document.getElementById('dropDownContacts');
    filterDiv.innerHTML = filterDivHtml();
}

/**
 * This functions focuses on an input element with id=id after the last character
 * 
 * @param {string} id 
 */
function setFocus(id) {
    let elem = document.getElementById(id);
    let elemLen = elem.value.length;
    elem.selectionStart = elemLen;
    elem.selectionEnd = elemLen;
    elem.focus();
}

/**
 * 
 * @returns HTML-Code to filter contacts of the user
 */
function filterDivHtml() {
    return `
        <input type="text" id="findContact" placeholder="Search" autocomplete="off" onkeyup="filterContacts()" onclick="event.stopPropagation()">
        <img class="down_image" src="./assets/img/drop-down-arrow.png" style="transform: rotate(180deg)">
    `;
}

/**
 * This functions filters the contacts of one user
 */
function filterContacts() {
    let val = document.getElementById('findContact').value;
    for (let i = 0; i < userData.contacts.length; i++) {
        const usr = userData.contacts[i];
        if (valInUserName(val, usr.name)) {
            document.getElementById(`cntcts${usr.id}`).style = 'display: flex';
        } else {
            document.getElementById(`cntcts${usr.id}`).style = 'display: none';
        }
    };
}

/**
 * This function compares the search string with the name
 * 
 * @param {string} val 
 * @param {string} name 
 * @returns True if the string "val" can be found in the name
 */
function valInUserName(val, name) {
    return name.toLowerCase().includes(val.toLowerCase());
}

/**
 * This function opens the dropdown menu with the id's
 */
function openMenu(id1, id2) {
    removeBorder(id2)
    document.getElementById(id1).style.borderBottom = `1px solid #D1D1D1`;
    document.getElementById(id2).classList.add('drop_down_open');
    document.getElementById(id1).classList.add('scale-up-ver-top');
    setTimeout(removeAnimationClass, 200);
}

/**
 * This function removes the bottom border of an element
 * 
 * @param {string} id Id of an DOM-Element
 */
function removeBorder(id) {
    document.getElementById(id).style.borderBottom = `0`;
}

/**
 * This functions closes the category dropdown menu with animation
 * 
 * @param {string} id1 
 */
function closeMenuCategories(id1) {
    document.getElementById(id1).classList.add('scale-down-ver-top');
    setTimeout(closeCategories, 200);
}

/**
 * This functions closes the contacts dropdown menu with animation
 * 
 * @param {string} id1 
 */
function closeMenuContacts(id1) {
    document.getElementById(id1).classList.add('scale-down-ver-top');
    setTimeout(closeContacts, 200);
}

/**
 * This function removes the animation class of the dropdown menu's
 */
function removeAnimationClass() {
    document.getElementById(`categories`).classList.remove('scale-up-ver-top');
    document.getElementById(`contacts`).classList.remove('scale-up-ver-top');
}

/**
 * This function closes the category dropdown menu
 */
function closeCategories() {
    document.getElementById('categories').innerHTML = '';
    document.getElementById('dropDownCategory').style.borderBottom = `1px solid #D1D1D1`;
    document.getElementById('dropDownCategory').classList.remove('drop_down_open');
    document.getElementById('categories').style.borderBottom = `0`;
    document.getElementById(`categories`).classList.remove('scale-down-ver-top');
}

/**
 * This function closes the contacts dropdown menu
 */
function closeContacts() {
    document.getElementById('contacts').innerHTML = '';
    document.getElementById('dropDownContacts').style.borderBottom = `1px solid #D1D1D1`;
    document.getElementById('dropDownContacts').classList.remove('drop_down_open');
    document.getElementById('dropDownContacts').innerHTML = `
        Select contacts to assign
        <img class="down_image" src="./assets/img/drop-down-arrow.png">`;
    document.getElementById('contacts').style.borderBottom = `0`;
    document.getElementById(`contacts`).classList.remove('scale-down-ver-top');
    showInitialsFromAssignedContacts();
    document.getElementById('initials').style.display = 'flex';
}

/**
 * This functions displays the initials of the assigned users of the task
 */
function showInitialsFromAssignedContacts() {
    let divInitials = document.getElementById('initials');
    divInitials.innerHTML = '';
    selectedContacts.forEach(cntct => {
        if (cntct == -1) {
            divInitials.innerHTML += `<div class="contact-initials" style="background-color: ${userData.color}">${getInitialsFromName(userData.name)}</div>`;
        } else {
            divInitials.innerHTML += `<div class="contact-initials" style="background-color: ${getIndexOfArray(userData.contacts, cntct).color}">${getInitialsFromCntct(cntct)}</div>`;
        }
    });
}

function getInitialsFromCntct(cntct) {
    let name = getIndexOfArray(userData.contacts, cntct).name;
    return getInitialsFromName(name);
}

function renderCategories() {
    document.getElementById('categories').innerHTML = `<div class="render_categories" onclick="createNewCategory()">New category</div>`;
    for (let i = 0; i < categories.length; i++) {
        let category = categories[i][0];
        let clr = categories[i][1];
        renderCategoriesHTML(i, category, clr);
    }
}

function renderContacts(id) {
    userData.id = -1;
    userData.initials = getInitialsFromName(userData.name);
    renderContactsHTML(userData, userData.initials, id);
    for (let i = 0; i < userData.contacts.length; i++) {
        let contact = userData.contacts[i];
        let initials = getInitialsFromName(contact.name);
        renderContactsHTML(contact, initials, id);
    }
}

function createNewCategory() {
    selectedCategory = [];
    showCreateNewCategoryHTML();
    checkFormFilled();
}

function setColor(clr) {
    removeSelectedColors();
    selectedCategory[1] = clr;
    document.getElementById(clr).classList.add('selected');
}

function removeSelectedColors() {
    categoryColors.forEach(ctgryClr => {
        document.getElementById(ctgryClr).classList.remove('selected');
    });
}

/**
 * This functions marks or unmark a contact in the dropdown list
 * 
 * @param {String} id - This is the id of the contact which should be marked/unmarked
 */
function toggleSetContact(id) {
    let cntctBox = document.getElementById(`cntcts${id}`);
    if (contactAlreadySelected(id)) {
        cntctBox.classList.remove('background-darkblue');
        cntctBox.querySelector('input').checked = false;
        selectedContacts.splice(selectedContacts.indexOf(id), 1);
        checkFormFilled();
    } else {
        cntctBox.classList.add('background-darkblue');
        cntctBox.querySelector('input').checked = true;
        selectedContacts.push(id);
        checkFormFilled();
    }
}

function contactAlreadySelected(id) {
    return selectedContacts.includes(id);
}

function setPrio(prio) {
    document.getElementById('prio').style.borderColor = `#F6F7F8`;
    if (prio == currentPrio) removePrio();
    else {
        changePrio(prio);
    }
    checkFormFilled();
};

function removePrio() {
    document.getElementById('prioUrgent').classList.remove('prio_button_urgent');
    document.getElementById('prioMedium').classList.remove('prio_button_medium');
    document.getElementById('prioLow').classList.remove('prio_button_low');
    currentPrio = undefined;
};

function changePrio(prio) {
    removePrio();
    if (prio == 'urgent') {
        document.getElementById('prioUrgent').classList.add('prio_button_urgent');
        currentPrio = 'urgent';
    }
    if (prio == 'medium') {
        document.getElementById('prioMedium').classList.add('prio_button_medium');
        currentPrio = 'medium';
    }
    if (prio == 'low') {
        document.getElementById('prioLow').classList.add('prio_button_low');
        currentPrio = 'low';
    }
}

function addSubtask() {
    let inputSubtask = document.getElementById('taskSubtask');
    let valueSubtask = inputSubtask.value;
    if (valueSubtask) {
        subtasks.push(inputSubtask.value);
        subtaskStatus.push(false);
        renderSubtasksInAddTask();
    }
    inputSubtask.value = '';
}

function editSubtask(id, tsk) {
    let divId = document.getElementById(id);
    divId.innerHTML = htmlEditSubtask(tsk, id.slice(-1));
    setFocus(`changedSubtaskValue${id.slice(-1)}`);
}

function saveSubtask(id) {
    subtasks[id.slice(-1)] = document.getElementById(id).value;
    renderSubtasksInAddTask();
}

function deleteSubtask(id) {
    subtasks.splice(id.slice(-1), 1);
    subtaskStatus.splice(id.slice(-1), 1);
    renderSubtasksInAddTask();
}

/**
 * This function handles the clearing functionality in creating a new category
 * 
 * @param {string} id This parameter is the id of the input value for the category name
 */
function clearInputField(id) {
    if (noName()) {
        restoreCategorySelection();
    } else {
        document.getElementById(id).value = '';
    };
    selectedCategory = [];
    checkFormFilled();
}

/**
 * This function restores the category selection
 */
function restoreCategorySelection() {
    document.getElementById('categoryBox').innerHTML = restoreCategoriesHtml();
}

function noName() {
    return document.getElementById('categoryName').value == '';
}

async function addNewCategory() {
    selectedCategory[0] = document.getElementById('categoryName').value;
    if (selectedCategory[0].length < 1 || !selectedCategory[1]) {
        document.getElementById('reqCatTitleAndColor').style.color = 'red';
        document.getElementById('reqCatTitleAndColor').style.display = 'block';
    } else {
        await saveAndDisplayNewCategory();
    }
}

async function saveAndDisplayNewCategory() {
    categories.push([selectedCategory[0], selectedCategory[1]]);
    await setItem('categories', JSON.stringify(categories));
    showNewCreatedCategoryHtml();
    setCategory(selectedCategory[0], selectedCategory[1]);
    menuOpenCategory = false;
    checkFormFilled();
}

function setCategory(ctgry, clr) {
    toggleCategory();
    selectedCategory = [ctgry, clr];
    document.getElementById('dropDownCategory').innerHTML = `
        <div class="category-box">
            ${ctgry}
            <div  class="category-color" style="background-color: ${clr};"></div>
            <img class="down_image" src="assets/img/drop-down-arrow.png">
        </div>`;
    checkFormFilled();
}

function renderCategoriesHTML(i, cat, clr) {
    return document.getElementById('categories').innerHTML += `
        <div class="render_categories" id="ctgry${i}" onclick="setCategory('${cat}', '${clr}')">
            <div class="category-box">
                ${cat}
                <div class="category-color" style="background-color: ${clr};"></div>
            </div>
        </div>`;
}

function renderContactsHTML(con, ini, id) {
    return document.getElementById(id).innerHTML += `
        <div class="render_contacts" id="cntcts${con.id}" onclick="toggleSetContact('${con.id}')">
            <div class="contact-box">
                <div class="contact-initials" style="background-color: ${con.color}">${ini}</div>
                <div class="contact-name"">${con.name}${isLoggedInUser(con)}</div>
            </div>
            <label class="checkbox-container">
                <input type="checkbox">
                <span class="checkmark" onclick="toggleSetContact('${con.id}')"></span>
            </label> 
        </div>`;
}

function isLoggedInUser(usr) {
    if (usr.id == -1) return ' (You)';
    else return '';
}

function genHtmlInputTitle() {
    return `<div class="task-title">
                <label>Title</label>
                <input type="text" id="taskTitle" placeholder="Enter a title" required>
                <span id="reqTaskTitle">This field is required</span>
            </div>`;
}

function genHtmlInputDescription() {
    return `<div class="task-description">
                <label>Description</label>
                <textarea id="taskDescription" placeholder="Enter a Description" rows="4" required></textarea>
                <span id="reqTaskDescription">This field is required</span>
            </div>`;
}

function genHtmlInputCategory() {
    return `<div id="categoryBox" class="task-category">
                <label>Category</label>
                <div class="drop_down" id="dropDownCategory" onclick="toggleCategory()">
                    Select task category
                    <img class="down_image" src="./assets/img/drop-down-arrow.png">
                </div>
                <div id="categories" class="render_categories_box"></div>
                <span id="reqTaskDescription">This field is required</span>
            </div>`;
}

function genHtmlInputAssign() {
    return `<div id="contactBox" class="task-category">
                <label>Assigned to</label>
                <div class="drop_down" id="dropDownContacts" onclick="toggleContacts()">
                    Select contacts to assign
                    <img class="down_image" src="./assets/img/drop-down-arrow.png">
                </div>
                <div id="contacts" class="render_categories_box"></div>
                <div id="initials" class="initialsAssignedContacts"></div>
                <span id="reqTaskAssign">This field is required</span>
            </div>`;
}

function showCreateNewCategoryHTML() {
    return document.getElementById('categoryBox').innerHTML = `
        <label>Category</label>
        <div class="category-name-box">  
            <input type="text" placeholder="New category name" id="categoryName" required maxlength="29">
            <div class="confirm-category">
                <div onclick="clearInputField('categoryName')" class="delete-category">
                    <img src="./assets/img/x.svg" alt="">
                </div>
                <div class="confirm-border"></div>
                <div onclick="addNewCategory()">
                    <img class="verifyCategory" src="./assets/img/haken.png">
                </div>
            </div>
        </div>
        <div class="color-points">
            ${getCategoriesHtml()}
        </div>
        <span id="reqCatTitleAndColor">Please fill out name and select color!</span>
        `;
};

function getCategoriesHtml() {
    let htmlCategories = '';
    categoryColors.forEach(ctgry => {
        htmlCategories += `<div id="${ctgry}" class="color-point" onclick="setColor('${ctgry}')" style="background-color: ${ctgry};"></div>`;
    });
    return htmlCategories;
}

function showNewCreatedCategoryHtml() {
    document.getElementById('categoryBox').innerHTML = `
        <label>Category</label>
        <div class="drop_down" id="dropDownCategory" onclick="toggleCategory()">
            Select task category
            <img class="down_image" src="./assets/img/drop-down-arrow.png">
        </div>
        <div id="categories" class="render_categories_box"></div>
        <span id="reqTaskDescription">This field is required</span>`;
}

function restoreCategoriesHtml() {
    return `<label>Category</label>
            <div class="drop_down" id="dropDownCategory" onclick="toggleCategory()">
                Select task category
                <img class="down_image" src="./assets/img/drop-down-arrow.png">
            </div>
            <div id="categories" class="render_categories_box"></div>
            <span id="reqTaskDescription">This field is required</span>`;
}

function genHtmlInputDueDate() {
    return `<div class="task-due-date">
                <label>Due date</label>
                <input type="date" id="taskDate" onchange="checkFormFilled()" name="date" min="${getDate()}" required>
                <span id="reqTaskTitle">This field is required</span>
            </div>`;
}

function genHtmlInputPrio() {
    return `<div class="task-prio">
                <label>Prio</label>
                <div class="prio" id="prio">
                    <div class="prio_button" id="prioUrgent" onclick="setPrio('urgent')">
                        Urgent
                        <img src="assets/img/prioUrgent.png">
                    </div>
                    <div class="prio_button" id="prioMedium" onclick="setPrio('medium')">
                        Medium
                        <img src="assets/img/prioMedium.png">
                    </div>
                    <div class="prio_button" id="prioLow" onclick="setPrio('low')">
                        Low 
                        <img src="assets/img/prioLow.png">
                    </div>
                </div>
                <span id="reqTaskTitle">This field is required</span>
            </div>`;
}

function genHtmlInputSubtasks() {
    return `<div class="task-subtask">
                <label>Subtasks</label>
                <input type="text" id="taskSubtask" placeholder="Add new subtask">
                <img class="add-subtask-img" src="./assets/img/plus.svg" onclick="addSubtask()">
                <div class="subtasks" id="subtasks"></div>
            </div>`;
}

function renderSubtasksInAddTask() {
    let divSubtasks = document.getElementById('subtasks');
    divSubtasks.innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        const tsk = subtasks[i];
        divSubtasks.innerHTML += renderHtmlSubtask(tsk, i);
    }
}

function renderHtmlSubtask(tsk, i) {
    return `<div class="subtask" id="subtask${i}">
                <span>&#9899;</span>
                <div>${tsk}</div>
                <div class="change-subtask">
                    <div class="edit-subtask" onclick="editSubtask('subtask${i}', '${tsk}')">
                        <img src="./assets/img/edit.png">
                    </div> 
                    <div class="delete-subtask" onclick="deleteSubtask('subtask${i}')">
                        <img src="./assets/img/delete.png">
                    </div>      
                </div>
            </div>`;
}

function htmlEditSubtask(tsk, i) {
    return `<input class="edit-subtask-input" type="text" id="changedSubtaskValue${i}" value="${tsk}" required>
            <div class="change-subtask" style="top: 7px">
                <div class="edit-subtask" onclick="deleteSubtask('subtask${i}')">
                    <img src="./assets/img/delete.png">
                </div> 
                <div class="delete-subtask" onclick="saveSubtask('changedSubtaskValue${i}')">
                    <img src="./assets/img/checkmark.svg">
                </div>      
            </div>
    `;
}

function genHtmlInputSubmit() {
    return `<div class="submit-buttons">
                <button>
                    Clear
                    <img src="./assets/img/x.svg"> 
                </button>
                <button id="submitButton" type="button" disabled>
                    <input id="submitForm" type="submit" value="Create Task" disabled>
                    <img src="./assets/img/checkmark.svg"> 
                </button>
            </div>`;
}