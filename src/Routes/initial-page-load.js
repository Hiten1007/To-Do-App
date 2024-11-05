import { todoapp } from "./todo.js";
import { Project } from "./projects.js";
import { time } from "./time.js";
import { secondsInHour } from "date-fns/constants";
import { add } from "date-fns/fp";

export const initial_page = (() => {
    function createDisplay() {
        const mainBox = document.querySelector("#mainContent");
        const header = createHeader("My To-Do", "h1");
        header.setAttribute("id", "head");
        mainBox.appendChild(header);

        const layout = document.createElement("div");
        layout.setAttribute("id", "layout");

        const sideBar = createSidebar();
        layout.appendChild(sideBar);

        const displayBox = document.createElement("div");
        displayBox.setAttribute("id", "display");

        layout.appendChild(displayBox);

        mainBox.appendChild(layout);
        
        const defaults = document.querySelector("#defaults");

        const all = createHeader("All Tasks", "h3");
        all.setAttribute("id", "AllTasks");
        defaults.appendChild(all);

        const today = createHeader("Today","h3");
        today.setAttribute("id", "today");
        defaults.appendChild(today);

        const next7 = createHeader("Next 7 Days", "h3");
        next7.setAttribute("id", "next7");
        defaults.appendChild(next7);

        Project.displayAllProjects();

        if(!localStorage.getItem("All Tasks")){
            populateStorage();
        } else{
            todoapp.displayTasks("All Tasks");
        }
        
        all.addEventListener("click", () =>{
            Project.setActiveProject("All Tasks");
            todoapp.displayTasks('All Tasks');
          
        });
        
        today.addEventListener("click", () =>{
            Project.setActiveProject('Today');
            todoapp.displayTasks("Today");
        });

        next7.addEventListener("click", () =>{
            Project.setActiveProject('Next 7 Days');
            todoapp.displayTasks("Next 7 Days"); 
        });
    }

    function populateStorage(){
        localStorage.setItem("All Tasks", JSON.stringify([]));
        todoapp.displayTasks("All Tasks");
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

        projectBox.appendChild(createHeader("Projects", "h2"));

        const addProjectB = document.createElement("div");
        addProjectB.setAttribute("id", "PAdd");
        const addProjectButton = createButton("+");
        addProjectButton.setAttribute("id", "addProjectButton");
        
        addProjectB.appendChild(addProjectButton);
        
        const addProjectText = document.createElement("div");
        addProjectText.textContent = "Add Project";
        addProjectB.appendChild(addProjectText);

        projectBox.appendChild(addProjectB);

        addProjectButton.addEventListener("click", () => {
            addProjectB.style.display = "none";
            addProject();
        });

        return projectBox;
    }

    function defaultProjectDisplay(){
        const displayBox = document.querySelector("#display");
        const addToDo = document.createElement("div");
        addToDo.setAttribute("id", "addToDo");

        const addTaskButton = createButton("+");
        addTaskButton.setAttribute("id", "addTaskB");
       
        addToDo.appendChild(addTaskButton);
        
        const addTaskText = document.createElement("div");
        addTaskText.textContent = "Add Task";
        addToDo.appendChild(addTaskText);

        displayBox.appendChild(addToDo);

        addTaskButton.addEventListener("click", () => {
            document.querySelector("dialog").showModal();
        })
    }

    function addProject(){
        const projectBox = document.querySelector("#projectBox");
        const addBox = document.createElement("div");
        addBox.setAttribute("id", "addPBox");

        const addBoxInput = document.createElement("input");
        addBoxInput.setAttribute("type", "text");
        addBoxInput.setAttribute("id", "nameP");
        addBoxInput.setAttribute("name", "nameP");
        addBox.appendChild(addBoxInput);

        const buttons = document.createElement("div");

        const submitButton = createButton("Add");
        submitButton.setAttribute("id", "submitP");


        submitButton.addEventListener("click", () =>{
            Project.createProject()
            .then((project) => {
                Project.setActiveProject(project);
                Project.createProjectDom(project);
                return todoapp.displayTasks(project);
            })
            .catch(function(err){//look to display it somewhere
                
                console.log(err);
            });

            document.querySelector("#PAdd").style.display = "block";  
            projectBox.removeChild(addBox); 
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
        const dlg = document.createElement("dialog");
        const taskBox = document.createElement("form");
        taskBox.setAttribute("method", "dialog");
    
        const title = document.createElement("div");
        title.appendChild(createLabel("title", "Title"));
        const titleInput = createInput("text", "title", "title");
       
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
       
        notes.appendChild(notesInput);
        taskBox.appendChild(notes);
    
        const add = createButton("Add");
        add.setAttribute("id", "addtoStorage");
    
        // Add the event listener directly to the `add` button
        add.addEventListener("click", () => {
            todoapp.createTodo()
            .then(function(project){
                taskBox.reset(); 
                dlg.close();      
                todoapp.displayTasks(project);
            })
            .catch(function(err){
                console.error("Error creating todo:", err);
            });
        });
    
        taskBox.appendChild(add);
        dlg.appendChild(taskBox);
        document.body.appendChild(dlg); 
    
       
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

    //make it later
    function createErrorBox(err){
        const popup = document.createElement("div");
        const heading = createHeader("Error", "h1");
        popup.appendChild(heading);

        const error = document.createElement("div");
        error.textContent = err;
        popup.appendChild(error);

        return popup;
    }


    return { createDisplay, defaultProjectDisplay, addProject, addTask, createErrorBox };
})();
