import { Task, TodoCard, StorageHandler } from "./todo.js";
import { myProjects, Project, ProjectCard, ProjectStorageHandler } from "./project.js";
import {  HandleSingleProject, SingleProjectStorageHandler, SingleProjectCard } from "./each_project.js";


const content = document.getElementById('content');
let currentContext = "General";
let numOfTasks = 0;

const _handleCardClick = (e) => {
    const cardElement = e.target.closest('.project-card');
    if (cardElement && !e.target.classList.contains('edit-button') && 
        !e.target.classList.contains('delete-button')) {
        const projectIndex = parseInt(e.target.closest('.project-card').getAttribute('data-id'));
        [currentContext, numOfTasks] = HandleSingleProject.getProjectDetails(projectIndex, currentContext);
        myProjects[projectIndex].setTaskCount(numOfTasks);
        console.log(numOfTasks)
        createSingleProjectPage(currentContext);
        updatePageName(currentContext);
    }
}
content.addEventListener('click', _handleCardClick);

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
const createProjectPage = () =>{
    CreateAddButton.clearBtnContainer();
    CreateAddButton.project();
    ProjectStorageHandler.loadProject();
    ProjectCard.displayCard();
    const addProjBtn = document.getElementById('addProjectBtn');
    addProjBtn.addEventListener('click', ()=>{
        ProjectModal.showProjectModal();
    })
}
export const createSingleProjectPage = (projName) =>{
    CreateAddButton.clearBtnContainer();
    CreateAddButton.todo();
    SingleProjectStorageHandler.loadTask();
    SingleProjectCard.displayCard(projName);
    const addTodoBtn = document.getElementById('addTodoBtn');
    addTodoBtn.addEventListener('click', ()=>{
        TodoModal.showTodoModal();
    })
}

 export const updatePageName = (name) =>{
    const pageName = document.getElementById('pageName');
    pageName.textContent = name;
}

export const handleBtnClick = (event) => {
    const buttonId = event.target.id; 
    content.replaceChildren();
    if (buttonId === "todo") {
        createTodoPage();
        updatePageName("To-Dos")
    } else if (buttonId === "project") {
        createProjectPage();
        updatePageName("Projects") 
    } 
}

const CreateAddButton = (()=>{
    const buttonContainer = document.getElementById('buttonContainer');
    const todo = () =>{
        const addTodoBtn = document.createElement('button');
        addTodoBtn.classList.add('add-button');
        addTodoBtn.id = 'addTodoBtn'
        addTodoBtn.textContent = "Add Task";
        buttonContainer.appendChild(addTodoBtn);
    }
    const project = () =>{
        const addProjectBtn = document.createElement('button');
        addProjectBtn.classList.add('add-button');
        addProjectBtn.id = 'addProjectBtn'
        addProjectBtn.textContent = "Add Project";
        buttonContainer.appendChild(addProjectBtn);
    }
    const clearBtnContainer = () =>{
        buttonContainer.replaceChildren()
    }
    return{
        todo,
        project,
        clearBtnContainer,
    }
})();

export const TodoModal = (()=>{
    const addTodoModal = document.getElementById('addTodoModal');
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
export const ProjectModal = (()=>{
    const addProjectModal = document.getElementById('addProjectModal');
    const showProjectModal = ()=>{
        addProjectModal.showModal();
    }
    const closeProjectModal = () =>{
        addProjectModal.close();
    }
    return{
        showProjectModal,
        closeProjectModal,
    }
})();

const FormHandler = (() => {
    const forms = [];

    const init = () => {
        forms.forEach(({ formId, cancelBtnId, submitHandler, closeModalHandler }) => {
            const form = document.getElementById(formId);
            const cancelBtn = document.getElementById(cancelBtnId);

            _setupSubmitFormListener(form, submitHandler);
            _setupCancelFormListener(form, cancelBtn, closeModalHandler);
            _setupInputListener(form);
        });
    }
    const _setupSubmitFormListener = (form, submitHandler) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = form.querySelectorAll('input[required], select[required]');
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
                submitHandler(form);
                _clearForm(form);
            }
        });
    }
    const _setupCancelFormListener = (form, cancelBtn, closeModalHandler) => {
        cancelBtn.addEventListener('click', () => {
            _clearForm(form);
            closeModalHandler();
        });
    };

    const _setupInputListener = (form) => {
        form.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('invalid');
                const errorMsg = this.parentElement.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            });
        });
    }
    const _clearForm = (form) => {
        form.querySelectorAll('input, select').forEach(input => {
            input.classList.remove('invalid');
            const errorMsg = input.parentElement.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        });
        form.reset();
    }
    const addForm = (formConfig) => {
        forms.push(formConfig);
    }
    return {
        init,
        addForm
    }
})();

const taskSubmitHandler = () => {
    const taskName = document.getElementById('taskName').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('dueDate').value;
    const priority = document.getElementById('priority').value;

    const newTask = new Task(taskName, description, dueDate, currentContext, priority);
    newTask.addTask();

    TodoModal.closeTodoModal();
    TodoCard.displayCard();
};
const projectSubmitHandler = () => {
    const projectName = document.getElementById('projectName').value;
    const projectDesc = document.getElementById('projectDesc').value;

    const newProject = new Project(projectName, projectDesc, numOfTasks);
    newProject.addProject();

    ProjectModal.closeProjectModal();
    ProjectCard.displayCard();
};

FormHandler.addForm({
    formId: 'todoForm',
    cancelBtnId: 'cancelTask',
    submitHandler: taskSubmitHandler,
    closeModalHandler: TodoModal.closeTodoModal
});
FormHandler.addForm({
    formId: 'projectForm',
    cancelBtnId: 'cancelProject',
    submitHandler: projectSubmitHandler,
    closeModalHandler: ProjectModal.closeProjectModal
});

FormHandler.init();
