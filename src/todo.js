import { CreateAddButton, TodoModal } from "./dom_manipulation.js";


export const createTodoPage = () => {
    CreateAddButton.clearBtnContainer();
    CreateAddButton.todo();
    StorageHandler.loadTask();
    TodoCard.displayCard();
    const addTodoBtn = document.getElementById('addTodoBtn');
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
        StorageHandler.saveTask();
    }
}

const FormHandler = (() => {
    const form = document.getElementById('todoForm');
    const confirmBtn = document.getElementById('confirmTask');
    const submitForm = () => {
        const taskName = document.getElementById('taskName');
        const description = document.getElementById('description');
        const dueDate = document.getElementById('dueDate');
        const priority = document.getElementById('priority');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = todoForm.querySelectorAll('input[required], select[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('invalid');
                    let errorMsg = input.parentElement.querySelector('.error-message');
                    if (!errorMsg) {
                        errorMsg = document.createElement('span');
                        errorMsg.className = 'error-message';
                        input.parentElement.appendChild(errorMsg);
                    }
                    errorMsg.textContent = `Please enter ${input.id}`;
                } else {
                    input.classList.remove('invalid');
                    const errorMsg = input.parentElement.querySelector('.error-message');
                    if (errorMsg) errorMsg.remove();
                }
            });
            if (isValid) {
                const taskNameInput = taskName.value;
                const descInput = description.value;
                const dateInput = dueDate.value;
                const assignedProj = 'General';
                const priorityInput = priority.value;
                const newTask = new Task(taskNameInput, descInput, dateInput, assignedProj, priorityInput);
                newTask.addTask();

                TodoModal.closeTodoModal();
                TodoCard.displayCard();
                _clearForm();
            }
        });
        form.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('invalid');
                const errorMsg = this.parentElement.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            });
        });
    };
    const cancelInput = () => {
        const cancelBtn = document.getElementById('cancelTask');
        cancelBtn.addEventListener('click', ()=>{
            TodoModal.closeTodoModal();
            _clearForm();
        })
    }
    const _clearForm = () => {
        form.reset();
    }
    return{
        submitForm,
        cancelInput,
    };
})();

const TodoCard = (()=>{
    const content = document.getElementById('content');
    const _createCard = (task, index) => {
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
        editBtn.classList.add('edit-button');
        deleteBtn.textContent = "DELETE";
        deleteBtn.classList.add('delete-button')
        card.appendChild(taskName);
        card.appendChild(dueDate);
        card.appendChild(description);
        card.appendChild(assignedProject);
        card.appendChild(editBtn);
        card.appendChild(deleteBtn);
        content.appendChild(card);
    }
    const displayCard = () => {
        content.replaceChildren();
        myTasks.forEach((task, index) =>{
            _createCard(task, index);
        })
    }
    return{
        displayCard,
    }
})();

const StorageHandler = (()=>{
    const saveTask = () =>{
        try {
            localStorage.setItem('myTasks', JSON.stringify(myTasks));
            console.log('Tasks saved successfully');
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    }
    const loadTask = () => {
        try {
            const savedTasks = localStorage.getItem('myTasks');
            if (savedTasks) {
                // Parse saved tasks and recreate Task objects
                const tasksData = JSON.parse(savedTasks);
                myTasks = []; // Clear existing tasks
                
                tasksData.forEach(taskData => {
                    const task = new Task(
                        taskData.taskName,
                        taskData.description,
                        taskData.dueDate,
                        taskData.assignedProject,
                        taskData.priority
                    );
                    myTasks.push(task);
                });
                
                console.log('Tasks loaded successfully');
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    };

    return {
        saveTask,
        loadTask,
    };
})();

FormHandler.submitForm();
FormHandler.cancelInput();