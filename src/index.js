import "./styles.css";
import { compareAsc, format } from "date-fns";
import { addTodoButton, addProjectButton } from "./dom_manipulation.js";

const container = document.getElementById('container');
let handleBtnClick = (event) => {
    const buttonId = event.target.id; 
    container.replaceChildren();
    if (buttonId === "todo") {
        addTodoButton(container);
    } else if (buttonId === "project") {
        addProjectButton(container);
    } 
}
const buttons = document.querySelectorAll('.nav-buttons');
buttons.forEach(btn =>{
    btn.addEventListener('click', handleBtnClick)
});

document.addEventListener('DOMContentLoaded', () => {
    addTodoButton(container);
});
