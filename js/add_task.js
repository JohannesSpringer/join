


//displays the current date
function getDate() {
    document.getElementById('date').valueAsDate = new Date();
    date = document.getElementById('date').value;
}

function renderAddTask() {
    document.getElementById('addTaskInputs').innerHTML += getInputTitle();
}

function getInputTitle() {
    return `<div class="task-title">
                Title
                <input type="text" id="taskTitle" placeholder="Enter a title" required>
                <span id="reqTaskTitle">This field is required</span>
            </div>`;
}