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

    function createTodo(title, description, dueDate, priority, notes) {
        const newTodo = new Task(title, description, dueDate, priority, notes);
        if (Project.getActiveProject() !== "AllTasks") {
            Project.getProjects().get(Project.getActiveProject()).push(newTodo);
        }
        Project.getProjects().get("AllTasks").push(newTodo);   
        displayTasks(); 
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

        return newToDo;
    }

    function displayAll(tasks) {
        const displayBox = document.querySelector("#display");
        tasks.forEach((task) => {
            const taskElement = createTaskElement(task);
            displayBox.appendChild(taskElement);
        });
    }

    const displayTasks = () => {
        const activeProject = Project.getActiveProject();
        const tasksContainer = document.querySelector("#display"); 
    
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
            const projectTasks = Project.getProjects().get(Project.getActiveProject());
            initial_page.defaultProjectDisplay();
            displayAll(projectTasks);
        }
    };

    return { createTodo, displayTasks };
})();
