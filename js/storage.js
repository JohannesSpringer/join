const STORAGE_TOKEN = 'QWZOCGSV6K3Y2SNGVOCH6JKW5RFFUVXXFMQ602W8';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

let users = [];
let tasks = [];

/**
 * This function saves an item to the backend database
 * 
 * @param {string} key - This is the key of the item to be stored
 * @param {string} value - This is the value of the item to be stored
 * @returns Promise
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return await fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

/**
 * This function loads an item from the backend database
 * 
 * @param {string} key - This is the key of the item to be loaded
 * @returns payload of item
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        // Verbesserter code
        if (res.data) {
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}

/**
 * This function loads the users from backend
 * 
 */
async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**
 * This function loads the tasks from backend
 * 
 */
async function loadTasks() {
    try {
        tasks = JSON.parse(await getItem('tasks'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}