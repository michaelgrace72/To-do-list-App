const todoForm = document.querySelector('#to-do-form')
const remainingTask = document.querySelector('#remaining-task')
const completedTask = document.querySelector('#completed-task')
const totalTask = document.querySelector('#total-task')
const todoList = document.querySelector('.todolist')
const mainInput = document.querySelector('#to-do-form input')

let tasks = JSON.parse(localStorage.getItem('tasks')) || []

if(localStorage.getItem('tasks')){
    tasks.map((task) => {
        createTask(task)
    })
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const inputValue = mainInput.value
    if (inputValue == ''){
        return
    }

    const task = {
        id: new Date().getTime(),
        name: inputValue,
        isCompleted: false
    }

    tasks.push(task)
    localStorage.setItem('tasks', JSON.stringify(tasks))

    createTask(task)

    todoForm.reset()
    mainInput.focus()
})

todoList.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-button') || 
    e.target.parentElement.classList.contains('remove-button') ||
    e.target.parentElement.parentElement.classList.contains('remove-button')){
        const taskId = e.target.closest('li').id

        removeTask(taskId)
    }
})

todoList.addEventListener('keydown', (e) => {
    if (e.keyCode == 13){
        e.preventDefault()

        e.target.blur()
    }
})

todoList.addEventListener('input', (e) => {
    const taskId = e.target.closest('li').id

    updateTask(taskId, e.target)
})

function createTask(task){
    const taskEl = document.createElement('li')

    taskEl.setAttribute('id', task.id)

    if(task.isCompleted){
        taskEl.classList.add('complete')
    }

    const taskElMarkup = `
    <div>
        <input type="checkbox" name="tasks" id="${task.id}" ${task.isCompleted ? 'checked' : ''}>
        <span ${!task.isCompleted ? 'contenteditable' : ''}>${task.name}</span> 
    </div>

    <button title="remove the '${task.name}' task" class="remove-button">
        <img src="https://cdn0.iconfinder.com/data/icons/octicons/1024/x-512.png" id="xbutton">
    </button>
    `


    taskEl.innerHTML = taskElMarkup

    todoList.appendChild(taskEl)

    countTasks()
}

function countTasks(){
    const completedTaskArr = tasks.filter((task) => 
        task.isCompleted == true
    )

    totalTask.textContent = tasks.length
    completedTask.textContent = completedTaskArr.length
    remainingTask.textContent = tasks.length - completedTaskArr.length
}

function removeTask(taskId){
    tasks = tasks.filter((task) => 
        task.id != parseInt(taskId)
    )

    localStorage.setItem('tasks', JSON.stringify(tasks))

    document.getElementById(taskId).remove()

    countTasks()
}

function updateTask(taskId, el){
    const task = tasks.find((task) => task.id == parseInt(taskId))

    if(el.hasAttribute('contenteditable')){
        task.name = el.textContent
    } else {
        const span = el.nextElementSibling
        const parent = el.closest('li')

        task.isCompleted = !task.isCompleted

        if(task.isCompleted){
            span.removeAttribute('contenteditable')
            parent.classList.add('complete')
        } else {
            span.setAttribute('contenteditable', 'true')
            parent.classList.remove('complete')
        }
    }

    localStorage.setItem('tasks', JSON.stringify(tasks))
    countTasks()
}