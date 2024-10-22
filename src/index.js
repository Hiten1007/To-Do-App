import { initial_page } from "./Routes/initial-page-load";

const start = (() => {
    function init(){
        document.addEventListener("DOMContentLoaded", () => {
            initial_page.createDisplay();
            initial_page.defaultProjectDisplay();
        });
    }

    return { init };
})();


start.init();
