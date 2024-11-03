import { initial_page } from "./Routes/initial-page-load";
import { Project } from "./Routes/projects";
import { todoapp } from "./Routes/todo";
import './style.css';

const start = (() => {
    function addAddEvents(){

        document.querySelector("#addTaskB").addEventListener("click", () =>{
            document.querySelector("#PAdd").display = "none";
            document.querySelector("dialog").showModal();
        });

       

        ["#AllTasks", "#today", "#next7"].forEach((id) =>{
            document.querySelector(id).addEventListener("click", () =>{
                if(id === "AllTasks"){
                    todoapp.displayTasks('All Tasks');
                    Project.setActiveProject("All Tasks");
                } else if(id === "#today"){
                    todoapp.displayTasks("Today");
                    Project.setActiveProject('Today');
                } else if(id === "#next7"){
                    todoapp.displayTasks("Next 7 Days");
                    Project.setActiveProject('Next 7 Days');
                }
            });
        });
    }
    return {addAddEvents};
})();


initial_page.createDisplay();
start.addAddEvents();