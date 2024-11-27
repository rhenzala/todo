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
        const editBtn = document.createElement('button');
        const deleteBtn = document.createElement('button');
        projectName.textContent = `${project.projectName}`;
        projectDesc.textContent = `${project.projectDescription}`;
        numOfTasks.textContent = `${project.numberOfTasks} tasks`;
        editBtn.textContent = "EDIT";
        editBtn.classList.add('edit-button');
        deleteBtn.textContent = "DELETE";
        deleteBtn.classList.add('delete-button');
        
        _handleDeleteBtn(deleteBtn, index);
        card.appendChild(projectName);
        card.appendChild(projectDesc);
        card.appendChild(numOfTasks);
        card.appendChild(editBtn);
        card.appendChild(deleteBtn);
        content.appendChild(card);
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
