let menuOpen;
let categorys = {
    'category': [
        'Test1',
        'Test2'
    ]
}


//displays the current date
function getDate() {
    document.getElementById('date').valueAsDate = new Date();
    date = document.getElementById('date').value;
}

function openCategory() {
    if (!menuOpen) {
        openMenu('categorys', 'dropDown')
        renderCategorys();
    } else {
        closeMenu('categorys', 'dropDown');
    }
    menuOpen = !menuOpen;
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

function closeMenu(id1, id2) {
    document.getElementById(id1).classList.add('scale-down-ver-top');
    setTimeout(closeCategorys, 200);
}

function removeAnimationClass() {
    document.getElementById(`categorys`).classList.remove('scale-up-ver-top');
}

function closeCategorys() {
    document.getElementById('categorys').innerHTML = '';
    document.getElementById('dropDown').style.borderBottom = `1px solid #D1D1D1`;
    document.getElementById('dropDown').classList.remove('drop_down_open');
    document.getElementById('categorys').style.borderBottom = `0`;
    document.getElementById(`categorys`).classList.remove('scale-down-ver-top');
}

function renderCategorys() {
    document.getElementById('categorys').innerHTML = `<div class="render_categorys" onclick="inputCategory()">New category</div>`;
    for (let i = 0; i < categorys['category'].length; i++) {
        // let clr = categorys['color'][i];
        // let category = categorys['category'][i];
        renderCategorysHTML(i);
    }
}

function renderCategorysHTML(i) {
    return document.getElementById('categorys').innerHTML += `
        <div class="render_categorys" id="ctgry${i}">
            <div class="set_category" onclick="setCategory('test', '#EEAA00')">
                Test
                <div  class="color2" style="background-color: #EA0;"></div>
            </div>
            <img class="delete_image" src="assets/img/x.svg" onclick="deleteCategory(${i})">
        </div>`;
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
    return `<div id="categoryBox" class="task-category">
                Category
                <div class="drop_down" id="dropDown" onclick="openCategory()">
                    Select task category
                    <img class="down_image" src="assets/img/drop-down-arrow.png">
                </div>
                <div id="categorys" class="render_categorys_box"></div>
                <span id="reqTaskDescription">This field is required</span>
            </div>`;
}