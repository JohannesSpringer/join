let menuOpen;
let categories = [];
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
    document.getElementById('reqTaskTitle').style.color = 'red';
}

//displays the current date
function getDate() {
    let today = new Date();
    return today.toISOString().split('T')[0];
}

function toggleCategory() {
    if (!menuOpen) {
        openMenu('categories', 'dropDownCategory')
        renderCategories();
    } else {
        closeMenuCategories('categories');
    }
    menuOpen = !menuOpen;
}

function toggleContacts() {
    if (!menuOpen) {
        openMenu('contacts', 'dropDownContacts')
        renderContacts();
        markAlreadySelectedContacts();
        createFilterOption();
        setFocus('findContact');
        document.getElementById('initials').style.display = 'none';
    } else {
        closeMenuContacts('contacts');
    }
    menuOpen = !menuOpen;
}

function markAlreadySelectedContacts() {
    selectedContacts.forEach(cntct => {
        let cntctBox = document.getElementById(cntct);
        cntctBox.classList.add('background-darkblue');
        cntctBox.querySelector('input').checked = true;
    });
}

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

function filterDivHtml() {
    return `
        <input type="text" id="findContact" placeholder="Search" autocomplete="off" onkeyup="filterContacts()" onclick="event.stopPropagation()">
        <img class="down_image" src="./assets/img/drop-down-arrow.png" style="transform: rotate(180deg)">
    `;
}

function filterContacts() {
    let val = document.getElementById('findContact').value;
    for (let i = 0; i < users.length; i++) {
        const usr = users[i].name;
        if (valInUserName(val, usr)) {
            document.getElementById(`cntcts${i}`).style = 'display: flex';
            console.log(val, ' + ', usr);
        } else {
            document.getElementById(`cntcts${i}`).style = 'display: none';
        }
    };
}

function valInUserName(val, name) {
    return name.toLowerCase().includes(val.toLowerCase());
}

function openMenu(id1, id2) {
    removeBorder(id2)
    document.getElementById(id1).style.borderBottom = `1px solid #D1D1D1`;
    document.getElementById(id2).classList.add('drop_down_open');
    document.getElementById(id1).classList.add('scale-up-ver-top');
    setTimeout(removeAnimationClass, 200);
}

function removeBorder(id) {
    document.getElementById(id).style.borderBottom = `0`;
}

function closeMenuCategories(id1) {
    document.getElementById(id1).classList.add('scale-down-ver-top');
    setTimeout(closeCategories, 200);
}

function closeMenuContacts(id1) {
    document.getElementById(id1).classList.add('scale-down-ver-top');
    setTimeout(closeContacts, 200);
}

function removeAnimationClass() {
    document.getElementById(`categories`).classList.remove('scale-up-ver-top');
    document.getElementById(`contacts`).classList.remove('scale-up-ver-top');
}

function closeCategories() {
    document.getElementById('categories').innerHTML = '';
    document.getElementById('dropDownCategory').style.borderBottom = `1px solid #D1D1D1`;
    document.getElementById('dropDownCategory').classList.remove('drop_down_open');
    document.getElementById('categories').style.borderBottom = `0`;
    document.getElementById(`categories`).classList.remove('scale-down-ver-top');
}

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

function showInitialsFromAssignedContacts() {
    let divInitials = document.getElementById('initials');
    divInitials.innerHTML = '';
    selectedContacts.forEach(cntct => {
        divInitials.innerHTML += `<div class="contact-initials" style="background-color: hsl(${getRandomColor()}, 50%, 50%)">${getInitialsFromCntct(cntct)}</div>`;
    });
}

function getInitialsFromCntct(cntct) {
    let name = users[cntct.slice(-1)].name;
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

function renderContacts() {
    for (let i = 0; i < users.length; i++) {
        let contact = users[i].name;
        let initials = getInitialsFromName(contact);
        renderContactsHTML(i, contact, initials);
    }
}

function createNewCategory() {
    selectedCategory[1] = '';
    showCreateNewCategoryHTML();
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

function toggleSetContact(id) {
    let cntctBox = document.getElementById(id);
    if (contactAlreadySelected(id)) {
        cntctBox.classList.remove('background-darkblue');
        cntctBox.querySelector('input').checked = false;
        selectedContacts.splice(selectedContacts.indexOf(id), 1);
    } else {
        cntctBox.classList.add('background-darkblue');
        cntctBox.querySelector('input').checked = true;
        selectedContacts.push(id);
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
        saveAndDisplayNewCategory();
    }
}

async function saveAndDisplayNewCategory() {
    categories.push([selectedCategory[0], selectedCategory[1]]);
    await setItem('categories', JSON.stringify(categories));
    showNewCreatedCategoryHtml();
    setCategory(selectedCategory[0], selectedCategory[1]);
    menuOpen = false;
}

function setCategory(ctgry, clr) {
    toggleCategory();
    document.getElementById('dropDownCategory').innerHTML = `
        <div class="category-box">
            ${ctgry}
            <div  class="category-color" style="background-color: ${clr};"></div>
            <img class="down_image" src="assets/img/drop-down-arrow.png">
        </div>`;
}

function renderCategoriesHTML(i, cat, clr) {
    return document.getElementById('categories').innerHTML += `
        <div class="render_categories" id="ctgry${i}" onclick="setCategory('${cat}', '${clr}')">
            <div class="category-box">
                ${cat}
                <div class="category-color" style="background-color: ${clr};"></div>
            </div>
        </div>`;
    // <img class="delete_image" src="assets/img/x.svg" onclick="deleteCategory(${i})">
}

function renderContactsHTML(i, con, ini) {
    return document.getElementById('contacts').innerHTML += `
        <div class="render_contacts" id="cntcts${i}" onclick="toggleSetContact('cntcts${i}')">
            <div class="contact-box">
                <div class="contact-initials" style="background-color: hsl(${getRandomColor()}, 50%, 50%)">${ini}</div>
                <div class="contact-name"">${con}</div>
            </div>
            <label class="checkbox-container">
                <input type="checkbox">
                <span class="checkmark" onclick="toggleSetContact('cntcts${i}')"></span>
            </label> 
        </div>`;
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

// todo: position absolute für dropdown, sodass andere Elemente nicht verschoben werden (ebene höher)
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
                <input type="date" id="taskDate" name="date" min="${getDate()}" required>
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
                <button>Clear</button>
                <input type="submit" value="Submit">
            </div>`;
}