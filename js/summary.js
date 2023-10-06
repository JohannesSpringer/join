let inProgessCount = 0;
let awaitFeedbackCount = 0;
let taskInBoard = 0;
let todoCount = 0;
let doneCount = 0;
let urgentCount = 0;
let current_user = {};
let user_name;
let dates = new Array;
let upcomingDeadline = '';

/**
 * This functions starts the initialization and checks the day time to greet the user dependend to the time
 */
function greet() {
    init();
    currentlyDate = new Date();
    curentlyHour = currentlyDate.getHours();
    if (curentlyHour >= 3 && curentlyHour < 12) document.getElementById('hallo').innerHTML = `Good Morning,`;
    if (curentlyHour >= 12 && curentlyHour < 18) document.getElementById('hallo').innerHTML = `Good afternoon,`;
    if (curentlyHour >= 18) document.getElementById('hallo').innerHTML = `Good evening,`;
    if (curentlyHour >= 0 && curentlyHour < 3) document.getElementById('hallo').innerHTML = `Good evening,`;
    document.getElementById('greetName').innerHTML = localStorage.getItem('currentUser');
};

/**
 * This function initialize the summary webpage
 */
async function init() {
    await loadTasks();
    user_name = current_user['name'];
    if (tasks !== null) {
        console.log(tasks);
        taskInBoard = tasks.length;
        tasks.forEach(task => {
            checkPrioAndDate(task);
            checkStatus(task.status);
        });
        dateDeadline(dates);
    }
    genHtmlToSite();
}

/**
 * This function counts the urgent priority tasks and push the task due date 
 * to the dates array
 * 
 * @param {*} task - This is the task object
 */
function checkPrioAndDate(task) {
    if (task.prio === 'urgent') {
        urgentCount++;
        dates.push(task.date);
    }
}

/**
 * This functions sorts the due dates of task with urgent priority.
 * The date in the nearest future stays in the dates array
 * 
 * @param {*} array 
 */
function dateDeadline(array) {
    let today = new Date();

    let nextDate = array
        .filter(function (datum) {
            // Wieso <= today ? sollte due date nicht in Zukunft liegen?
            return new Date(datum) <= today;
        })
        .sort(function (a, b) {
            return new Date(b) - new Date(a);
        })
        .shift();

    formatDate(nextDate);
}

/**
 * This function formats the due date to a string with format "DD.MM.YYYY"
 * 
 * @param {*} nextDate 
 */
function formatDate(nextDate) {
    let d = new Date(nextDate)
    let day = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    upcomingDeadline = day + "." + month + "." + year;
}

/**
 * This function increase the status count dependend of the tasks status
 * 
 * @param {string} status 
 */
function checkStatus(status) {
    switch (status) {
        case 'progress':
            inProgessCount++
            break;
        case 'feedback':
            awaitFeedbackCount++
            break;
        case 'todo':
            todoCount++
            break;
        case 'done':
            doneCount++
            break;
        default:
            break;
    }
}

// HTML Teil

function genHtmlToSite() {
    document.getElementById('overview').innerHTML = /*html */`
    
    <div class="summery_head">
            <div class="headline">Summary</div>
            <div class="nutshell">
                <span>Everything in a nutshell!</span>
            </div>
            <div class="seperator" style="display: none;"></div>
        </div>
        <div class="task">
            <a class="task_sub" onclick="goToBoard()">
                <span class="count">
                    ${taskInBoard}
                </span>
                <span class="status">
                    Tasks in <br>
                    Board
                </span>
            </a>
            <a class="task_sub" onclick="goToBoard()">
                <span class="count">
                    ${inProgessCount}
                </span>
                <span class="status">
                    Tasks in <br>
                    Progress
                </span>
            </a>
            <a class="task_sub" onclick="goToBoard()">
                <span class="count">
                    ${awaitFeedbackCount}
                </span>
                <span class="status">
                    Awaiting <br>
                    Feedback
                </span>
            </a>
        </div>
        <a class="prio_date" onclick="goToBoard()">
            <div class="prio_date_sub">
                <img src="assets/img/urgent.svg" alt="">
                <div class="todo">
                    <span class="count">
                        ${urgentCount}
                    </span>
                    <span class="status">
                        Urgent
                    </span>
                </div>
            </div>
            <div>
                <div class="todo">
                    <span class="datum">
                        ${upcomingDeadline}
                        <span class="status">Upcoming Deadline</span>
                    </span>
                    
                </div>
            </div>
        </a>
        <div class="todo_done">
            <a class="todo_done_sub" onclick="goToBoard()">
                <img src="assets/img/pencil.svg" alt="">
                <div class="todo">
                    <span class="count">
                        ${todoCount}
                    </span>
                    <span class="status">
                        To-do
                    </span>
                </div>
            </a>
            <a class="todo_done_sub" onclick="goToBoard()">
                <img src="assets/img/check.svg" alt="">
                <div class="todo">
                    <span class="count">
                        ${doneCount}
                    </span>
                    <span class="status">
                        Done
                    </span>
                </div>
            </a>
        </div>
    `;
}

