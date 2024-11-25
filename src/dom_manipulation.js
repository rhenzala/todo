import { createTodoPage } from "./todo.js";
let currentContext = "General"

 export const updatePageName = (name) =>{
    const pageName = document.getElementById('pageName');
    pageName.textContent = name;
}
const content = document.getElementById('content');
export const handleBtnClick = (event) => {
    const buttonId = event.target.id; 
    content.replaceChildren();
    if (buttonId === "todo") {
        createTodoPage();
        updatePageName("To-Dos")
    } else if (buttonId === "project") {
        addProjectButton();
        updatePageName("Projects")
        /**
        const addProjectBtn = document.getElementById('addBtn');
        addProjectBtn.addEventListener('click', ()=>{
            showProjectModal();
            //console.log("here")
        })
         */
        
    } 
}
export const addTodoButton = () =>{
    const addToDoBtn = document.getElementById('addBtn');
    addToDoBtn.textContent = "Add Task";
}
export const addProjectButton = () =>{
    const addProjectBtn = document.getElementById('addBtn');
    addProjectBtn.textContent = "Add Project";
}

export const TodoModal = (()=>{
    const addTodoModal = document.getElementById('addTodoModal')
    const showTodoModal = () =>{
        addTodoModal.showModal();
    }
    const closeTodoModal = () =>{
        addTodoModal.close();
    }
    return{
        showTodoModal,
        closeTodoModal,
    }
})();
export const showProjectModal = ()=>{
    const addProjectModal = document.getElementById('addProjectModal')
    addProjectModal.showModal();
}