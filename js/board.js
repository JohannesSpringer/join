let currentDraggedElement;
let editors;
let filteredTasks;
let currentPrioEditTask;
let openedTask;
let editContacts = [];
let selectedSubtasks = [];
let menuContactsOpen;

/**
 * This function initialize the board page
 */
async function initBoard() {
    await loadData();
    displayInitialsFromCurrentUser();
    renderTasks(tasks);
}

/**
 * This function displays the current date
 */
function getDateOverlay() {
    document.getElementById('taskDate').valueAsDate = new Date();
    date = document.getElementById('taskDate').value;
};

/**
 * This function load data from backend
 */
async function loadData() {
    await loadTasks();
    await loadCategories();
    await getAllUsers();
}

/**
 * This function renders all tasks on the board
 * 
 * @param {Array} inputArray 
 */
function renderTasks(inputArray) {
    deleteTasksOnBoard();
    for (let i = 0; i < inputArray.length; i++) {
        const task = inputArray[i];
        renderSingleTask(task);
    }
}

/**
 * 
 * @param {Array of JSON} task includes all information to render the task on board - it is loaded from the server
 * @returns progress of subtasks in %
 */
function calcProgress(task) {
    return task['done'].filter(Boolean).length / task['subtasks'].length * 100;
}

/**
 * This function shows the details of a task
 * 
 * @param {number} id 
 */
function openTaskDetailView(id) {
    document.getElementById('boardContent').classList.add('board-content-mobile');
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

/**
 * This function opens the task in edit mode
 * 
 * @param {number} index 
 */
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

/**
 * This function saves the editors globally
 */
function pushEditorsToContacts() {
    editors.forEach(element => {
        editContacts.push(element);
    });
};

/**
 * This function renders the initials of the editors
 */
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

/**
 * This function sets the prio in task edit mode
 * 
 * @param {Object} task 
 */
function setPrioInEditTask(task) {
    currentPrioEditTask = task['prio'];
    document.getElementById(`editPrio${capitalizeFirstLetter(currentPrioEditTask)}`).classList.add(`prio_button_${currentPrioEditTask}`);
}

/**
 * This function changes the prio in task edit mode
 * 
 * @param {string} prio 
 */
function editPrio(prio) {
    document.getElementById(`editPrio${capitalizeFirstLetter(currentPrioEditTask)}`).classList.remove(`prio_button_${currentPrioEditTask}`);
    currentPrioEditTask = prio;
    document.getElementById(`editPrio${capitalizeFirstLetter(currentPrioEditTask)}`).classList.add(`prio_button_${currentPrioEditTask}`);
}

/**
 * This function saves the task and show afterwards all tasks on board
 * 
 * @param {number} idx 
 */
async function saveTask(idx) {
    saveChangedDataLocal(idx);
    await setItem('tasks', JSON.stringify(tasks));
    document.getElementById('taskDetailView').classList.add('display-none');
    document.getElementById('boardContent').classList.remove('board-content-mobile');
    document.body.classList.remove('overflow-hidden');
    menuContactsOpen = false;
    await initBoard();
    subtasks = [];
}

/**
 * This function saves the task data globally
 * 
 * @param {number} idx 
 */
function saveChangedDataLocal(idx) {
    tasks[idx]['title'] = document.getElementById('editTaskTitle').value;
    tasks[idx]['description'] = document.getElementById('taskDescription').value;
    tasks[idx]['date'] = document.getElementById('editTaskDueDate').value;
    tasks[idx]['prio'] = currentPrioEditTask;
    tasks[idx]['contacts'] = selectedContacts;
}

/**
 * This function deletes the task with index
 * 
 * @param {number} index 
 */
async function deleteTask(index) {
    tasks.splice(index, 1);
    document.getElementById('taskDetailView').classList.add('display-none');
    document.body.classList.remove('overflow-hidden');
    await setItem('tasks', JSON.stringify(tasks));
    await initBoard();
}

/**
 * 
 * @param {string} prio 
 * @returns The color of the category
 */
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

/**
 * 
 * @param {string} str 
 * @returns Input string with the first letter capitalized
 */
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * This function starts the drag & drop mode for a task in board
 * 
 * @param {number} id 
 */
function startDragging(id) {
    currentDraggedElement = id;
    markDraggableArea(`2px dotted #a8a8a8`);
}

/**
 * This function allows to drop the task by event
 * 
 * @param {event} ev 
 */
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

/**
 * This functions deletes the HTML-Code for all tasks on board
 */
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

/**
 * This function highlights the draggable areas
 * 
 * @param {string} style String to style the border of the draggable area
 */
function markDraggableArea(style) {
    let draggableArea = document.getElementsByClassName('task-body');
    for (let i = 0; i < draggableArea.length; i++) {
        const area = draggableArea[i];
        area.style.border = style;
    }
}

/**
 * This functions displays the overlay to add a new task
 */
function overlayAddTask(state) {
    selectedContacts = [];
    subtasks = [];
    document.getElementById('addTaskInputsLeft').innerHTML = '';
    document.getElementById('addTaskInputsRight').innerHTML = '';
    document.documentElement.scrollTop = 0;
    document.getElementById('boardContent').classList.add('board-content-mobile');
    document.getElementById('overlayAddTask').classList.remove('display-none');
    document.getElementById('overlayAddTask').classList.add('overlay-add-task');
    document.body.classList.add('overflow-hidden');
    renderAddTask();
    getDateOverlay();
    document.getElementById('addTaskInputs').setAttribute("onsubmit", `addTask('${state}'); return false`);
}

/**
 * This functions hides the overlay to add a new task
 */
function closeOverlay() {
    clearAll();
    document.getElementById('overlayAddTask').classList.remove('overlay-add-task');
    document.getElementById('overlayAddTask').classList.add('display-none');
    document.getElementById('boardContent').classList.remove('board-content-mobile');
    document.getElementById('addTaskInputsLeft').innerHTML = '';
    document.getElementById('addTaskInputsRight').innerHTML = '';
    document.body.classList.remove('overflow-hidden');
    // document.getElementById('mobileCreate').style.visibility = 'hidden';
}

/**
 * This function closes the task detail view
 */
function closeDetailView() {
    editContacts = [];
    clearTask();
    document.getElementById('boardContent').classList.remove('board-content-mobile');
    document.getElementById('taskDetailView').classList.add('display-none');
    document.getElementById('taskDetailView').innerHTML = '';
    document.body.classList.remove('overflow-hidden');
    menuContactsOpen = false;
    renderTasks(tasks);
}

/**
 * This function stopps to execute onclick functions on specific DOM-elements
 * 
 * @param {event} event 
 */
function noClose(event) {
    event.stopPropagation();
}

/**
 * This function filters the task with the search input field
 */
function filterTasks() {
    filteredTasks = [];
    let inputValue = document.getElementById('search-input').value;
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        if (inputValueIsInTask(inputValue, task)) filteredTasks.push(task);
    }
    renderTasks(filteredTasks);
}

