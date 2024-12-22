import { todoapp } from "./todo";

export const Project = (() => {

  let activeProject = "All Tasks";
  function createProject(){
        const pr = new Promise(function(resolve, reject){
            if(!validateProject()){
                const errMessage = new Error("Title not written");
                reject(errMessage);
            } else if (!storageAvailable("localStorage")) {
                const errMessage = new Error("LocalStorage Not Available");
                reject(errMessage);
            } else {
              const projectName = document.querySelector("#nameP").value.trim();
              localStorage.setItem(`${projectName}`, JSON.stringify([]));
              resolve(projectName);
            }
        });

        return pr;
    }

    function validateProject(){
       const projectName = document.querySelector("#nameP").value.trim();
       return projectName !== "" && !localStorage.getItem(projectName);
    }
    function storageAvailable(type) {
        let storage;
        try {
          storage = window[type];
          const x = "__storage_test__";
          storage.setItem(x, x);
          storage.removeItem(x);
          return true;
        } catch (e) {
          return (
            e instanceof DOMException &&
            e.name === "QuotaExceededError" &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
          );
        }
      }

      function createProjectDom(project){
        const projectBigBox = document.querySelector("#projectBox")
        
        const projectB = document.createElement("div");

        const title = document.createElement("h3");
        title.textContent = project;
        projectB.appendChild(title);

        const deleteB = document.createElement("button");
        deleteB.textContent = "Delete";
        deleteB.classList.add("deleteB");
        deleteB.addEventListener("click", (e) => {
          e.stopPropagation(); // Prevent triggering displayTasks when deleting
  
          // Remove project element from DOM
          projectBigBox.removeChild(projectB);
  
          // Remove project from localStorage by its title key
          const tasks = JSON.parse(localStorage.getItem(project));
          let allTasks = JSON.parse(localStorage.getItem("All Tasks"));
          allTasks = allTasks.filter(todo => 
            !tasks.some(projectTask => projectTask.title === todo.title && projectTask.dueDate === todo.dueDate)
          );
          localStorage.removeItem(project);
          
          localStorage.setItem("All Tasks", JSON.stringify(allTasks));
          todoapp.displayTasks("All Tasks");
      });
      
        projectB.appendChild(deleteB);
        
        projectB.addEventListener("click", () =>{
          Project.setActiveProject(project);
          todoapp.displayTasks(project);
        })

        projectBigBox.appendChild(projectB);
      }

      function displayAllProjects(){
        const projects = Object.keys(localStorage).filter(key => key !== "All Tasks");
        projects.forEach(project => createProjectDom(project));
      }

      function getActiveProject(){
        return activeProject;
      }

      function setActiveProject(project){
        activeProject = project;
      }
      return {createProject, getActiveProject, setActiveProject, createProjectDom, storageAvailable, displayAllProjects};
      
})();
