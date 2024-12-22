import { initial_page } from "./Routes/initial-page-load";
import './style.css';

const start = (() => {
    function init(){
        initial_page.addTask();
        initial_page.createDisplay();    
    }
    return { init };
    
})();

start.init();
