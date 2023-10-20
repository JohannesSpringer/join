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
    getDateOverlay();
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
            if (elem.value == '') {
                formIsFilled = false;
                setStyleOfReqField(elem, 'red');
            }
            else {
                setStyleOfReqField(elem, '#F6F7F8');
            }
        });
        if ((selectedContacts.length == 0) || !currentPrio || selectedCategory.length == 0) {
            formIsFilled = false;
        }
        toggleRequiredFields();
        toggleSubmitButton();
    } catch (e) {
        if (!e instanceof TypeError) throw e;
    }
}

/**
 * This functions toggles the required fields for assigned contacts, prio and category
 */
function toggleRequiredFields() {
    if (selectedContacts.length == 0) document.getElementById('reqTaskAssign').style.color = 'red'
    else document.getElementById('reqTaskAssign').style.color = '#F6F7F8';
    if (!currentPrio) document.getElementById('reqTaskPrio').style.color = 'red'
    else document.getElementById('reqTaskPrio').style.color = '#F6F7F8';
    if (selectedCategory.length == 0) document.getElementById('reqTaskCategory').style.color = 'red'
    else document.getElementById('reqTaskCategory').style.color = '#F6F7F8';
}

/**
 * This function sets the color of the required field
 * 
 * @param {Object} elem DOM-Element of the input field
 * @param {string} clr Color for the text
 */
function setStyleOfReqField(elem, clr) {
    elem.parentNode.querySelector('span').style.color = clr;
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
async function addTask(state) {
    let newTask = getNewTaskData(state);
    tasks.push(newTask);
    await setItem('tasks', JSON.stringify(tasks));
    goToPage('board');
}

/**
 * This function creates the JSON format of the new task
 * @returns Data of the new task in JSON format
 */
function getNewTaskData(state) {
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
        'status': state
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

/**
 * This functions returns the initials of the users contact id
 * 
 * @param {number} cntct 
 * @returns Initials as 2 letters
 */
function getInitialsFromCntct(cntct) {
    let name = getIndexOfArray(userData.contacts, cntct).name;
    return getInitialsFromName(name);
}

/**
 * This function renders the dropdown category with all availabe categories
 */
function renderCategories() {
    document.getElementById('categories').innerHTML = `<div class="render_categories" onclick="createNewCategory()">New category</div>`;
    for (let i = 0; i < categories.length; i++) {
        let category = categories[i][0];
        let clr = categories[i][1];
        renderCategoriesHTML(i, category, clr);
    }
}

/**
 * This funtion renders the dropdown for contacts to be assigned to the task
 * 
 * @param {number} id 
 */
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

/**
 * This function creates a new category
 */
function createNewCategory() {
    selectedCategory = [];
    showCreateNewCategoryHTML();
    checkFormFilled();
}

/**
 * This function selects the color of the new category
 * 
 * @param {string} clr Color in Format '#00AAFF'
 */
function setColor(clr) {
    removeSelectedColors();
    selectedCategory[1] = clr;
    document.getElementById(clr).classList.add('selected');
}

/**
 * This function removes the highlight of the category color
 */
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

/**
 * 
 * @param {number} id 
 * @returns If the contact of user is already assigned to the task
 */
function contactAlreadySelected(id) {
    return selectedContacts.includes(id);
}

/**
 * This function adds a subtask to the current task
 */
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

/**
 * This function displays the edit function for a subtask
 * 
 * @param {string} id DOM-element id of the subtask
 * @param {string} tsk Id of the task
 */
function editSubtask(id, tsk) {
    let divId = document.getElementById(id);
    divId.innerHTML = htmlEditSubtask(tsk, id.slice(-1));
    setFocus(`changedSubtaskValue${id.slice(-1)}`);
}

/**
 * This function saves the subtask in the backend
 * 
 * @param {string} id DOM-element id of the subtask
 */
function saveSubtask(id) {
    subtasks[id.slice(-1)] = document.getElementById(id).value;
    renderSubtasksInAddTask();
}

/**
 * This function deletes the subtask from the backend
 * 
 * @param {string} id DOM-element id of the subtask
 */
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
 * 
 * @returns If the category has no value
 */
function noName() {
    return document.getElementById('categoryName').value == '';
}

/**
 * This functions adds a new category when all required fields are filled
 */
async function addNewCategory() {
    selectedCategory[0] = document.getElementById('categoryName').value;
    if (selectedCategory[0].length < 1 || !selectedCategory[1]) {
        document.getElementById('reqCatTitleAndColor').style.color = 'red';
        document.getElementById('reqCatTitleAndColor').style.display = 'block';
    } else {
        await saveAndDisplayNewCategory();
    }
}

/**
 * This function saves the new category
 */
async function saveAndDisplayNewCategory() {
    categories.push([selectedCategory[0], selectedCategory[1]]);
    await setItem('categories', JSON.stringify(categories));
    showNewCreatedCategoryHtml();
    setCategory(selectedCategory[0], selectedCategory[1]);
    menuOpenCategory = false;
    checkFormFilled();
}

/**
 * This function selects the category of the dropdown
 * 
 * @param {string} ctgry 
 * @param {string} clr 
 */
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

/**
 * This function clears the task form
 */
function clearTask() {
    subtasks = [];
    document.getElementById('addTaskInputsLeft').innerHTML = '';
    document.getElementById('addTaskInputsRight').innerHTML = '';
    renderAddTask();
}