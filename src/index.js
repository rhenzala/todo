import "./styles.css";
import { createTodoPage, handleBtnClick } from "./dom_manipulation.js";

const buttons = document.querySelectorAll('.nav-buttons');
buttons.forEach(btn =>{
    btn.addEventListener('click', handleBtnClick)
});

document.addEventListener('DOMContentLoaded', () => {
    createTodoPage();
});

