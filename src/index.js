import { initial_page } from "./Routes/initial-page-load";
import { Project } from "./Routes/projects";
import { todoapp } from "./Routes/todo";
import './style.css';

const start = (() => {
    function addAddEvents(){

        

       

    }
    return {addAddEvents};
})();

initial_page.addTask();
initial_page.createDisplay();

start.addAddEvents();