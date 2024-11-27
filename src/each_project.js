import { myProjects } from "./project";
import { myTasks, Task, TodoCard } from "./todo.js";

const content = document.getElementById('content');
export let projectTasks = [];

export const HandleSingleProject = (() => {
    const getProjectDetails = (index, currentContext) => {
        const project = myProjects[index];
        if (project) {
            currentContext = project.projectName;
            // call the getAllProjectTasks to get the projectName of the current card
            const projTasks = _getAllProjectTasks(currentContext).length;
            //console.log("inside _getProjectDetails",currentProjectName);
            return [currentContext, projTasks];
        }
        return null;
    }
    const _getAllProjectTasks = (projectName) => {
        projectTasks = [];
        projectTasks = myTasks.filter(task => task.assignedProject === projectName);
        console.log('Tasks for project:', projectTasks);
        return projectTasks;
    }
    return{
        getProjectDetails
    }
})();

export const SingleProjectCard = (() => {
    const displayCard = (projName) => {
        content.replaceChildren();
        projectTasks.forEach((task, index) =>{
            if (task.assignedProject === projName){
                TodoCard.createCard(task, index);
            }
        })
    }
    return{
        displayCard,
    }
})()

export const SingleProjectStorageHandler = (()=>{
    const saveTask = () =>{
        try {
            localStorage.setItem('myTasks', JSON.stringify(projectTasks));
            console.log('Tasks saved successfully');
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    }
    const loadTask = () => {
        try {
            const savedTasks = localStorage.getItem('myTasks');
            if (savedTasks) {
                const tasksData = JSON.parse(savedTasks);
                projectTasks = []; 
                
                tasksData.forEach(taskData => {
                    const task = new Task(
                        taskData.taskName,
                        taskData.description,
                        taskData.dueDate,
                        taskData.assignedProject,
                        taskData.priority
                    );
                    projectTasks.push(task);
                });
                
                console.log('Tasks loaded successfully');
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    };

    return {
        saveTask,
        loadTask,
    };
})();
