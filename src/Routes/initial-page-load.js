import { todoapp } from "./todo.js";
import { Project } from "./projects.js";
import { time } from "./time.js";

export const initial_page = (() => {
    function createDisplay() {
        const mainBox = document.querySelector("#mainContent");

        mainBox.appendChild(createHeader("My To-Do", "h1"));

        const layout = document.createElement("div");

        const sideBar = createSidebar();
        layout.appendChild(sideBar);

        const displayBox = document.createElement("div");
        displayBox.setAttribute("id", "display");
        layout.appendChild(displayBox);

        mainBox.appendChild(layout);
        
        ["All Tasks", "Today", "Next 7 Days"].forEach(projectName => {
            Project.createProject(projectName, "defaults");
            
        });
    }

    function createSidebar() {
        const sideBar = document.createElement("div");
        const upperBox = document.createElement("div");
        upperBox.setAttribute("id", "defaults");

      
        sideBar.appendChild(upperBox);

        const projectBox = createProjectBox();
        sideBar.appendChild(projectBox);
    
        return sideBar;
    }

    function createProjectBox() {
        const projectBox = document.createElement("div");
        projectBox.setAttribute("id", "projectBox");

        console.log("Project Box Created:", projectBox); 

        projectBox.appendChild(createHeader("Projects", "h2"));

        const addProjectB = document.createElement("div");
        const addProjectButton = createButton("+");
        
        addProjectButton.addEventListener("click", addProject);
        addProjectB.appendChild(addProjectButton);
        
        const addProjectText = document.createElement("div");
        addProjectText.textContent = "Add Project";
        addProjectB.appendChild(addProjectText);

        projectBox.appendChild(addProjectB);

        return projectBox;
    }

    function createHeader(text, size){
        const header = document.createElement(size);
        header.textContent = text;
        return header;
    }

    function createButton(text){
        const button = document.createElement("button");
        button.textContent = text;
        return button;
    }

    function defaultProjectDisplay(){
        const displayBox = document.querySelector("#display");
        const addToDo = document.createElement("div");

        const addTaskButton = createButton("+");
        addTaskButton.addEventListener("click", () =>{
            addTask();
        });
        addToDo.appendChild(addTaskButton);
        
        const addTaskText = document.createElement("div");
        addTaskText.textContent = "Add Task";
        addToDo.appendChild(addTaskText);

        displayBox.appendChild(addToDo);
    }

    function addProject(){
        const projectBox = document.querySelector("#projectBox");
        const addBox = document.createElement("div");

        const addBoxInput = document.createElement("input");
        addBoxInput.setAttribute("type", "text");
        addBoxInput.setAttribute("id", "nameP");
        addBoxInput.setAttribute("name", "nameP");
        addBox.appendChild(addBoxInput);

        const buttons = document.createElement("div");

        const submitButton = createButton("Add");
        submitButton.addEventListener("click", (event) => {
            event.preventDefault();
            if (addBoxInput.value) {
                Project.createProject(addBoxInput.value, "projectBox");
                projectBox.removeChild(addBox);
            }
        });
        buttons.appendChild(submitButton);

        const cancelButton = createButton("Cancel");
        cancelButton.addEventListener("click", () => {
            projectBox.removeChild(addBox);
        });
        buttons.appendChild(cancelButton);

        addBox.appendChild(buttons);

        projectBox.appendChild(addBox);
    }

    function addTask(){
        const displayBox = document.querySelector("#display"); 
        const taskBox = document.createElement("form");
        taskBox.setAttribute("method", "get");
    
        const title = document.createElement("div");
        title.appendChild(createLabel("title", "Title"));
        const titleInput = createInput("text", "title", "title");
        titleInput.setAttribute("required", true);
        title.appendChild(titleInput);
        taskBox.appendChild(title);
    
        const description = document.createElement("div");
        description.appendChild(createLabel("description", "Description"));
        const descriptionInput = createInput("text", "description", "description");
        description.appendChild(descriptionInput);
        taskBox.appendChild(description);
    
        const date = document.createElement("div");
        date.appendChild(createLabel("date", "Date"));
        const DateInput = createInput("date", "date", "date");
        date.appendChild(DateInput);
        taskBox.appendChild(date);
    
        const priority = createPriorityRadioButtons();
        taskBox.appendChild(priority);
    
        const notes = document.createElement("div");
        notes.appendChild(createLabel("notes", "Notes"));
        const notesInput = createInput("text", "notes", "notes");
        notesInput.setAttribute("required", true);
        notes.appendChild(notesInput);
        taskBox.appendChild(notes);
    
        const add = createButton("Add");
        add.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent the default form submission
            
            getTodoInputValues(); // Get the input values
    
            // Check if taskBox is a child of displayBox before removing
            if (displayBox.contains(taskBox)) {
                displayBox.removeChild(taskBox); // Safely remove taskBox
            } else {
                console.warn("taskBox is not a child of displayBox");
            }
    
            taskBox.reset(); // Reset the form fields
        });
    
        taskBox.appendChild(add);
        displayBox.appendChild(taskBox);
    }

    function createInput(type, id, names){        
        const input = document.createElement("input");
        input.setAttribute("type", type);
        input.setAttribute("id", id);
        input.setAttribute("name", names);

        return input;
    }

    function createLabel(forText, text){
        const label = document.createElement("label");
        label.setAttribute("for", forText);
        label.textContent = text;
        return label;
    }

    function createPriorityRadioButtons() {
        const container = document.createElement("div");
        container.setAttribute("id", "priorityRadioContainer");

        const label = document.createElement("label");
        label.textContent = "Priority: ";
        container.appendChild(label);

        const priorities = ["low", "medium", "high"];

        priorities.forEach((priority) => {
            const radio = createInput("radio", `priority-${priority}`, "priority");
            radio.setAttribute("value", priority);

            const radioLabel = createLabel(`priority-${priority}`, priority.charAt(0).toUpperCase() + priority.slice(1));
            container.appendChild(radio);
            container.appendChild(radioLabel);
        });

        return container;
    }

    function getTodoInputValues() {
        const title = document.querySelector("#title").value;
        const description = document.querySelector("#description").value;
        const dueDate = time.formatTime(document.querySelector("#date").value);

        const selectedPriority = document.querySelector('input[name="priority"]:checked');
        const priority = selectedPriority ? selectedPriority.value : "low";

        const notes = document.querySelector("#notes").value;
 
        if (title && description && dueDate && priority && notes) {
            todoapp.createTodo(title, description, dueDate, priority, notes);
        }
       
    }

    return { createDisplay, defaultProjectDisplay };
})();