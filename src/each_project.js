import { myProjects } from "./project";
import { myTasks, Task, StorageHandler } from "./todo.js";
import { TodoModal } from "./dom_manipulation.js";
import EditIcon from "../assets/edit.svg";
import DeleteIcon from "../assets/delete.svg";

const content = document.getElementById('content');
export let projectTasks = [];

export const HandleSingleProject = (() => {
    let currentProjectName = "";
    const getProjectDetails = (index, currentContext) => {
        const project = myProjects[index];
        if (project) {
            currentContext = project.projectName;
            currentProjectName = project.projectName;
            // call the getAllProjectTasks to get the projectName of the current card
            const projTasks = _getAllProjectTasks(currentContext).length;
            //console.log("inside _getProjectDetails",currentProjectName);
            return [currentContext, projTasks];
        }
        return null;
    }
    const _getAllProjectTasks = (projectName) => {
        projectTasks = myTasks.filter(task => task.assignedProject === projectName);
        return projectTasks;
    }
    const getCurrentProject = () => currentProjectName;
    const refreshProjectTasks = () => {
        if (currentProjectName) {
            _getAllProjectTasks(currentProjectName);
            SingleProjectCard.displayCard(currentProjectName);
        }
    }
    return{
        getProjectDetails,
        getCurrentProject,
        refreshProjectTasks
    }
})();

export const SingleProjectCard = (() => {
    const _createCard = (task, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-id', index);
        const taskName = document.createElement('p');
        const dueDate = document.createElement('p');
        const description = document.createElement('p');
        const assignedProject = document.createElement('p');
        const cardBtn = document.createElement('div')
        const editBtn = document.createElement('button');
        const deleteBtn = document.createElement('button');
        const editIcon = document.createElement('img');
        editIcon.src = EditIcon;
        editIcon.alt = "Edit";
        const deleteIcon = document.createElement('img');
        deleteIcon.src = DeleteIcon;
        deleteIcon.alt = "Delete";
        taskName.textContent = `${task.taskName}`;
        dueDate.textContent = `${task.dueDate}`;
        dueDate.classList.add('due-date')
        description.textContent = `${task.description}`;
        assignedProject.textContent = `${task.assignedProject}`
        cardBtn.classList.add('card-button');
        editBtn.appendChild(editIcon);
        editBtn.classList.add('edit-button');
        deleteBtn.appendChild(deleteIcon);
        deleteBtn.classList.add('delete-button');

        _handlePriority(task.priority, card);
        _handleEditBtn(editBtn, task, index)
        _handleDeleteBtn(deleteBtn, index);
        card.appendChild(taskName);
        card.appendChild(dueDate);
        card.appendChild(description);
        card.appendChild(assignedProject);
        cardBtn.appendChild(editBtn);
        cardBtn.appendChild(deleteBtn);
        card.appendChild(cardBtn);
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
            const taskToDelete = projectTasks[index];
            const mainTaskIndex = myTasks.findIndex(task =>
                task.taskName === taskToDelete.taskName &&
                task.assignedProject === taskToDelete.assignedProject
            );
            if (mainTaskIndex !== -1) {
                myTasks.splice(mainTaskIndex, 1)
            }
            projectTasks.splice(index, 1);
            StorageHandler.saveTask(); 
            SingleProjectStorageHandler.saveTask();
            const currentProject = HandleSingleProject.getCurrentProject();
            displayCard(currentProject); 
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
    const displayCard = (projName) => {
        content.replaceChildren();
        const currentTasks = myTasks.filter(task => task.assignedProject === projName);
        currentTasks.forEach((task, index) =>{
            _createCard(task, index);
        });
    }
    return{
        displayCard,
    }
})()

export const SingleProjectStorageHandler = (()=>{
    const saveTask = () =>{
        try {
            localStorage.setItem('myTasks', JSON.stringify(projectTasks));
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
                projectTasks = []; 
                
                tasksData.forEach(taskData => {
                    const task = new Task(
                        taskData.taskName,
                        taskData.description,
                        taskData.dueDate,
                        taskData.priority,
                        taskData.assignedProject
                    );
                    projectTasks.push(task);
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
