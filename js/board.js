let currentDraggedElement;
let editors;
let filteredTasks;
let currentPrioEditTask;
let openedTask;
let editContacts = [];
let selectedSubtasks = [];
let menuContactsOpen;

async function initBoard() {
    await loadData();
    displayInitialsFromCurrentUser();
    renderTasks(tasks);
}


//displays the current date
function getDateOverlay() {
    document.getElementById('dateOverlay').valueAsDate = new Date();
    date = document.getElementById('dateOverlay').value;
};


// load data from backend
async function loadData() {
    await loadTasks();
    await loadCategories();
    await getAllUsers();
}

function renderTasks(inputArray) {
    deleteTasksOnBoard();

    for (let i = 0; i < inputArray.length; i++) {
        const task = inputArray[i];
        renderSingleTask(task);
    }
}

/**
 * render card for single task
 * @param {string} taskStatus - Status / column of the task
 * @todo complete task
 */
function renderSingleTask(task) {
    let destination = document.getElementById(`${checkTaskStatus(task)}`);
    destination.innerHTML += `
        <div draggable="true" onclick="openTaskDetailView(${task['task-id']})" ondragstart="startDragging(${task['task-id']})" class="single-task" id="task${task['task-id']}">
            ${htmlTaskTopic(task)}
            ${htmlTaskTitle(task)}
            ${htmlTaskDescription(task)}
            ${htmlTaskSubtasks(task)}
            ${htmlTaskDivBottom(task)}
        </div>`;
}

/**
 * 
 * @returns html code for the topic of the task
 */
function htmlTaskTopic(task) {
    return `<div class="task-topic" style="background-color: ${task['category'][1]}">${task['category'][0]}</div>`;
}

function htmlTaskTitle(task) {
    return `<h4>${task['title']}</h4>`;
}

function htmlTaskDescription(task) {
    return `<div class="task-description-board">${task['description']}</div>`;
}

/**
 * 
 * @param {Array of JSON} task includes all information to render the task on board - it is loaded from the server
 * @returns html code for progress in subtasks
 * check first for available subtasks
 * task has property 'done' as array with booleans, if true, subtask is already done
 * filter(Boolean) returns only true values of array
 */
function htmlTaskSubtasks(task) {
    if (task['subtasks'].length == 0) return '<div class="task-subtasks"></div>';
    return `<div class="task-subtasks">
                <div class="task-subtasks-line">
                    <div class="progress" style="width: ${calcProgress(task)}%"></div>
                </div>
                <span>${task['done'].filter(Boolean).length}/${task['subtasks'].length} Done</span>
            </div>`;
}

/**
 * 
 * @param {Array of JSON} task includes all information to render the task on board - it is loaded from the server
 * @returns progress of subtasks in %
 */
function calcProgress(task) {
    return task['done'].filter(Boolean).length / task['subtasks'].length * 100;
}

function htmlTaskDivBottom(task) {
    return `<div class="task-bottom">
                ${htmlTaskEditors(task)}
                ${htmlTaskPrio(task)}
            </div>`;
}

/**
 * 
 * @param {Array of JSON} task includes all information to render the task on board - it is loaded from the server
 * @returns html code for the editors of the task 
 * 
 * all available editors are loaded from server and are stored global
 * get assigned contact id's from param task
 * get initials and color with contact id from global editors
 * if more than 2 editors, only show number of left over editors
 */
function htmlTaskEditors(task) {
    let htmlCodeTemp = '';
    selectedContacts = task['contacts'];
    for (let i = 0; i < selectedContacts.length; i++) {
        const editor = selectedContacts[i];
        if (editor == null) break; // exit for each loop when no editor is available - prevent error
        if (moreThan2Editors(i)) {
            htmlCodeTemp += htmlTaskLeftOverEditors(selectedContacts);
            break;
        }
        htmlCodeTemp += htmlTaskSingleEditor(editor);
    }
    return `<div class="editors">${htmlCodeTemp}</div>`;
}

function htmlTaskSingleEditor(editor) {
    return `<div class="contact-frame" style="background-color: ${getIndexOfArray(userData.contacts, editor).color}">
                ${getIndexOfArray(userData.contacts, editor).initials}
            </div>`;
}

function htmlTaskLeftOverEditors(editors) {
    return `<div class="contact-frame">
                +${editors.length - 2}
            </div>`;
}

