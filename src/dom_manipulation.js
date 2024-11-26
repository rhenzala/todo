import { Task, TodoCard, StorageHandler } from "./todo.js";
import { Project, ProjectCard, ProjectStorageHandler } from "./project.js";

let currentContext = "General"
const content = document.getElementById('content');

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
        //console.log("here")
    })
}

 const updatePageName = (name) =>{
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

    const newTask = new Task(taskName, description, dueDate, 'General', priority);
    newTask.addTask();

    TodoModal.closeTodoModal();
    TodoCard.displayCard();
};
const projectSubmitHandler = () => {
    const projectName = document.getElementById('projectName').value;
    const projectDesc = document.getElementById('projectDesc').value;

    const newProject = new Project(projectName, projectDesc, 1);
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
