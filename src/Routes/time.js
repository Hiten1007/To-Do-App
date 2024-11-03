import { format, isWithinInterval, addDays } from "date-fns";
import { Project } from "./projects";

export const time = (() => {
    function formatTime(date) {
        return format(date, "yyyy-MM-dd");
    }

    function getTodayTasks() {
        const allTasks = JSON.parse(localStorage.getItem("All Tasks"));
        const today = formatTime(new Date());
        return allTasks !== null ? allTasks.filter(todo => todo.date === today) : null;
    }

    function getNext7Days() {
        const allTasks = JSON.parse(localStorage.getItem("All Tasks"));
        const today = new Date();
        const nextWeekStart = today;
        const nextWeekEnd = addDays(today, 7);

        return allTasks.filter(todo => {
            const todoDate = new Date(todo.date);
            return isWithinInterval(todoDate, { start: nextWeekStart, end: nextWeekEnd });
        });
    }

    return { formatTime, getTodayTasks, getNext7Days };
})();
