let myTasks = [];

export class Task {
    constructor(taskNameInput, descriptionInput, dateInput, assignedProject, priorityInput){
        this.taskName = taskNameInput;
        this.description = descriptionInput;
        this.dueDate = dateInput;
        this.assignedProject = assignedProject;
        this.priority = priorityInput;
    }
    addTask(){
        myTasks.push(this);
        StorageHandler.saveTask();
    }
}

export const TodoCard = (()=>{
    const content = document.getElementById('content');
    const _createCard = (task, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-id', index);
        const taskName = document.createElement('p');
        const dueDate = document.createElement('p');
        const description = document.createElement('p');
        const assignedProject = document.createElement('p');
        const editBtn = document.createElement('button');
        const deleteBtn = document.createElement('button');
        taskName.textContent = `${task.taskName}`;
        dueDate.textContent = `${task.dueDate}`;
        description.textContent = `${task.description}`;
        assignedProject.textContent = `${task.assignedProject}`
        editBtn.textContent = "EDIT";
        editBtn.classList.add('edit-button');
        deleteBtn.textContent = "DELETE";
        deleteBtn.classList.add('delete-button');
        deleteBtn.addEventListener('click', () => {
            myTasks.splice(index, 1);
            StorageHandler.saveTask(); // Save after deletion
            displayCard(); // Refresh display
        });
        card.appendChild(taskName);
        card.appendChild(dueDate);
        card.appendChild(description);
        card.appendChild(assignedProject);
        card.appendChild(editBtn);
        card.appendChild(deleteBtn);
        content.appendChild(card);
    }
    const displayCard = () => {
        content.replaceChildren();
        myTasks.forEach((task, index) =>{
            _createCard(task, index);
        })
    }
    return{
        displayCard,
    }
})();

export const StorageHandler = (()=>{
    const saveTask = () =>{
        try {
            localStorage.setItem('myTasks', JSON.stringify(myTasks));
            console.log('Tasks saved successfully');
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    }
    const loadTask = () => {
        try {
            const savedTasks = localStorage.getItem('myTasks');
            if (savedTasks) {
                // Parse saved tasks and recreate Task objects
                const tasksData = JSON.parse(savedTasks);
                myTasks = []; // Clear existing tasks
                
                tasksData.forEach(taskData => {
                    const task = new Task(
                        taskData.taskName,
                        taskData.description,
                        taskData.dueDate,
                        taskData.assignedProject,
                        taskData.priority
                    );
                    myTasks.push(task);
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
