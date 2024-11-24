
export const addTodoButton = (container) =>{
    const addToDoBtn = document.createElement('button');
    addToDoBtn.classList.add('add-button', 'add-todo-button');
    addToDoBtn.textContent = "Add To-Do";
    container.appendChild(addToDoBtn);
}
export const addProjectButton = (container) =>{
    const addProjectBtn = document.createElement('button');
    addProjectBtn.classList.add('add-button', 'add-project-button');
    addProjectBtn.textContent = "Add Project";
    container.appendChild(addProjectBtn);
}

export const showTodoModal = ()=>{
    const addTodoBtn = document.querySelector('.add-todo-button');
    const addTodoModal = document.getElementById('addTodoModal')
    addTodoBtn.addEventListener('click', ()=>{
        addTodoModal.showModal();
    })
}
export const showProjectModal = ()=>{
    const addProjectBtn = document.querySelector('.add-project-button');
    const addProjectModal = document.getElementById('addProjectModal')
    addProjectBtn.addEventListener('click', ()=>{
        addProjectModal.showModal();
    })
}