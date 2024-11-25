import { addTodoButton, TodoModal } from "./dom_manipulation.js";


export const createTodoPage = () => {
    addTodoButton();
    const addTodoBtn = document.getElementById('addBtn');
    addTodoBtn.addEventListener('click', ()=>{
        TodoModal.showTodoModal();
        //console.log("here")
    })
}

let myTasks = [];

class Task {
    constructor(taskNameInput, descriptionInput, dateInput, assignedProject, priorityInput){
        this.taskName = taskNameInput;
        this.description = descriptionInput;
        this.dueDate = dateInput;
        this.assignedProject = assignedProject;
        this.priority = priorityInput;
    }
    addTask(){
        myTasks.push(this);
    }
}

const FormHandler = (() => {
    const submitInput = () => {
        const taskName = document.getElementById('taskName');
        const description = document.getElementById('description');
        const dueDate = document.getElementById('dueDate');
        const priority = document.getElementById('priority');
        const confirmBtn = document.getElementById('confirmTask');

        confirmBtn.addEventListener('click', (event)=>{
            event.preventDefault();
            const taskNameInput = taskName.value;
            const descInput = description.value;
            const dateInput = dueDate.value;
            const assignedProj = 'General';
            const priorityInput = priority.value;
            const newTask = new Task(taskNameInput, descInput, dateInput, assignedProj, priorityInput);
            newTask.addTask();
            console.log(myTasks);

            TodoModal.closeTodoModal();
            TodoCard.displayTodoCards();
            _clearForm();
            
        })
    }
    const cancelInput = () =>{
        const cancelBtn = document.getElementById('cancel');
        cancelBtn.addEventListener('click', ()=>{
            TodoModal.closeTodoModal();
            _clearForm();
        })
    }
    const _clearForm = () =>{
        const form = document.getElementById('todoForm');
        form.reset();
    }
    return{
        submitInput,
        cancelInput,
    }
})();

const TodoCard = (()=>{
    const content = document.getElementById('content');
    const _createTodoCards = (task, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-id', index);
        const taskName = document.createElement('p');
        const dueDate = document.createElement('p');
        const description = document.createElement('p');
        const assignedProject = document.createElement('p');
        const editBtn = document.createElement('button');
        const deleteBtn = document.createElement('button');
        taskName.textContent = `${task.taskName}`;
        dueDate.textContent = `${task.dueDate}`;
        description.textContent = `${task.description}`;
        assignedProject.textContent = `${task.assignedProject}`
        editBtn.textContent = "EDIT";
        deleteBtn.textContent = "DELETE";
        card.appendChild(taskName);
        card.appendChild(dueDate);
        card.appendChild(description);
        card.appendChild(assignedProject);
        card.appendChild(editBtn);
        card.appendChild(deleteBtn);
        content.appendChild(card);
    }
    const displayTodoCards = () => {
        content.replaceChildren();
        myTasks.forEach((task, index) =>{
            _createTodoCards(task, index);
        })
    }
    return{
        displayTodoCards,
    }
})();

FormHandler.submitInput();
FormHandler.cancelInput();