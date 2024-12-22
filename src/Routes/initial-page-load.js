import { todoapp } from "./todo.js";
import { Project } from "./projects.js";


export const initial_page = (() => {
    function createDisplay() {
        const mainBox = document.querySelector("#mainContent");
        const header = document.createElement("div");
        header.setAttribute("id", "header");
        const head = createHeader("My To-Do", "h1");
        head.setAttribute("id", "head");
        header.appendChild(head);
        const image = document.createElement("img");
        image.setAttribute("src", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBIbFK3q-mkhpctWHIUSq0EbrLPzzWoQ6Jzg&s");
        image.setAttribute("id", "headimg");
        header.appendChild(image);
        mainBox.appendChild(header);

        const partition1 = document.createElement("hr");
        partition1.style.color = " rgb(42, 189, 103)";
        mainBox.appendChild(partition1);
      

        const layout = document.createElement("div");
        layout.setAttribute("id", "layout");

        const sideBar = createSidebar();
        layout.appendChild(sideBar);

        const displayBox = document.createElement("div");
        displayBox.setAttribute("id", "display");

        layout.appendChild(displayBox);

        mainBox.appendChild(layout);
        
        const defaults = document.querySelector("#defaults");

        const all = document.createElement("div");
        const allhead = createHeader("All Tasks", "h3");
        allhead.setAttribute("id", "AllTasks");
        all.appendChild(allhead);

        const allimage = document.createElement("img");
        allimage.setAttribute("src", "https://khunhour.github.io/todo_list/images/inbox.png");
        allimage.setAttribute("class", "images");

        all.style.display = "flex";
        all.style.justifyContent = "space-between";
        all.appendChild(allimage);

        defaults.appendChild(all);

        const today = document.createElement("div");
        const todayhead = createHeader("Today","h3");
        todayhead.setAttribute("id", "today");
        today.appendChild(todayhead);

        const todayimage = document.createElement("img");
        todayimage.setAttribute("src", "https://khunhour.github.io/todo_list/images/today1.png");
        todayimage.setAttribute("class", "images");

        today.style.display = "flex";
        today.style.justifyContent = "space-between";
        today.appendChild(todayimage);

        
        defaults.appendChild(today);

        const next7 = document.createElement("div");
        const next7head = createHeader("Next 7 Days", "h3");
        next7head.setAttribute("id", "next7");
        next7.appendChild(next7head);

        const next7image = document.createElement("img");
        next7image.setAttribute("src", "https://khunhour.github.io/todo_list/images/week2.png");
        next7image.setAttribute("class", "images");

        next7.style.display = "flex";
        next7.style.justifyContent = "space-between";
        next7.appendChild(next7image);

      
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
        sideBar.setAttribute("id", "sidebar");

        const upperBox = document.createElement("div");
        upperBox.setAttribute("id", "defaults");
        const homeHead = createHeader("Home", "h2");
        upperBox.appendChild(homeHead);

        const partition2 = document.createElement("hr");
        upperBox.appendChild(partition2);


        sideBar.appendChild(upperBox);

        const projectBox = createProjectBox();
        sideBar.appendChild(projectBox);
    
        return sideBar;
    }

    function createProjectBox() {
        const projectBox = document.createElement("div");
        projectBox.setAttribute("id", "projectBox");

        projectBox.appendChild(createHeader("Projects", "h2"));
        const partition3 = document.createElement("hr");
        projectBox.appendChild(partition3);

        const addProjectB = document.createElement("div");
        addProjectB.setAttribute("id", "PAdd");
        

        const addProjectText = document.createElement("div");
        addProjectText.textContent = "Add Project";
        addProjectB.appendChild(addProjectText);

        const addProjectButton = createButton("+");
        addProjectButton.setAttribute("id", "addProjectButton");
        addProjectB.appendChild(addProjectButton);

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

        const addTaskText = document.createElement("div");
        addTaskText.textContent = "Add Task";
        addToDo.appendChild(addTaskText);

        const addTaskButton = createButton("+");
        addTaskButton.setAttribute("id", "addTaskB");
        addToDo.appendChild(addTaskButton);
        
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
        addBoxInput.setAttribute("placeholder", "Enter project name");
        addBox.appendChild(addBoxInput);

        const buttons = document.createElement("div");
        buttons.setAttribute("id", "customBs");
        

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
            document.querySelector("#PAdd").style.display = "block";
            projectBox.removeChild(addBox);
        });
        cancelButton.setAttribute("id", "cButton");
        buttons.appendChild(cancelButton);

        addBox.appendChild(buttons);

        projectBox.appendChild(addBox);

       
    }

    

    function addTask(){        
        const dlg = document.createElement("dialog");
        const taskBox = document.createElement("form");
        taskBox.setAttribute("method", "dialog");
    
        const title = document.createElement("div");
        title.classList.add("inputs");
        title.appendChild(createLabel("title", "Title: "));
        const titleInput = createInput("text", "title", "title");
        titleInput.setAttribute("placeholder", "(eg : Go Shopping)");
       
        title.appendChild(titleInput);
        taskBox.appendChild(title);
    
        const description = document.createElement("div");
        description.appendChild(createLabel("description", "Description: "));
        description.classList.add("inputs");
        const descriptionInput = createInput("text", "description", "description");
        descriptionInput.setAttribute("placeholder", "(eg : 4 egg crates, etc.)");
        description.appendChild(descriptionInput);
        taskBox.appendChild(description);
    
        const date = document.createElement("div");
        date.classList.add("inputs");
        date.appendChild(createLabel("date", "Date: "));
        const DateInput = createInput("date", "date", "date");
        date.appendChild(DateInput);
        taskBox.appendChild(date);
    
        const priority = createPriorityRadioButtons();
        taskBox.appendChild(priority);
    
        const notes = document.createElement("div");
        notes.classList.add("inputs");
        notes.appendChild(createLabel("notes", "Notes: "));
        const notesInput = createInput("text", "notes", "notes");
        notesInput.setAttribute("placeholder", "(eg : Buy groceries)");
       
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
        container.classList.add("inputs");

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