function moreThan2Editors(i) {
    return i > 1;
}

function htmlTaskPrio(task) {
    return `<div class="task-prio">
                <img src="assets/img/prio${capitalizeFirstLetter(task['prio'])}.png">
            </div>`;
}

function openTaskDetailView(id) {
    editContacts.length = 0
    let task = tasks.find((e => e['task-id'] == id));
    openedTask = task;
    getTaskDataToLocal();
    renderTaskDetailView(task);
    document.body.classList.add('overflow-hidden');
    markDoneSubtasks();
}

/**
 * This function stores the subtask stati to global variables
 */
function getTaskDataToLocal() {
    subtaskStatus = openedTask.done;
    selectedSubtasks = [];
    for (let i = 0; i < openedTask.done.length; i++) {
        const subTaskStat = openedTask.done[i];
        if (subTaskStat) selectedSubtasks.push(`${i}`);
    }
}

function renderTaskDetailView(task) {
    let detailView = document.getElementById('taskDetailView');
    detailView.classList.remove('display-none');
    detailView.innerHTML = htmlTaskDetailView(task);
}

function htmlTaskDetailView(task) {
    return `
        <div class="content" onclick="noClose(event)">
            <div class="close">
                <img src="./assets/img/close.png" onclick="closeDetailView()">
            </div>
            <div id="content" class="task-details">
                <div class="category" style="background-color: ${task['category'][1]}">${task['category'][0]}</div>
                <div class="title">${task['title']}</div>
                <div>${task['description']}</div>
                <div class="date">
                    <b>Due date:</b>
                    <div>${task['date']}</div>
                </div>
                <div class="priority">
                    <b>Priority:</b>
                    <div class="prio-icon" style="background-color: ${getCategoryColor(task['prio'])}">
                        <div>${task['prio']}</div>
                        <img src="./assets/img/prio${capitalizeFirstLetter(task['prio'])}.png">
                    </div>
                </div>
                <div class="editors">
                    <b>Assigned To:</b>
                    ${htmlAllEditors(task)}
                </div>
                <div class="subtasks">
                    <b>Subtasks</b>
                    ${htmlSubtasks(task)}
                </div>
            </div>
            <div id="icons" class="icons">
                <div class="delete-button" onclick="deleteTask(${tasks.indexOf(task)})">
                    <img src="./assets/img/delete.png">
                    Delete
                </div>
                <div class="vertical-line"></div>
                <div class="edit-button" onclick="editTask(${tasks.indexOf(task)})">
                    <img src="./assets/img/edit.png">
                    Edit
                </div>
            </div>
        </div>
    `;
}

async function editTask(index) {
    edit_active = true;
    let content = document.getElementById('content');
    let icons = document.getElementById('icons');
    content.innerHTML = '';
    content.classList.remove('task-details');
    content.classList.add('edit-task');
    icons.innerHTML = htmlCheckIcon(index);
    content.innerHTML = htmlEditTask(tasks[index]);
    renderSubtasksInAddTask();
    setPrioInEditTask(tasks[index]);
    renderEditorsInitials();
    showInitialsOfAssignedContacts();
};

function pushEditorsToContacts() {
    editors.forEach(element => {
        editContacts.push(element);
    });
};

function renderEditorsInitials() {
    document.getElementById('initials').innerHTML = '';
    for (let i = 0; i < selectedContacts.length; i++) {
        let initial = getIndexOfArray(userData.contacts, selectedContacts[i]).initials;
        let bgrColor = getIndexOfArray(userData.contacts, selectedContacts[i]).color;
        document.getElementById('initials').innerHTML += `
        <div class="initials" style="background-color: ${bgrColor};">
            ${initial}
        </div>`;
    }
}

function setPrioInEditTask(task) {
    currentPrioEditTask = task['prio'];
    document.getElementById(`editPrio${capitalizeFirstLetter(currentPrioEditTask)}`).classList.add(`prio_button_${currentPrioEditTask}`);
}

function editPrio(prio) {
    document.getElementById(`editPrio${capitalizeFirstLetter(currentPrioEditTask)}`).classList.remove(`prio_button_${currentPrioEditTask}`);
    currentPrioEditTask = prio;
    document.getElementById(`editPrio${capitalizeFirstLetter(currentPrioEditTask)}`).classList.add(`prio_button_${currentPrioEditTask}`);
}

