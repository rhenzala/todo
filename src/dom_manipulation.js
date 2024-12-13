import { myTasks, Task, HandleSingleProject, projectTasks } from "./todo.js";
import { myProjects, Project } from "./project.js";
import displayCard from "./handle_card.js";
import StorageHandler from "./storage.js";
import AddIcon from "../assets/plus.svg";


const content = document.getElementById('content');
const pageName = document.getElementById('pageName');
let currentContext = "General";
let numOfTasks = 0;

const _handleCardClick = (e) => {
    const cardElement = e.target.closest('.project-card');
    if (cardElement && !e.target.closest('.edit-button') && 
        !e.target.closest('.delete-button')) {
        const projectIndex = parseInt(e.target.closest('.project-card').getAttribute('data-id'));
        [currentContext, numOfTasks] = HandleSingleProject.getProjectDetails(projectIndex, currentContext);
        myProjects[projectIndex].setTaskCount(numOfTasks);
        console.log(numOfTasks)
        createSingleProjectPage(currentContext);
        updatePageName(currentContext);
    }
}

const _handleDeleteClick = (e) => {
    const btnElement = e.target.closest('.delete-button');
    const currentProject = HandleSingleProject.getCurrentProject();
    const index = parseInt(e.target.closest('.card').getAttribute('data-id'));
    if (btnElement && pageName.textContent === 'All Tasks') {
        myTasks.splice(index, 1);
        StorageHandler.saveTask(myTasks); 
        displayCard(myTasks, true, false, null, null);
    } else if (btnElement && pageName.textContent === currentProject) {
        const taskToDelete = projectTasks[index];
        const mainTaskIndex = myTasks.findIndex(task =>
            task.taskName === taskToDelete.taskName &&
            task.assignedProject === taskToDelete.assignedProject
        );
        if (mainTaskIndex !== -1) {
            myTasks.splice(mainTaskIndex, 1)
        }
        projectTasks.splice(index, 1);
        StorageHandler.saveTask(myTasks); 
        const currentProject = HandleSingleProject.getCurrentProject();
        displayCard(myTasks, true, true, projectTasks, currentProject); 
    } else if (btnElement && pageName.textContent === 'Projects') {
        if (Array.isArray(myProjects)) {
            myProjects.splice(index, 1);
            StorageHandler.saveProject(myProjects); 
            displayCard(myProjects, false, false, null, null);
        } else {
            console.error('myProjects is not an array:', myProjects);
        }
    }
}

const _handleEditClick = (e) => {
    const btnElement = e.target.closest('.edit-button');
    const index = parseInt(e.target.closest('.card').getAttribute('data-id'));
    if (btnElement && pageName.textContent !== 'Projects') {
        const taskToEdit = myTasks[index];
        TodoModal.showEdit(taskToEdit);
        const editForm = document.getElementById('editTodoForm');
        editForm.setAttribute('data-task-index', index);
    } else if (btnElement && pageName.textContent === 'Projects') {
        const projectToEdit = myProjects[index];
        ProjectModal.showEdit(projectToEdit);
        const editForm = document.getElementById('editProjectForm');
        editForm.setAttribute('data-project-index', index);
    }
}

content.addEventListener('click', _handleCardClick);
content.addEventListener('click', _handleDeleteClick);
content.addEventListener('click', _handleEditClick);

export const createTodoPage = () => {
    CreateAddButton.clearBtnContainer();
    CreateAddButton.todo();
    StorageHandler.loadTask(myTasks, Task);
    displayCard(myTasks, true, false, null, null);
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
    StorageHandler.loadProject(myProjects, Project);
    displayCard(myProjects, false, false, null, null);
    const addProjBtn = document.getElementById('addProjectBtn');
    addProjBtn.addEventListener('click', ()=>{
        ProjectModal.showProjectModal();
    })
}
export const createSingleProjectPage = (projName) =>{
    CreateAddButton.clearBtnContainer();
    CreateAddButton.todo();
    updatePageName(projName);
    StorageHandler.loadTask(projectTasks, Task);
    displayCard(myTasks, true, true, projectTasks, projName);
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
    addIcon.classList.add('hover:scale-105');
    const todo = () =>{
        const addTodoBtn = document.createElement('button');
        addTodoBtn.id = 'addTodoBtn'
        addTodoBtn.appendChild(addIcon);
        buttonContainer.appendChild(addTodoBtn);
    }
    const project = () =>{
        const addProjectBtn = document.createElement('button');
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
        addTodoModal.classList.remove('hidden');
        addTodoModal.showModal();
    }
    const closeTodoModal = () =>{
        addTodoModal.classList.add('hidden');
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
        editTodoModal.classList.remove('hidden');
        editTodoModal.showModal();
    }
    const closeEdit = () => {
        editTodoModal.classList.add('hidden');
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
        addProjectModal.classList.remove('hidden');
        addProjectModal.showModal();
    }
    const closeProjectModal = () => {
        addProjectModal.classList.add('hidden');
        addProjectModal.close();
    }
    const showEdit = (project) => {
        const editProjNameInput = document.getElementById('editProjectName');
        const editProjDescInput = document.getElementById('editProjectDesc');
        editProjNameInput.value = project.projectName;
        editProjDescInput.value = project.projectDescription;
        editProjectModal.classList.remove('hidden');
        editProjectModal.showModal();
    }
    const closeEdit = () => {
        editProjectModal.classList.add('hidden');
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
                        errorMsg = document.createElement('p');
                        errorMsg.classList.add('error-message');
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
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeModalHandler();
            _clearForm(form);
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
        displayCard(myTasks, true, false, null, null);
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
    displayCard(myProjects, false, false, null, null);
};
const editProjectSubmitHandler = () => {
    const projectIndex = parseInt(document.getElementById('editProjectForm').getAttribute('data-project-index'));
    const newName = document.getElementById('editProjectName').value;
    const newDesc = document.getElementById('editProjectDesc').value;

    myProjects[projectIndex].updateDetails(newName, newDesc);
    ProjectModal.closeEdit();
    displayCard(myProjects, false, false, null, null);
}
const editTaskSubmitHandler = () => {
    const taskIndex = parseInt(document.getElementById('editTodoForm').getAttribute('data-task-index'));
    const newName = document.getElementById('editTaskName').value;
    const newDesc = document.getElementById('editTaskDesc').value;
    const newDueDate = document.getElementById('editDueDate').value;
    const newPriority = document.getElementById('editPriority').value;

    myTasks[taskIndex].updateDetails(newName, newDesc, newDueDate, newPriority);
    TodoModal.closeEdit();
    displayCard(myTasks, true, false, null, null);
}
FormHandler.addForm({
    formId: 'editTodoForm',
    cancelBtnId: 'cancelTaskEdit',
    submitHandler: editTaskSubmitHandler,
    closeModalHandler: TodoModal.closeEdit
});
FormHandler.addForm({
    formId: 'editProjectForm',
    cancelBtnId: 'cancelProjectEdit',
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

