/**
 * This function renders a card for single task
 * 
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
 * @returns HTML-Code for the topic of the task
 */
function htmlTaskTopic(task) {
    return `<div class="task-topic" style="background-color: ${task['category'][1]}">${task['category'][0]}</div>`;
}
 /**
  * 
  * @param {Object} task 
  * @returns HTML-Code for the title of the task
  */
function htmlTaskTitle(task) {
    return `<h4>${task['title']}</h4>`;
}

/**
 * 
 * @param {Object} task 
 * @returns HTML-Code for the description of the task
 */
function htmlTaskDescription(task) {
    return `<div class="task-description-board">${task['description']}</div>`;
}

/**
 * 
 * @param {Array of JSON} task includes all information to render the task on board - it is loaded from the server
 * @returns HTML-Code for progress in subtasks
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
 * @param {Object} task 
 * @returns HTML-Code for the editors and prio in the task card
 */
function htmlTaskDivBottom(task) {
    return `<div class="task-bottom">
                ${htmlTaskEditors(task)}
                ${htmlTaskPrio(task)}
            </div>`;
}

/**
 * 
 * @param {Array of JSON} task includes all information to render the task on board - it is loaded from the server
 * @returns HTML-Code for the editors of the task 
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

/**
 * 
 * @param {Object} editor 
 * @returns HTML-Code for single editor
 */
function htmlTaskSingleEditor(editor) {
    return `<div class="contact-frame" style="background-color: ${getIndexOfArray(userData.contacts, editor).color}">
                ${getIndexOfArray(userData.contacts, editor).initials}
            </div>`;
}

/**
 * 
 * @param {*} editors 
 * @returns HTML-Code if more than 2 editors are assigned
 */
function htmlTaskLeftOverEditors(editors) {
    return `<div class="contact-frame">
                +${editors.length - 2}
            </div>`;
}

/**
 * 
 * @param {number} i 
 * @returns If i is bigger than 1
 */
function moreThan2Editors(i) {
    return i > 1;
}

/**
 * 
 * @param {Object} task 
 * @returns HTML-Code for the prio buttons
 */
function htmlTaskPrio(task) {
    return `<div class="task-prio">
                <img src="assets/img/prio${capitalizeFirstLetter(task['prio'])}.png">
            </div>`;
}

/**
 * This function renders the detail view
 * 
 * @param {Object} task 
 */
function renderTaskDetailView(task) {
    let detailView = document.getElementById('taskDetailView');
    detailView.classList.remove('display-none');
    detailView.innerHTML = htmlTaskDetailView(task);
}

/**
 * 
 * @param {Object} task 
 * @returns HTML-Code of task detail view
 */
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

/**
 * 
 * @param {Object} task 
 * @returns HTML-Code of task edit mode
 */
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

/**
 * 
 * @param {number} index 
 * @returns HTML-Code for the OK-button in task edit mode
 */
function htmlCheckIcon(index) {
    return `
        <div class="check-button" onclick="saveTask(${index})">
            OK
            <img src="./assets/img/checkmark-white.svg">
        </div>`;
}

/**
 * 
 * @param {Object} task 
 * @returns HTML-Code for editors
 */
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

/**
 * 
 * @param {Object} ed 
 * @returns HTML-Code for the editors in task detail view
 */
function htmlTaskSingleEditorDetail(ed) {
    return `
        <div class="single-editor">
            <div class="ed-initials" style="background-color: ${ed['color']}">${ed['initials']}</div>
            <div>${ed['name']}</div>
        </div>
    `;
}

/**
 * This function shows the initials of the assigned contacts
 */
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

/**
 * 
 * @param {Object} task 
 * @returns HTML-Code for the subtasks
 */
function htmlSubtasks(task) {
    subtasks = task.subtasks;
    let htmlAllSubtasks = '';
    for (let i = 0; i < task['subtasks'].length; i++) {
        const subtask = task['subtasks'][i];
        htmlAllSubtasks += htmlSingleSubtaskDetail(subtask, i);
    }
    return htmlAllSubtasks;
}

/**
 * 
 * @param {string} text 
 * @param {number} i 
 * @returns HTML-Code for one subtask
 */
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