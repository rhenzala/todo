import "./styles.css";
import { handleBtnClick } from "./dom_manipulation.js";
import { createTodoPage } from "./todo.js"


const buttons = document.querySelectorAll('.nav-buttons');
buttons.forEach(btn =>{
    btn.addEventListener('click', handleBtnClick)
});

document.addEventListener('DOMContentLoaded', () => {
    createTodoPage();
});

