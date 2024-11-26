import { CreateAddButton, ProjectModal  } from "./dom_manipulation";

export const createProjectPage = () =>{
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

let myProjects = [];

class Project {
    constructor(projectNameInput, projDescInput, numOfTasks){
        this.projectName = projectNameInput;
        this.projectDescription = projDescInput;
        this.numberOfTasks = numOfTasks;
    }
    addProject(){
        myProjects.push(this);
        ProjectStorageHandler.saveProject();
    }
}

const FormHandler = (() => {
    const submitInput = () => {
        const projectName = document.getElementById('projectName');
        const projectDesc = document.getElementById('projectDesc');
        const confirmBtn = document.getElementById('confirmProject');

        confirmBtn.addEventListener('click', (event)=>{
            event.preventDefault();
            const projectNameInput = projectName.value;
            const projectDescInput = projectDesc.value;
            const numOfTasks = 1;
            const newProject = new Project(projectNameInput, projectDescInput, numOfTasks);
            newProject.addProject();
            console.log(myProjects);

            ProjectModal.closeProjectModal();
            ProjectCard.displayCard();
            _clearForm();
        })
    }
    const cancelInput = () =>{
        const cancelBtn = document.getElementById('cancelProject');
        cancelBtn.addEventListener('click', ()=>{
            ProjectModal.closeProjectModal();
            _clearForm();
        })
    }
    const _clearForm = () =>{
        const form = document.getElementById('projectForm');
        form.reset();
    }
    return{
        submitInput,
        cancelInput,
    }
})();

const ProjectCard = (()=>{
    const content = document.getElementById('content');
    const _createCard = (project, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-id', index);
        const projectName = document.createElement('p');
        const projectDesc = document.createElement('p');
        const numOfTasks = document.createElement('p');
        const showBtn = document.createElement('button');
        const deleteBtn = document.createElement('button');
        projectName.textContent = `${project.projectName}`;
        projectDesc.textContent = `${project.projectDescription}`;
        numOfTasks.textContent = `${project.numberOfTasks}`
        showBtn.textContent = "SHOW";
        showBtn.classList.add('show-button');
        deleteBtn.textContent = "DELETE";
        deleteBtn.classList.add('delete-button');
        card.appendChild(projectName);
        card.appendChild(projectDesc);
        card.appendChild(numOfTasks);
        card.appendChild(showBtn);
        card.appendChild(deleteBtn);
        content.appendChild(card);
    }
    const displayCard = () => {
        content.replaceChildren();
        myProjects.forEach((project, index) =>{
            _createCard(project, index);
        })
    }
    return{
        displayCard,
    }
})();

const ProjectStorageHandler = (()=>{
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
                // Parse saved tasks and recreate Task objects
                const projectsData = JSON.parse(savedProjects);
                myProjects = []; // Clear existing tasks
                
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

FormHandler.submitInput();
FormHandler.cancelInput();