import { myTasks, Task, TodoCard, StorageHandler } from "./todo.js";
import { myProjects, Project, ProjectCard, ProjectStorageHandler } from "./project.js";
import { HandleSingleProject, SingleProjectCard } from "./each_project.js";
import AddIcon from "../assets/plus.svg";


const content = document.getElementById('content');
const pageName = document.getElementById('pageName');
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
    updatePageName("Projects");
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
    updatePageName(projName);
    StorageHandler.loadTask();
    SingleProjectCard.displayCard(projName);
    const addTodoBtn = document.getElementById('addTodoBtn');
    addTodoBtn.addEventListener('click', ()=>{
        TodoModal.showTodoModal();
    })
}

 export const updatePageName = (name) =>{
    pageName.textContent = name;
}

export const handleBtnClick = (event) => {
    const buttonId = event.target.id; 
    content.replaceChildren();
    if (buttonId === "todo") {
        HandleSingleProject.resetCurrentProjectName();
        updatePageName("All Tasks");
        createTodoPage();
    } else if (buttonId === "project") {
        createProjectPage();
    } 
}

const CreateAddButton = (()=>{
    const buttonContainer = document.getElementById('buttonContainer');
    const addIcon = document.createElement('img');
    addIcon.src = AddIcon;
    addIcon.alt = "Add";
    const todo = () =>{
        const addTodoBtn = document.createElement('button');
        addTodoBtn.classList.add('add-button');
        addTodoBtn.id = 'addTodoBtn'
        addTodoBtn.appendChild(addIcon);
        buttonContainer.appendChild(addTodoBtn);
    }
    const project = () =>{
        const addProjectBtn = document.createElement('button');
        addProjectBtn.classList.add('add-button');
        addProjectBtn.id = 'addProjectBtn'
        addProjectBtn.appendChild(addIcon);
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
    const editTodoModal = document.getElementById('editTodoModal');
    const showTodoModal = () =>{
        addTodoModal.showModal();
    }
    const closeTodoModal = () =>{
        addTodoModal.close();
    }
    const showEdit = (task) => {
        const editTaskNameInput = document.getElementById('editTaskName');
        const editTaskDescInput = document.getElementById('editTaskDesc');
        const editDueDate = document.getElementById('editDueDate');
        const editPriority = document.getElementById('editPriority');
        editTaskNameInput.value = task.taskName;
        editTaskDescInput.value = task.description;
        editDueDate.value = task.dueDate;
        editPriority.value = task.priority;
        editTodoModal.showModal();
    }
    const closeEdit = () => {
        editTodoModal.close();
    }
    return{
        showTodoModal,
        closeTodoModal,
        showEdit,
        closeEdit
    }
})();
export const ProjectModal = (()=>{
    const addProjectModal = document.getElementById('addProjectModal');
    const editProjectModal = document.getElementById('editProjectModal');
    const showProjectModal = () => {
        addProjectModal.showModal();
    }
    const closeProjectModal = () => {
        addProjectModal.close();
    }
    const showEdit = (project) => {
        const editProjNameInput = document.getElementById('editProjectName');
        const editProjDescInput = document.getElementById('editProjectDesc');
        editProjNameInput.value = project.projectName;
        editProjDescInput.value = project.projectDescription;
        editProjectModal.showModal();
    }
    const closeEdit = () => {
        editProjectModal.close();
    }
    return{
        showProjectModal,
        closeProjectModal,
        showEdit,
        closeEdit
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

    let context = pageName === "All Tasks" ? "General": HandleSingleProject.getCurrentProject();

    const newTask = new Task(taskName, description, dueDate, priority, context);
    newTask.addTask();

    TodoModal.closeTodoModal();
    if (context === "General"){
        TodoCard.displayCard();
    } else {
        HandleSingleProject.refreshProjectTasks();
    }
};
const projectSubmitHandler = () => {
    const projectName = document.getElementById('projectName').value;
    const projectDesc = document.getElementById('projectDesc').value;

    const newProject = new Project(projectName, projectDesc, numOfTasks);
    newProject.addProject();

    ProjectModal.closeProjectModal();
    ProjectCard.displayCard();
};
const editProjectSubmitHandler = () => {
    const projectIndex = parseInt(document.getElementById('editProjectForm').getAttribute('data-project-index'));
    const newName = document.getElementById('editProjectName').value;
    const newDesc = document.getElementById('editProjectDesc').value;

    myProjects[projectIndex].updateDetails(newName, newDesc);
    ProjectModal.closeEdit();
    ProjectCard.displayCard();
}
const editTaskSubmitHandler = () => {
    const taskIndex = parseInt(document.getElementById('editTodoForm').getAttribute('data-task-index'));
    const newName = document.getElementById('editTaskName').value;
    const newDesc = document.getElementById('editTaskDesc').value;
    const newDueDate = document.getElementById('editDueDate').value;
    const newPriority = document.getElementById('editPriority').value;

    myTasks[taskIndex].updateDetails(newName, newDesc, newDueDate, newPriority);
    TodoModal.closeEdit();
    TodoCard.displayCard();
}
FormHandler.addForm({
    formId: 'editTodoForm',
    cancelBtnId: 'cancelTask',
    submitHandler: editTaskSubmitHandler,
    closeModalHandler: TodoModal.closeEdit
});
FormHandler.addForm({
    formId: 'editProjectForm',
    cancelBtnId: 'cancelTask',
    submitHandler: editProjectSubmitHandler,
    closeModalHandler: ProjectModal.closeEdit
});

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
