import { HandleSingleProject, projectTasks, SingleProjectCard, SingleProjectStorageHandler } from "./each_project";
import { TodoModal } from "./dom_manipulation";

export let myTasks = [];
const pageName = document.getElementById('pageName').textContent;

export class Task {
    constructor(taskNameInput, descriptionInput, dateInput, priorityInput, assignedProject){
        this.taskName = taskNameInput;
        this.description = descriptionInput;
        this.dueDate = dateInput;
        this.priority = priorityInput;
        this.assignedProject = assignedProject || "General"; // if the todo is created within To-Dos page, assignedProject is General
    }
    addTask(){
        myTasks.push(this);
        StorageHandler.saveTask();
        if (pageName === "To-Dos"){
            TodoCard.displayCard();
        } else {
            SingleProjectCard.displayCard(this.assignedProject);
        }
    }
    updateDetails(newName, newDesc, newDueDate, newPriority) {
        this.taskName = newName;
        this.description = newDesc;
        this.dueDate = newDueDate;
        this.priority = newPriority;
        StorageHandler.saveTask();
        if (pageName === "To-Dos"){
            TodoCard.displayCard();
        } else {
            SingleProjectCard.displayCard(this.assignedProject);
        }
    }
}

export const TodoCard = (()=>{
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
        assignedProject.textContent = `${task.assignedProject}`;
        editBtn.textContent = "EDIT";
        editBtn.classList.add('edit-button');
        deleteBtn.textContent = "DELETE";
        deleteBtn.classList.add('delete-button');

        _handlePriority(task.priority, card);
        _handleEditBtn(editBtn, task, index)
        _handleDeleteBtn(deleteBtn, index);
        card.appendChild(taskName);
        card.appendChild(dueDate);
        card.appendChild(description);
        card.appendChild(assignedProject);
        card.appendChild(editBtn);
        card.appendChild(deleteBtn);
        content.appendChild(card);
    }
    const _handleEditBtn = (btn, task, index) => {
        btn.addEventListener('click', () => {
            TodoModal.showEdit(task);
            const editForm = document.getElementById('editTodoForm');
            editForm.setAttribute('data-task-index', index);
        });
    }
    const _handleDeleteBtn = (btn, index) => {
        btn.addEventListener('click', () => {
            myTasks.splice(index, 1);
            projectTasks.splice(index, 1);
            StorageHandler.saveTask(); 
            SingleProjectStorageHandler.saveTask();
            displayCard(); 
        });
    }
    const _handlePriority = (priority, card) => {
        if (priority === "high") {
            card.id = "highPriority";
        } else if (priority === "medium"){
            card.id = "mediumPriority";
        } else if (priority === "low"){
            card.id = "lowPriority";
        }
    }
    const displayCard = () => {
        content.replaceChildren();
        myTasks.forEach((task, index) =>{
            _createCard(task, index);
        })
    }
    return{
        displayCard
    }
})();

export const StorageHandler = (()=>{
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
                const tasksData = JSON.parse(savedTasks);
                myTasks = []; 
                
                tasksData.forEach(taskData => {
                    const task = new Task(
                        taskData.taskName,
                        taskData.description,
                        taskData.dueDate,
                        taskData.priority,
                        taskData.assignedProject
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
