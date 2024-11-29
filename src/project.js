import { ProjectModal } from "./dom_manipulation";
import EditIcon from "../assets/edit.svg";
import DeleteIcon from "../assets/delete.svg";

export let myProjects = [];

export class Project {
    constructor(projectNameInput, projDescInput, numOfTasks){
        this.projectName = projectNameInput;
        this.projectDescription = projDescInput;
        this.numberOfTasks = numOfTasks;
    }
    addProject(){
        myProjects.push(this);
        ProjectStorageHandler.saveProject();
    }
    setTaskCount(count) {
        this.numberOfTasks = count;
        const projectIndex = myProjects.findIndex(p => 
            p.projectName === this.projectName && 
            p.projectDescription === this.projectDescription
        );
        
        if (projectIndex !== -1) {
            myProjects[projectIndex].numberOfTasks = count;
            ProjectStorageHandler.saveProject();
        }
    }
    updateDetails(newName, newDesc) {
        this.projectName = newName;
        this.projectDescription = newDesc;
        ProjectStorageHandler.saveProject();
    }
}

export const ProjectCard = (()=>{
    const content = document.getElementById('content');
    const _createCard = (project, index) => {
        const card = document.createElement('div');
        card.classList.add('card', 'project-card');
        card.id = 'projectCard';
        card.setAttribute('data-id', index);
        const projectName = document.createElement('p');
        const projectDesc = document.createElement('p');
        const numOfTasks = document.createElement('p');
        const cardBtn = document.createElement('div');
        const editBtn = document.createElement('button');
        const deleteBtn = document.createElement('button');
        const editIcon = document.createElement('img');
        editIcon.src = EditIcon;
        editIcon.alt = "Edit";
        const deleteIcon = document.createElement('img');
        deleteIcon.src = DeleteIcon;
        deleteIcon.alt = "Delete";
        projectName.textContent = `${project.projectName}`;
        projectDesc.textContent = `${project.projectDescription}`;
        numOfTasks.textContent = `${project.numberOfTasks} tasks`;
        cardBtn.classList.add('card-button');
        editBtn.appendChild(editIcon);
        editBtn.classList.add('edit-button');
        deleteBtn.appendChild(deleteIcon);
        deleteBtn.classList.add('delete-button');
        
        _handleEditBtn(editBtn, project, index);
        _handleDeleteBtn(deleteBtn, index);
        card.appendChild(projectName);
        card.appendChild(projectDesc);
        card.appendChild(numOfTasks);
        cardBtn.appendChild(editBtn);
        cardBtn.appendChild(deleteBtn);
        card.appendChild(cardBtn);
        content.appendChild(card);
    }
    const _handleEditBtn = (btn, project, index) => {
        btn.addEventListener('click', () => {
            ProjectModal.showEdit(project);
            const editForm = document.getElementById('editProjectForm');
            editForm.setAttribute('data-project-index', index);
        });
    }
    const _handleDeleteBtn = (btn, index) => {
        btn.addEventListener('click', () => {
            myProjects.splice(index, 1);
            ProjectStorageHandler.saveProject(); 
            displayCard(); 
        });
    }
    const displayCard = () => {
        content.replaceChildren();
        myProjects.forEach((project, index) =>{
            _createCard(project, index);
        })
        console.log(myProjects)
    }
    return{
        displayCard,
    }
})();

export const ProjectStorageHandler = (()=>{
    const saveProject = () =>{
        try {
            localStorage.setItem('myProjects', JSON.stringify(myProjects));
            console.log('Projects saved successfully');
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    }
    const loadProject = () => {
        try {
            const savedProjects = localStorage.getItem('myProjects');
            if (savedProjects) {
                const projectsData = JSON.parse(savedProjects);
                myProjects = []; 
                projectsData.forEach(projectData => {
                    const proj = new Project(
                        projectData.projectName,
                        projectData.projectDescription,
                        projectData.numberOfTasks,
                    );
                    myProjects.push(proj);
                });
                
                console.log('Projects loaded successfully');
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    };

    return {
        saveProject,
        loadProject,
    };
})();