function htmlEditTask(task) {
    return `
            <div class="task-title">
                Title
                <input type="text" id="editTaskTitle" value="${task['title']}">
            </div>
            <div class="task-description">
                Description
                <textarea id="taskDescription" rows="5" required>${task['description']}</textarea>
            </div>
            <div class="task-due-date">
                Due date:
                <input type="date" id="editTaskDueDate" value="${task['date']}">
            </div>
            <div class="priority">
                Prio
                <div class="edit-prio-buttons">
                    <div class="prio_button" id="editPrioUrgent" onclick="editPrio('urgent')">
                        Urgent
                        <img src="./assets/img/prioUrgent.png">
                    </div>
                    <div class="prio_button" id="editPrioMedium" onclick="editPrio('medium')">
                        Medium
                        <img src="./assets/img/prioMedium.png">
                    </div>
                    <div class="prio_button" id="editPrioLow" onclick="editPrio('low')">
                        Low
                        <img src="./assets/img/prioLow.png">
                    </div>
                </div>
            </div>
            <div class="editors">
                Assigned to
                <div id="contactBox" class="task-category">
                    <div class="drop_down" id="dropDownEditContacts" onclick="openEditTaskContacts()">
                        Select contacts to assign
                        <img class="down_image" src="assets/img/drop-down-arrow.png">
                    </div>
                    <div id="editContacts" class="render_categories_box"></div>
                </div>
                <div id="initials" class="initials_box"></div>
            </div>
            ${genHtmlInputSubtasks()}
    `;
}

function htmlCheckIcon(index) {
    return `
        <div class="check-button" onclick="saveTask(${index})">
            OK
            <img src="./assets/img/checkmark-white.svg">
        </div>`;
}

async function saveTask(idx) {
    saveChangedDataLocal(idx);
    await setItem('tasks', JSON.stringify(tasks));
    document.getElementById('taskDetailView').classList.add('display-none');
    document.body.classList.remove('overflow-hidden');
    menuContactsOpen = false;
    await initBoard();
}

function saveChangedDataLocal(idx) {
    tasks[idx]['title'] = document.getElementById('editTaskTitle').value;
    tasks[idx]['description'] = document.getElementById('taskDescription').value;
    tasks[idx]['date'] = document.getElementById('editTaskDueDate').value;
    tasks[idx]['prio'] = currentPrioEditTask;
    tasks[idx]['contacts'] = selectedContacts;
}


async function deleteTask(index) {
    tasks.splice(index, 1);
    document.getElementById('taskDetailView').classList.add('display-none');
    await setItem('tasks', JSON.stringify(tasks));
    await initBoard();
}

function htmlAllEditors(task) {
    let htmlCodeTemp = '';
    selectedContacts = task['contacts'];
    for (let i = 0; i < selectedContacts.length; i++) {
        const id = selectedContacts[i];
        const editor = getIndexOfArray(userData.contacts, id);
        if (editor == null) break; // exit for each loop when no editor is available - prevent error
        htmlCodeTemp += htmlTaskSingleEditorDetail(editor);
    }
    return htmlCodeTemp;
}

function htmlTaskSingleEditorDetail(ed) {
    return `
        <div class="single-editor">
            <div class="ed-initials" style="background-color: ${ed['color']}">${ed['initials']}</div>
            <div>${ed['name']}</div>
        </div>
    `;
}

