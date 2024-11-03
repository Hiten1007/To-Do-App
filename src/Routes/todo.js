import { Project } from "./projects";
import { time } from "./time";
import { initial_page } from "./initial-page-load";

export const todoapp = (() => {
    class Task {
        constructor(title, description, dueDate, priority, notes) {
            this.title = title;
            this.description = description;
            this.dueDate = dueDate;
            this.priority = priority;
            this.notes = notes;
            this.completed = false;
        }

        toggleComplete() {
            this.completed = !this.completed;
        }
    }

    function createTodo() {

        const pr = new Promise(function(resolve, reject){
            if(!validateToDo()){
                const err = new Error("Task Details Incomplete");
                reject(err);
            } else if(!Project.storageAvailable("localStorage")){
                const err = new Error("Local Storage not available");
            } else {
                const title = document.querySelector("#title").value;
                const description = document.querySelector("#description").value ? document.querySelector("#description").value : "";
                const dueDate = time.formatTime(document.querySelector("#date").value);
                const selectedPriority = document.querySelector('input[name="priority"]:checked');
                const priority = selectedPriority ? selectedPriority.value : "low";
                const notes = document.querySelector("#notes").value ? document.querySelector("#notes").value  : "";

                const task = new Task(title, description, dueDate, priority, notes);
                const activeproject = Project.getActiveProject();
                localStorage.setItem(`${activeproject}`, JSON.stringify(JSON.parse(localStorage.getItem(`${activeproject}`)).push(task)));
                if(activeproject !== "All Tasks"){
                    localStorage.setItem(`${activeproject}`, localStorage.getItem(`${activeproject}`).push(JSON.stringify(task)));
                }
                resolve(activeproject);
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
        dueDateBox.textContent = task.date;
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
        newToDo.appendChild(checkBox);

        // Checkbox change event
        checkBox.addEventListener("change", () => {
            task.toggleComplete();
        });

        newToDo.classList.add("tasks");

        return newToDo;
    }

    function displayAll(tasks) {
        const displayBox = document.querySelector("#display");
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
    
        if (["Today", "Next 7 Days"].includes(activeProject)) {
            if (activeProject === "Today") {
                const todayTasks = time.getTodayTasks();
                todayTasks ? displayAll(todayTasks) : tasksContainer.textContent = 'No tasks today';
            } else if (activeProject === "Next 7 Days") {
                const next7Days = time.getNext7Days();
                next7Days ? displayAll(next7Days) : tasksContainer.textContent = 'No upcoming tasks';
            }
        } else {
            const projectTasks = JSON.parse(localStorage.getItem(activeProject));
            initial_page.defaultProjectDisplay();
            projectTasks ? displayAll(projectTasks) : tasksContainer.textContent = 'No tasks';
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
