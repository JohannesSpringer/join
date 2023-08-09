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

//displays the current date
function getDate() {
    document.getElementById('date').valueAsDate = new Date();
    date = document.getElementById('date').value;
}

function toggleCategory() {
    if (!menuOpen) {
        openMenu('categories', 'dropDown')
        renderCategories();
    } else {
        closeMenu('categories', 'dropDown');
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
    setTimeout(closeCategories, 200);
}

function removeAnimationClass() {
    document.getElementById(`categories`).classList.remove('scale-up-ver-top');
}

function closeCategories() {
    document.getElementById('categories').innerHTML = '';
    document.getElementById('dropDown').style.borderBottom = `1px solid #D1D1D1`;
    document.getElementById('dropDown').classList.remove('drop_down_open');
    document.getElementById('categories').style.borderBottom = `0`;
    document.getElementById(`categories`).classList.remove('scale-down-ver-top');
}

function renderCategories() {
    document.getElementById('categories').innerHTML = `<div class="render_categories" onclick="createNewCategory()">New category</div>`;
    for (let i = 0; i < categories.length; i++) {
        let category = categories[i][0];
        let clr = categories[i][1];
        renderCategoriesHTML(i, category, clr);
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
        categories.push([selectedCategory[0], selectedCategory[1]]);
        await setItem('categories', JSON.stringify(categories));
        showNewCreatedCategoryHtml();
        setCategory(selectedCategory[0], selectedCategory[1]);
        menuOpen = false;
    }
};

function setCategory(ctgry, clr) {
    toggleCategory();
    document.getElementById('dropDown').innerHTML = `
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
                    <img class="down_image" src="./assets/img/drop-down-arrow.png">
                </div>
                <div id="categories" class="render_categories_box"></div>
                <span id="reqTaskDescription">This field is required</span>
            </div>`;
}

function showCreateNewCategoryHTML() {
    return document.getElementById('categoryBox').innerHTML = `
        Category
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
        Category
        <div class="drop_down" id="dropDown" onclick="toggleCategory()">
            Select task category
            <img class="down_image" src="./assets/img/drop-down-arrow.png">
        </div>
        <div id="categories" class="render_categories_box"></div>
        <span id="reqTaskDescription">This field is required</span>`;
}

function restoreCategoriesHtml() {
    return `
            Category
            <div class="drop_down" id="dropDown" onclick="toggleCategory()">
                Select task category
                <img class="down_image" src="./assets/img/drop-down-arrow.png">
            </div>
            <div id="categories" class="render_categories_box"></div>
            <span id="reqTaskDescription">This field is required</span>`;
}