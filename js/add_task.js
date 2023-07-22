


//displays the current date
function getDate() {
    document.getElementById('date').valueAsDate = new Date();
    date = document.getElementById('date').value;
}

function renderAddTask() {
    document.getElementById('addTaskInputsLeft').innerHTML += genHtmlInputTitle();
    document.getElementById('addTaskInputsLeft').innerHTML += genHtmlInputDescription();
    document.getElementById('addTaskInputsLeft').innerHTML += genHtmlInputCategory();
    document.getElementById('reqTaskTitle').style.color = 'red';
}

function genHtmlInputTitle() {
    return `<div class="task-title">
                Title
                <input type="text" id="taskTitle" placeholder="Enter a title" required>
                <span id="reqTaskTitle">This field is required</span>
            </div>`;
}

function genHtmlInputDescription() {
    return `<div class="task-description">
                Description
                <textarea id="taskDescription" placeholder="Enter a Description" rows="4" required></textarea>
                <span id="reqTaskDescription">This field is required</span>
            </div>`;
}

function genHtmlInputCategory() {
    return `<div class="task-category">
                Category
                <select id="taskCategory" required>
                    <option value="def">default</option>
                    ${getHtmlCategoryOptions()}
                </select>
                <span id="reqTaskCategory">This field is required</span>
            </div>`;
}

function getHtmlCategoryOptions() {
    return `<option value="1">1</option>
            <option value="2">2</option>
    `;
}