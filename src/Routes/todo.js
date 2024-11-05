import { Project } from "./projects";
import { time } from "./time";
import { initial_page } from "./initial-page-load";

export const todoapp = (() => {
    class Task {
        constructor(title, description, dueDate, priority, notes, project) {
            this.title = title;
            this.description = description;
            this.dueDate = dueDate;
            this.priority = priority;
            this.notes = notes;
            this.completed = false;
            this.project = project;
        }

        toggleComplete() {
            this.completed = !this.completed;
        }
    }

    function createTodo() {

        const pr = new Promise(function(resolve, reject){
            if (!validateToDo()) {
                reject(new Error("Task Details Incomplete"));
            } else if (!Project.storageAvailable("localStorage")) {
                reject(new Error("Local Storage not available"));
            } else {
                const title = document.querySelector("#title").value;
                const description = document.querySelector("#description").value || "";
                const dueDate = time.formatTime(document.querySelector("#date").value);
                const selectedPriority = document.querySelector('input[name="priority"]:checked');
                const priority = selectedPriority ? selectedPriority.value : "low";
                const notes = document.querySelector("#notes").value || "";
    
                const activeProject = Project.getActiveProject();
                const task = new Task(title, description, dueDate, priority, notes, activeProject);
               
    
                // Retrieve and validate projectTasks as an array
                let projectTasks = JSON.parse(localStorage.getItem(activeProject));
                if (!Array.isArray(projectTasks)) {
                    projectTasks = []; // Default to an empty array if it's not an array
                }
    
                // Add the new task to the array and update localStorage
                projectTasks.push(task);
                localStorage.setItem(activeProject, JSON.stringify(projectTasks));
    
                // Also add to 'All Tasks' if this is not the 'All Tasks' project
                if (activeProject !== "All Tasks") {
                    let allTasks = JSON.parse(localStorage.getItem("All Tasks"));
                    if (!Array.isArray(allTasks)) {
                        allTasks = []; // Default to an empty array if it's not an array
                    }
                    allTasks.push(task);
                    localStorage.setItem("All Tasks", JSON.stringify(allTasks));
                }
    
                resolve(activeProject);
            }
        });

       return pr;
    }
    
    function createTaskElement(task) {
        const newToDo = document.createElement("div");
        newToDo.setAttribute("id", `task-${task.title.replace(/\s+/g, '_')}`);

        const titleBox = document.createElement("h2");
        titleBox.textContent = task.title;
        newToDo.appendChild(titleBox);

        const descriptionBox = document.createElement("p");
        descriptionBox.textContent = task.description;
        newToDo.appendChild(descriptionBox);

        const dueDateBox = document.createElement("div");
        dueDateBox.textContent = task.dueDate;
        dueDateBox.classList.add("date");
        newToDo.appendChild(dueDateBox);

        const priorityBox = document.createElement("div");
        priorityBox.textContent = "Priority: " + task.priority;
        newToDo.appendChild(priorityBox);

        const notes = document.createElement("div");
        notes.textContent = task.notes;
        newToDo.appendChild(notes);

        const checkBox = document.createElement("input");
        checkBox.setAttribute("type", "checkbox");
        checkBox.setAttribute("class", "mycheckbox");
        checkBox.setAttribute("name", "mycheckbox");
        if(task.completed === true){
            checkBox.setAttribute("checked", "true");
        }
        newToDo.appendChild(checkBox);

        // Checkbox change event
        checkBox.addEventListener("change", () => {
            let tasks = JSON.parse(localStorage.getItem(task.project));    
            console.log(task);
            console.log(tasks);   
           
            
            tasks = tasks.filter(todo => todo.dueDate !== task.dueDate && todo.title !== task.title);
            task.completed = !task.completed;     
            tasks.push(task);
            localStorage.setItem(task.project, JSON.stringify(tasks));

            if(tasks.project !== "All Tasks"){
                let tasks1 = JSON.parse(localStorage.getItem("All Tasks"));   
                task.completed = !task.completed; 
                tasks1 = tasks1.filter(todo => todo.dueDate !== task.dueDate && todo.title !== task.title);
                task.completed = !task.completed;
                tasks1.push(task);
                localStorage.setItem("All Tasks", JSON.stringify(tasks1));
            }
            console.log("sucess");
        });

        newToDo.classList.add("tasks");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "delete";
        deleteButton.classList.add("deletetodo");
        deleteButton.addEventListener("click", () => {
            let tasks = JSON.parse(localStorage.getItem(task.project));
            tasks = tasks.filter(todo => todo.dueDate !== task.dueDate && todo.title !== task.title);
            localStorage.setItem(task.project, JSON.stringify(tasks));
            if(task.project !== "All Tasks"){
                let tasks1 = JSON.parse(localStorage.getItem("All Tasks"));
                tasks1 = tasks1.filter(todo => todo.dueDate !== task.dueDate && todo.title !== task.title);
                localStorage.setItem("All Tasks", JSON.stringify(tasks1));
            }
            
            displayTasks(Project.getActiveProject());
        });
        newToDo.appendChild(deleteButton);

        return newToDo;
    }

    function displayAll(tasks) {
        const displayBox = document.querySelector("#display");
        console.log(Array.isArray(tasks));
        tasks.forEach((task) => {
           
            const taskElement = createTaskElement(task);
            displayBox.appendChild(taskElement);
        });
    }

    const displayTasks = (activeProject) => {
        const displayBox = document.querySelector("#display");
        displayBox.textContent = "";
        const tasksContainer = document.createElement("div"); 
        tasksContainer.textContent = ''; 
    
        
            if (activeProject === "Today") {
                const todayTasks = time.getTodayTasks();
                todayTasks.length !== 0 && todayTasks ? displayAll(todayTasks) : tasksContainer.textContent = 'No tasks today';
            } else if (activeProject === "Next 7 Days") {
                const next7Days = time.getNext7Days();
                next7Days.length !== 0 && next7Days ? displayAll(next7Days) : tasksContainer.textContent = 'No upcoming tasks';
            }
        else {
            const projectTasks = JSON.parse(localStorage.getItem(activeProject));
            
            initial_page.defaultProjectDisplay();
            projectTasks.length !== 0 && projectTasks? displayAll(projectTasks) : tasksContainer.textContent = 'No tasks';
        }
        displayBox.appendChild(tasksContainer);
    };

    function validateToDo() {
        const title = document.querySelector("#title").value;
        const dueDate = time.formatTime(document.querySelector("#date").value);
        
        return title &&  dueDate;
    }


    return { createTodo, displayTasks };
})();
