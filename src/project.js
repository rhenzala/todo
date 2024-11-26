let myProjects = [];

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
}

export const ProjectCard = (()=>{
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
        deleteBtn.addEventListener('click', () => {
            myProjects.splice(index, 1);
            ProjectStorageHandler.saveProject(); 
            displayCard(); 
        });
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
