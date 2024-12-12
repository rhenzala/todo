const StorageHandler = (()=>{
    const saveTask = (myTasks) =>{
        try {
            localStorage.setItem('myTasks', JSON.stringify(myTasks));
            console.log('Tasks saved successfully');
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    }
    const loadTask = (myTasks, Task) => {
        try {
            const savedTasks = localStorage.getItem('myTasks');
            if (savedTasks) {
                const tasksData = JSON.parse(savedTasks);
                myTasks = []; 
                
                tasksData.forEach(taskData => {
                    const task = new Task(
                        taskData.taskName,
                        taskData.description,
                        taskData.dueDate,
                        taskData.priority,
                        taskData.assignedProject
                    );
                    myTasks.push(task);
                });
                
                console.log('Tasks loaded successfully');
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    };
    const saveProject = (myProjects) =>{
        try {
            localStorage.setItem('myProjects', JSON.stringify(myProjects));
            console.log('Projects saved successfully');
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    }
    const loadProject = (myProjects, Project) => {
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
        saveTask,
        loadTask,
        saveProject,
        loadProject
    };
})();

export default StorageHandler