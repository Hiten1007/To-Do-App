import { todoapp } from "./todo";

export const Project = (() => {

    const projects = new Map();
    projects.set("AllTasks", []);
    let ActiveProject = "AllTasks";

    function createProject(title, box){
        let text = "#" + box;
        const projectBox = document.querySelector(text);
    
        if (!projectBox) {
            console.error(`Project box with ID "${box}" not found.`);
            return null; 
        }
    
        const project = document.createElement("div");
        const projectTitle = document.createElement("h1");
        projectTitle.textContent = title;
        project.appendChild(projectTitle);
    
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            projectBox.removeChild(project);
            projects.delete(title);
            if (ActiveProject === title) {
                ActiveProject = "AllTasks"; 
                todoapp.displayTasks();
            }
        });
        project.appendChild(deleteButton);
    
        projectTitle.addEventListener("click", () => {
            setActiveProject(title);
            todoapp.displayTasks(); 
        });
    
        project.setAttribute("id", title.replace(/\s+/g, '_'));
        addProjects(title);
    
        projectBox.appendChild(project);
        return project;
    }

    function getActiveProject(){
        return ActiveProject;
    }

    function setActiveProject(project){
        ActiveProject = project;
    }

    function addProjects(title){
        projects.set(`${title}`, []);
    }

    function getProjects(){
        return projects;
    }

    return {createProject, setActiveProject, getActiveProject, getProjects, addProjects};

})();