/**
 * 
 * @param {string} tsk 
 * @param {number} i 
 * @returns HTML-Code for a single subtask
 */
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

/**
 * 
 * @param {string} tsk 
 * @param {number} i 
 * @returns HTML-Code for to edit the subtask
 */
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

/**
 * 
 * @returns HTML-Code for the task submit buttons
 */
function genHtmlInputSubmit() {
    return `<div class="submit-buttons">
                <button onclick="clearTask()">
                    Clear
                    <img src="./assets/img/x.svg"> 
                </button>
                <button id="submitButton" type="button" disabled>
                    <input id="submitForm" type="submit" value="Create Task" disabled>
                    <img src="./assets/img/checkmark.svg"> 
                </button>
            </div>`;
}

/**
 * This function renders the new created category
 */
function showNewCreatedCategoryHtml() {
    document.getElementById('categoryBox').innerHTML = `
        <label>Category</label>
        <div class="drop_down" id="dropDownCategory" onclick="toggleCategory()">
            Select task category
            <img class="down_image" src="./assets/img/drop-down-arrow.png">
        </div>
        <div id="categories" class="render_categories_box"></div>
        <span id="reqTaskCategory">This field is required</span>`;
}

/**
 * 
 * @returns HTML-Code for the task category
 */
function restoreCategoriesHtml() {
    return `<label>Category</label>
            <div class="drop_down" id="dropDownCategory" onclick="toggleCategory()">
                Select task category
                <img class="down_image" src="./assets/img/drop-down-arrow.png">
            </div>
            <div id="categories" class="render_categories_box"></div>
            <span id="reqTaskCategory">This field is required</span>`;
}

/**
 * 
 * @returns HTML-Code for the task due date
 */
function genHtmlInputDueDate() {
    return `<div class="task-due-date">
                <label>Due date</label>
                <input type="date" id="taskDate" onchange="checkFormFilled()" name="date" min="${getDate()}" required>
                <span id="reqTaskDate">This field is required</span>
            </div>`;
}

/**
 * 
 * @returns HTML-Code for the task prio
 */
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
                <span id="reqTaskPrio">This field is required</span>
            </div>`;
}

/**
 * 
 * @returns HTML-Code for the task subtasks
 */
function genHtmlInputSubtasks() {
    return `<div class="task-subtask">
                <label>Subtasks</label>
                <input type="text" id="taskSubtask" placeholder="Add new subtask">
                <img class="add-subtask-img" src="./assets/img/plus.svg" onclick="addSubtask()">
                <div class="subtasks" id="subtasks"></div>
            </div>`;
}

/**
 * 
 * @returns HTML-Code for the task title
 */
function genHtmlInputTitle() {
    return `<div class="task-title">
                <label>Title</label>
                <input type="text" id="taskTitle" placeholder="Enter a title" required>
                <span id="reqTaskTitle">This field is required</span>
            </div>`;
}

/**
 * 
 * @returns HTML-Code for the task description
 */
function genHtmlInputDescription() {
    return `<div class="task-description">
                <label>Description</label>
                <textarea id="taskDescription" placeholder="Enter a Description" rows="4" required></textarea>
                <span id="reqTaskDescription">This field is required</span>
            </div>`;
}

/**
 * 
 * @returns HTML-Code for the task category
 */
function genHtmlInputCategory() {
    return `<div id="categoryBox" class="task-category">
                <label>Category</label>
                <div class="drop_down" id="dropDownCategory" onclick="toggleCategory()">
                    Select task category
                    <img class="down_image" src="./assets/img/drop-down-arrow.png">
                </div>
                <div id="categories" class="render_categories_box"></div>
                <span id="reqTaskCategory">This field is required</span>
            </div>`;
}

/**
 * 
 * @returns HTML-Code for the task contacts to be assigned
 */
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

/**
 * 
 * @returns HTML-Code for the task to create a new category
 */
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

/**
 * 
 * @param {number} i 
 * @param {string} cat 
 * @param {string} clr 
 * @returns HTML-Code for selected category
 */
function renderCategoriesHTML(i, cat, clr) {
    return document.getElementById('categories').innerHTML += `
        <div class="render_categories" id="ctgry${i}" onclick="setCategory('${cat}', '${clr}')">
            <div class="category-box">
                ${cat}
                <div class="category-color" style="background-color: ${clr};"></div>
            </div>
        </div>`;
}

/**
 * 
 * @param {Object} con 
 * @param {string} ini 
 * @param {string} id 
 * @returns HTML-Code for single contact in dropdown menu
 */
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
 * 
 * @param {Object} usr 
 * @returns String ' (You)' if the user to be rendered is the current registered user
 */
function isLoggedInUser(usr) {
    if (usr.id == -1) return ' (You)';
    else return '';
}

/**
 * 
 * @returns HTML-Code for the single categories in dropdown category
 */
function getCategoriesHtml() {
    let htmlCategories = '';
    categoryColors.forEach(ctgry => {
        htmlCategories += `<div id="${ctgry}" class="color-point" onclick="setColor('${ctgry}')" style="background-color: ${ctgry};"></div>`;
    });
    return htmlCategories;
}

/**
 * This function renders the subtasks
 */
function renderSubtasksInAddTask() {
    let divSubtasks = document.getElementById('subtasks');
    divSubtasks.innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        const tsk = subtasks[i];
        divSubtasks.innerHTML += renderHtmlSubtask(tsk, i);
    }
}

/**
 * This function restores the category selection
 */
function restoreCategorySelection() {
    document.getElementById('categoryBox').innerHTML = restoreCategoriesHtml();
}

/**
 * This function toggles/changes the prio of the task
 * 
 * @param {string} prio 
 */
function setPrio(prio) {
    document.getElementById('prio').style.borderColor = `#F6F7F8`;
    if (prio == currentPrio) removePrio();
    else {
        changePrio(prio);
    }
    checkFormFilled();
};

/**
 * This function removes the current prio of the task
 */
function removePrio() {
    document.getElementById('prioUrgent').classList.remove('prio_button_urgent');
    document.getElementById('prioMedium').classList.remove('prio_button_medium');
    document.getElementById('prioLow').classList.remove('prio_button_low');
    currentPrio = undefined;
};

/**
 * This function changes the prio of the task
 * 
 * @param {string} prio 
 */
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