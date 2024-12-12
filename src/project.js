import StorageHandler from "./storage";

let myProjects = [];

class Project {
    constructor(projectNameInput, projDescInput, numOfTasks){
        this.projectName = projectNameInput;
        this.projectDescription = projDescInput;
        this.numberOfTasks = numOfTasks;
    }
    addProject(){
        myProjects.push(this);
        StorageHandler.saveProject(myProjects);
    }
    setTaskCount(count) {
        this.numberOfTasks = count;
        const projectIndex = myProjects.findIndex(p => 
            p.projectName === this.projectName && 
            p.projectDescription === this.projectDescription
        );
        
        if (projectIndex !== -1) {
            myProjects[projectIndex].numberOfTasks = count;
            StorageHandler.saveProject(myProjects);
        }
    }
    updateDetails(newName, newDesc) {
        this.projectName = newName;
        this.projectDescription = newDesc;
        StorageHandler.saveProject(myProjects);
    }
}

export { myProjects, Project } 