/**
 * This function selects the tasks which includes the search string
 * 
 * @param {string} input 
 * @param {object} task 
 * @returns If the search value (input) is in the task description or in the task title
 */
function inputValueIsInTask(input, task) {
    return task['title'].toLowerCase().includes(input.toLowerCase()) || task['description'].toLowerCase().includes(input.toLowerCase());
}

/**
 * This function opens the dropdown for the contacts of the user in task edit mode
 */
function openEditTaskContacts() {
    if (!menuContactsOpen) {
        document.getElementById('editContacts').innerHTML = '';
        openAssignedToMenu('editContacts', 'dropDownEditContacts');
        menuContactsOpen = true;
        renderContacts('editContacts');
        markAlreadySelectedContacts();
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

/**
 * This function closes the contact dropdown menu in task edit mode
 */
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

/**
 * This function opens the editors dropdown menu with animation
 * 
 * @param {string} id1 
 * @param {string} id2 
 */
function openAssignedToMenu(id1, id2) {
    removeBorder(id2);
    document.getElementById(id1).style.borderBottom = `1px solid #D1D1D1`;
    document.getElementById(id2).classList.add('drop_down_open');
    document.getElementById(id1).classList.add('scale-up-ver-top');
    setTimeout(removeAnimationClassInBoard(), 200);
}

/**
 * This function removes the animation class
 */
function removeAnimationClassInBoard() {
    document.getElementById(`editContacts`).classList.remove('scale-up-ver-top');
}

/**
 * This function toggles the checkboxes of the subtasks in detail view
 * 
 * @param {number} id 
 */
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
}

/**
 * 
 * @param {number} id 
 * @returns If the subtask is already selected
 */
function subtaskAlreadySelected(id) {
    return selectedSubtasks.includes(id.slice(-1));
}

/**
 * This functions saves the checked subtasks in backend
 */
async function saveDoneSubtasks() {
    openedTask['done'].fill(false);
    selectedSubtasks.forEach(subT => {
        openedTask['done'][subT] = true;
    });
    await setItem('tasks', JSON.stringify(tasks));
    renderTasks(tasks);
}

/**
 * This function clears the fields in a task
 */
function clearAll() {
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskSubtask').innerHTML = '';
    removePrio();
    clearContacts();
};

/**
 * deletes the selected contacts and closes the contacts menu if it's open
 */
function clearContacts() {
    if (menuContactsOpen) {
        closeMenu('contacts', 'dropDownContacts')
    }
};