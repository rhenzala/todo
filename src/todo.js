import { myProjects } from "./project";
import StorageHandler from "./storage";
import displayCard from "./handle_card";

let myTasks = [];
let projectTasks = [];

const pageName = document.getElementById('pageName').textContent;

class Task {
    constructor(taskNameInput, descriptionInput, dateInput, priorityInput, assignedProject){
        this.taskName = taskNameInput;
        this.description = descriptionInput;
        this.dueDate = dateInput;
        this.priority = priorityInput;
        this.assignedProject = assignedProject || "General"; 
    }
    addTask(){
        myTasks.push(this);
        StorageHandler.saveTask(myTasks);
        if (pageName === "All Tasks"){
            displayCard(myTasks, true, false, null, null);
        } else {
            displayCard(myTasks, true, true, projectTasks, this.assignedProject);
        }
    }
    updateDetails(newName, newDesc, newDueDate, newPriority) {
        this.taskName = newName;
        this.description = newDesc;
        this.dueDate = newDueDate;
        this.priority = newPriority;
        StorageHandler.saveTask(myTasks);
        if (pageName === "All Tasks"){
            displayCard(myTasks, true, false, null, null);
        } else {
            displayCard(myTasks, true, true, projectTasks, this.assignedProject);
        }
    }
}


const HandleSingleProject = (() => {
    let currentProjectName = "";

    const getProjectDetails = (index, currentContext) => {
        const project = myProjects[index];
        if (project) {
            currentContext = project.projectName;
            currentProjectName = project.projectName;
            const projTasks = _getAllProjectTasks(currentContext).length;
            return [currentContext, projTasks];
        }
        return null;
    }
    const _getAllProjectTasks = (projectName) => {
        projectTasks = myTasks.filter(task => task.assignedProject === projectName);
        return projectTasks;
    }
    const getCurrentProject = () => currentProjectName;
    const refreshProjectTasks = () => {
        if (currentProjectName) {
            _getAllProjectTasks(currentProjectName);
            displayCard(myTasks, true, true, projectTasks, currentProjectName);
        }
    }
    const resetCurrentProjectName = () => currentProjectName = "";
    return{
        getProjectDetails,
        getCurrentProject,
        refreshProjectTasks,
        resetCurrentProjectName
    }
})();

export { myTasks, Task, HandleSingleProject, projectTasks }




