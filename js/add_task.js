let menuOpen;
let categorys = {
    'category': [
        'Test1',
        'Test2'
    ],
    'color': [
        '#EEAA00',
        '#FF0000'
    ]
};
let categoryColors = [
    '#8AA4FF',
    '#FF0000',
    '#2AD300',
    '#FF8A00',
    '#E200BE',
    '#0038FF'
]

//displays the current date
function getDate() {
    document.getElementById('date').valueAsDate = new Date();
    date = document.getElementById('date').value;
}

function toggleCategory() {
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
    document.getElementById('categorys').innerHTML = `<div class="render_categorys" onclick="createNewCategory()">New category</div>`;
    for (let i = 0; i < categorys['category'].length; i++) {
        let clr = categorys['color'][i];
        let category = categorys['category'][i];
        renderCategorysHTML(i, category, clr);
    }
}

function createNewCategory() {
    showCreateNewCategoryHTML();
}

function setColor(clr) {
    removeSelectedColors();
    document.getElementById(clr).classList.add('selected');
}

function removeSelectedColors() {
    categoryColors.forEach(ctgryClr => {
        document.getElementById(ctgryClr).classList.remove('selected');
    });
}

function setCategory(ctgry, clr) {
    toggleCategory();
    document.getElementById('dropDown').innerHTML = `
        <div class="category-box">
            ${ctgry}
            <div  class="category-color" style="background-color: ${clr};"></div>
            <img class="down_image" src="assets/img/drop-down-arrow.png">
        </div>`;
}

function renderCategorysHTML(i, cat, clr) {
    return document.getElementById('categorys').innerHTML += `
        <div class="render_categorys" id="ctgry${i}" onclick="setCategory('${cat}', '${clr}')">
            <div class="category-box">
                ${cat}
                <div  class="category-color" style="background-color: ${clr};"></div>
            </div>
        </div>`;
        // <img class="delete_image" src="assets/img/x.svg" onclick="deleteCategory(${i})">
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
                <div class="drop_down" id="dropDown" onclick="toggleCategory()">
                    Select task category
                    <img class="down_image" src="assets/img/drop-down-arrow.png">
                </div>
                <div id="categorys" class="render_categorys_box"></div>
                <span id="reqTaskDescription">This field is required</span>
            </div>`;
}

function showCreateNewCategoryHTML() {
    return document.getElementById('categoryBox').innerHTML = `
        Category
        <div class="category-name-box">  
            <input type="text" placeholder="New category name" id="categoryName" required maxlength="29">
            <div class="confirm-category">
                <div onclick="clearInputField()" class="delete-category">
                    <img src="./assets/img/x.svg" alt="">
                </div>
                <div class="confirm-border"></div>
                <div onclick="addNewCategory()">
                    <img class="verifyCategory" src="./assets/img/haken.png">
                </div>
            </div>
        </div>
        <div class="color-points">
            <div id="#8AA4FF" class="color-point" onclick="setColor('#8AA4FF')" style="background-color: #8AA4FF;"></div>
            <div id="#FF0000" class="color-point" onclick="setColor('#FF0000')" style="background-color: #FF0000;"></div>
            <div id="#2AD300" class="color-point" onclick="setColor('#2AD300')" style="background-color: #2AD300;"></div>
            <div id="#FF8A00" class="color-point" onclick="setColor('#FF8A00')" style="background-color: #FF8A00;"></div>
            <div id="#E200BE" class="color-point" onclick="setColor('#E200BE')" style="background-color: #E200BE;"></div>
            <div id="#0038FF" class="color-point" onclick="setColor('#0038FF')" style="background-color: #0038FF;"></div>
        </div>`;
};