function getCategoryColor(prio) {
    if (prio == 'low') {
        return '#7AE229';
    } else if (prio == 'medium') {
        return '#FFA800';
    } else if (prio == 'urgent') {
        return '#FF3D00';
    } else {
        return '#000000';
    };
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function startDragging(id) {
    currentDraggedElement = id;
    markDraggableArea(`2px dotted #a8a8a8`);
}

function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * 
 * @param {String} status assign column in board - todo, progress, feedback, done
 * task-id != currentDraggedElement, therefore find Index of task in task with task-id
 */
async function moveTo(status) {
    let taskIndex = tasks.findIndex((task) => task['task-id'] == currentDraggedElement);
    tasks[taskIndex]['status'] = status;
    markDraggableArea(``);
    await setItem('tasks', JSON.stringify(tasks));
    renderTasks(tasks);
}

function deleteTasksOnBoard() {
    document.getElementById('tasks-todo').innerHTML = '';
    document.getElementById('tasks-progress').innerHTML = '';
    document.getElementById('tasks-feedback').innerHTML = '';
    document.getElementById('tasks-done').innerHTML = '';
}

/**
 * 
 * @param {Array of JSON} task includes all information to render the task on board - it is loaded from the server
 * @returns column where task has to be rendered
 * if no status is available, task is new and not started
 */
function checkTaskStatus(task) {
    if (task['status'] != null) {
        return `tasks-${task['status']}`;
    } else {
        return 'tasks-todo';
    }
}

function markDraggableArea(style) {
    let draggableArea = document.getElementsByClassName('task-body');
    for (let i = 0; i < draggableArea.length; i++) {
        const area = draggableArea[i];
        area.style.border = style;
    }
}

function overlayAddTask() {
    document.getElementById('overlayAddTask').classList.remove('display-none');
    document.getElementById('overlayAddTask').classList.add('overlay-add-task');
    // document.getElementById('mobileCreate').style.visibility = 'visible';
    document.body.classList.add('overflow-hidden');
    // renderOverlayAddTask();
    renderAddTask();
    getDateOverlay();
}

function closeOverlay() {
    clearAll();
    document.getElementById('overlayAddTask').classList.remove('overlay-add-task');
    document.getElementById('overlayAddTask').classList.add('display-none');
    document.body.classList.remove('overflow-hidden');
    document.getElementById('mobileCreate').style.visibility = 'hidden';
}

function closeDetailView() {
    editContacts = [];
    document.getElementById('taskDetailView').classList.add('display-none');
    document.body.classList.remove('overflow-hidden');
    menuContactsOpen = false;
    renderTasks(tasks);
    console.log(selectedSubtasks);
}

function noClose(event) {
    event.stopPropagation();
}

function filterTasks() {
    filteredTasks = [];
    let inputValue = document.getElementById('search-input').value;
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        if (inputValueIsInTask(inputValue, task)) filteredTasks.push(task);
    }
    renderTasks(filteredTasks);
}

function inputValueIsInTask(input, task) {
    return task['title'].toLowerCase().includes(input.toLowerCase()) || task['description'].toLowerCase().includes(input.toLowerCase());
}

function createTaskonBoard() {
    if (allFilled()) addTask();
    else showTasknotFull();
}

async function addTask() {
    closeMenu('contacts', 'dropDownContacts')
    showNotice('addBordBox');
    await fillTaskjJson();
    task = {};
    contacts = {};
    selectedContacts = {};
    clearAll();
    closeOverlay();
    initBoard();
}

function showTasknotFull() {
    if (!button_delay) {
        button_delay = true;
        if (!taskCategory) clearInputField();
        if (taskCategory) setCategory(taskCategory, color);
        if (enter_email) clearEmailField();
        closeMenu('contacts', 'dropDownContacts');
        showNotice('missing');
        checkWhichFieldIsEmpty();
        setTimeout(() => button_delay = false, 2500);
    }
}

function openEditTaskContacts() {
    if (!menuContactsOpen) {
        document.getElementById('editContacts').innerHTML = '';
        openAssignedToMenu('editContacts', 'dropDownEditContacts');
        menuContactsOpen = true;
        renderContacts('editContacts');
        markAssignedContacts();
    } else {
        closeMenu('editContacts', 'dropDownEditContacts');
        menuContactsOpen = false;
    }
}

/**
 * This function checks the already done subtasks
 */
function markDoneSubtasks() {
    for (let i = 0; i < openedTask.done.length; i++) {
        const subTask = openedTask.done[i];
        if (subTask) {
            let subtaskElem = document.getElementById(`subtask${i}`);
            subtaskElem.querySelector('input').checked = true;
        }
    }
}

function closeMenu() {
    document.getElementById('editContacts').innerHTML = '';
    document.getElementById('dropDownEditContacts').style.borderBottom = `1px solid #D1D1D1`;
    document.getElementById('dropDownEditContacts').classList.remove('drop_down_open');
    document.getElementById('dropDownEditContacts').innerHTML = `
        Select contacts to assign
        <img class="down_image" src="./assets/img/drop-down-arrow.png">`;
    document.getElementById('editContacts').style.borderBottom = `0`;
    document.getElementById(`editContacts`).classList.remove('scale-down-ver-top');
    showInitialsOfAssignedContacts();
    document.getElementById('initials').style.display = 'flex';
}

