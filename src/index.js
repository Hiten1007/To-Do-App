import { initial_page } from "./Routes/initial-page-load";
import { Project } from "./Routes/projects";
import { todoapp } from "./Routes/todo";
import './style.css';

const start = (() => {
    function init(){
        initial_page.addTask();
        initial_page.createDisplay();    
    }
    return { init };
    
})();

start.init();
