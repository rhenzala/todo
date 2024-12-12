import { TodoModal, ProjectModal } from "./dom_manipulation";
import EditIcon from "../assets/edit.svg";
import DeleteIcon from "../assets/delete.svg";


const content = document.getElementById('content');
const _createCard = (item, index, isTask) => {
    const card = document.createElement('div');
    card.classList.add('card', 'rounded-lg', 'shadow-lg', 'bg-gray', 'p-6', 'grid', 'gap-2.5');
    card.setAttribute('data-id', index);
    if (isTask) {
        _appendTaskDetails(card, item);
    } else {
        _appendProjectDetails(card, item)
        card.classList.add('project-card', 'border-l-black', 'border-l-solid', 'border-l-8')
    }
    const cardBtn = document.createElement('div');
    const editBtn = document.createElement('button');
    const deleteBtn = document.createElement('button');
    const editIcon = document.createElement('img');
    editIcon.src = EditIcon;
    editIcon.alt = "Edit";
    const deleteIcon = document.createElement('img');
    deleteIcon.src = DeleteIcon;
    deleteIcon.alt = "Delete";
    cardBtn.classList.add('card-button', 'mt-6', 'justify-self-end', 'flex', 'gap-2');
    editBtn.classList.add('edit-button');
    deleteBtn.classList.add('delete-button');
    
    editBtn.appendChild(editIcon);
    deleteBtn.appendChild(deleteIcon);
    
    _handleEditBtn(editBtn, item, index, isTask)
    
    cardBtn.appendChild(editBtn);
    cardBtn.appendChild(deleteBtn);
    card.appendChild(cardBtn);
    content.appendChild(card);
}
const _appendTaskDetails = (card, task) => {
    const taskName = document.createElement('p');
    const dueDate = document.createElement('p');
    const description = document.createElement('p');
    const assignedProject = document.createElement('p');
    taskName.classList.add('text-2xl', 'font-semibold');
    dueDate.classList.add('text-sm', 'font-medium')
    assignedProject.classList.add('font-semibold');
    taskName.textContent = `${task.taskName}`;
    dueDate.textContent = `Due: ${task.dueDate}`;
    description.textContent = `${task.description}`;
    assignedProject.textContent = `${task.assignedProject}`;
    card.appendChild(taskName);
    card.appendChild(dueDate);
    card.appendChild(description);
    card.appendChild(assignedProject);

    _handlePriority(task.priority, card);
}
const _appendProjectDetails = (card, project) => {
    const projectName = document.createElement('p');
    const projectDesc = document.createElement('p');
    const numOfTasks = document.createElement('p');
    projectName.classList.add('text-2xl', 'font-semibold');
    numOfTasks.classList.add('font-semibold')
    projectName.textContent = `${project.projectName}`;
    projectDesc.textContent = `${project.projectDescription}`;
    numOfTasks.textContent = `${project.numberOfTasks} tasks`;
    card.appendChild(projectName);
    card.appendChild(projectDesc);
    card.appendChild(numOfTasks);
}
const _editTask = (task, index) => {
    TodoModal.showEdit(task);
    const editForm = document.getElementById('editTodoForm');
    editForm.setAttribute('data-task-index', index);
}
const _editProject = (project, index) => {
    ProjectModal.showEdit(project);
    const editForm = document.getElementById('editProjectForm');
    editForm.setAttribute('data-project-index', index);
}
const _handleEditBtn = (btn, item, index, isTask) => {
    if (isTask) {
        btn.addEventListener('click', () => _editTask(item, index));
    }
    else {
        btn.addEventListener('click', () => _editProject(item, index));
    }
}

const _handlePriority = (priority, card) => {
    if (priority === "high") {
        card.id = "highPriority";
        card.classList.add('border-l-red', 'border-l-solid', 'border-l-8');
    } else if (priority === "medium"){
        card.id = "mediumPriority";
        card.classList.add('border-l-amber', 'border-l-solid', 'border-l-8');
    } else if (priority === "low"){
        card.id = "lowPriority";
        card.classList.add('border-l-green', 'border-l-solid', 'border-l-8');
    }
}
const displayCard = (myArray, isTask, isWithinProject, projectTasks, projName) => {
    content.replaceChildren();
    if (!isWithinProject) {
        myArray.forEach((item, index) =>{
            _createCard(item, index, isTask, false, null, null);
        })
    } else {
        projectTasks = myArray.filter(task => task.assignedProject === projName);
        projectTasks.forEach((task, index) =>{
            _createCard(task, index, isTask, isWithinProject, projectTasks);
        });
    }
    
}

export default displayCard 