function markAssignedContacts() {
    selectedContacts.forEach(cntct => {
        let cntctBox = document.getElementById(`cntcts${cntct}`);
        cntctBox.classList.add('background-darkblue');
        cntctBox.querySelector('input').checked = true;
    });
}

function showInitialsOfAssignedContacts() {
    let divInitials = document.getElementById('initials');
    divInitials.innerHTML = '';
    selectedContacts.forEach(cntct => {
        if (cntct == -1) {
            divInitials.innerHTML += `<div class="contact-initials" style="background-color: ${userData.color}">${getInitialsFromName(userData.name)}</div>`;
        } else {
            divInitials.innerHTML += `<div class="contact-initials" style="background-color: ${getIndexOfArray(userData.contacts, cntct).color}">${getIndexOfArray(userData.contacts, cntct).initials}</div>`;
        }
    });
}

function openAssignedToMenu(id1, id2) {
    removeBorder(id2);
    document.getElementById(id1).style.borderBottom = `1px solid #D1D1D1`;
    document.getElementById(id2).classList.add('drop_down_open');
    document.getElementById(id1).classList.add('scale-up-ver-top');
    setTimeout(removeAnimationClassInBoard(), 200);
}

function removeAnimationClassInBoard() {
    document.getElementById(`editContacts`).classList.remove('scale-up-ver-top');
}

function renderEditContacts() {
    document.getElementById('editContacts').innerHTML = ``;
    document.getElementById('editContacts').innerHTML += `<div class="render_categorys" onclick="inviteContact()">Invite new contact</div>`;
    for (let i = 0; i < editContacts.length; i++) {
        let userId = editContacts[i];
        renderEditTaskContactsHTML(userId);
        if (selectedContacts.includes(editContacts[i])) {
            document.getElementById('Checkbox' + i).classList.add('custom_checkBox_child');
        }
    }
};

function renderEditTaskContactsHTML(id) {
    document.getElementById('editContacts').innerHTML += `
            <div class="render_categorys" onclick="editTaskSetContacts(${id})">
                ${getIndexOfArray(userData.contacts, id).name}  
                <div class="custom_checkBox">
                    <div id="Checkbox${id}"></div>
                </div>
            </div>`;
};

function editTaskSetContacts(i) {
    let index = selectedContacts.indexOf(editContacts[i]);
    if (index == -1) {
        document.getElementById('Checkbox' + i).classList.add('custom_checkBox_child');
        if (editContacts[i]['name'] == 'You') editContacts[i]['name'] = current_user;
        selectedContacts.push(editContacts[i]);
        renderEditorsInitials();
    } else {
        document.getElementById('Checkbox' + i).classList.remove('custom_checkBox_child');
        selectedContacts.splice(index, 1);
        renderEditorsInitials();
    }
};

function htmlSubtasks(task) {
    subtasks = task.subtasks;
    let htmlAllSubtasks = '';
    for (let i = 0; i < task['subtasks'].length; i++) {
        const subtask = task['subtasks'][i];
        htmlAllSubtasks += htmlSingleSubtaskDetail(subtask, i);
    }
    return htmlAllSubtasks;
}

function htmlSingleSubtaskDetail(text, i) {
    return `
        <div class="single-subtask" id="subtask${i}" onclick="toggleSetSubtask('subtask${i}')">
            <label class="checkbox-container">
                <input type="checkbox">
                <span class="checkmark" onclick="toggleSetSubtask('subtask${i}')"></span>
            </label>
            <div>${text}</div>
        </div>
    `;
}

function toggleSetSubtask(id) {
    let tempSubtask = document.getElementById(id);
    if (subtaskAlreadySelected(id)) {
        tempSubtask.querySelector('input').checked = false;
        selectedSubtasks.splice(selectedSubtasks.indexOf(id.slice(-1)), 1);
    } else {
        tempSubtask.querySelector('input').checked = true;
        selectedSubtasks.push(id.slice(-1));
    }
    saveDoneSubtasks();
    console.log(selectedSubtasks);
}

function subtaskAlreadySelected(id) {
    return selectedSubtasks.includes(id.slice(-1));
}

async function saveDoneSubtasks() {
    openedTask['done'].fill(false);
    selectedSubtasks.forEach(subT => {
        openedTask['done'][subT] = true;
    });
    await setItem('tasks', JSON.stringify(tasks));
    renderTasks(tasks);
}