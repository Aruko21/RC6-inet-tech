document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.start();
});

class App {
    constructor() {
        this.taskLists = [];
    }

    // Стрелочные функции - используют контекст класса App
    // Можно и сделать как обычные методы и забиндить в конструкторе
    addTask = (taskListId) => {
        let newTaskName = prompt("Describe your task:");

        if (!newTaskName) return;

        // Очистка пробелов слева и справа
        newTaskName = newTaskName.trim();

        if (!newTaskName) return;

        // Передаем массив, содержащий старые и новые задачи
        this.taskLists[taskListId].updateTasks([
            ...this.taskLists[taskListId].tasks,
            newTaskName
        ])

    };

    editTask = ({
        taskId,
        oldTaskName
    }) => {
        // TODO: oldTaskName зашился в самом начале - исправить
        let newTaskName = prompt("Enter new task description:", oldTaskName);

        if (!newTaskName) return;

        newTaskName = newTaskName.trim();

        if (!newTaskName || newTaskName === oldTaskName) return;

        document.getElementById(taskId)
            .querySelector(".card_description")
            .innerText = newTaskName;
    };

    moveTask = ({
        taskId,
        direction
    }) => {
        // Преобразование массива
        const [
            taskListIndex,
            taskIndex
        ] = taskId.split("_").map(n => Number(n))

        if (taskListIndex === 0 && direction === "left") return;
        if (taskListIndex === this.taskLists.length - 1 && direction === "right") return;

        const movedTask = this.taskLists[taskListIndex].tasks[taskIndex];
        // Если callback = true - заносим в новый массив
        const fromTasks = this.taskLists[taskListIndex].tasks
            .filter(task => task !== movedTask);

        this.taskLists[taskListIndex].updateTasks(fromTasks);

        if (direction === "left") {
            this.taskLists[taskListIndex - 1].updateTasks([
                ...this.taskLists[taskListIndex - 1].tasks,
                movedTask
            ])
        } else {
            this.taskLists[taskListIndex + 1].updateTasks([
                ...this.taskLists[taskListIndex + 1].tasks,
                movedTask
            ])
        }

    };

    removeTask = (taskId) => {
        const [
            taskListIndex,
            taskIndex
        ] = taskId.split("_").map(n => Number(n))

        const removedTask = this.taskLists[taskListIndex].tasks[taskIndex];
        // Если callback = true - заносим в новый массив
        const updatedTasks = this.taskLists[taskListIndex].tasks
            .filter(task => task !== removedTask);

        this.taskLists[taskListIndex].updateTasks(updatedTasks);
    };

    start() {
        const addTaskListButton = document.getElementById("add_list_button");
        const addTaskListInput = document.getElementById("add_list_input");

        addTaskListButton.addEventListener('click', () => {
            addTaskListButton.classList.add('item_big_text__inactive')
            addTaskListInput.classList.add('item_input__active');
        });

        addTaskListInput.addEventListener('keydown', (event) => {
            if (event.key === "Escape") {
                // Очистка input'а
                event.target.value = '';
                addTaskListButton.classList.remove('item_big_text__inactive')
                addTaskListInput.classList.remove('item_input__active');
                addTaskListInput.blur();
                // Если перехватили Esc - больше ничего не нужно делать
                return;
            }

            if (event.key === "Enter") {
                if (event.target.value) {
                    const taskList = new TaskList({
                        taskListName: event.target.value,
                        taskListId: this.taskLists.length,
                        addTask: this.addTask,
                        editTask: this.editTask,
                        moveTask: this.moveTask,
                        removeTask: this.removeTask
                    });

                    taskList.render();
                    this.taskLists.push(taskList);

                    event.target.value = "";
                } else {
                    addTaskListButton.classList.remove('item_big_text__inactive')
                    addTaskListInput.classList.remove('item_input__active');
                    addTaskListInput.blur();
                }
            }
        });
    }
}

class TaskList {
    constructor({
        taskListName,
        taskListId,
        addTask,
        editTask,
        moveTask,
        removeTask
    }) {
        this.taskListName = taskListName;
        this.taskListId = taskListId;
        this.tasks = [];
        this.addTask = addTask;
        this.editTask = editTask;
        this.moveTask = moveTask;
        this.removeTask = removeTask;
    }

    updateTasks(newTasks) {
        this.tasks = [...newTasks];
        this.renderTasks();
    }

    // getDirection() {
    //     const length = this.tasks.length;
    //
    //     if (index === 0) {
    //         return "right";
    //     } else if (index > 0 && index < (length - 1)) {
    //         return "both";
    //     } else if (index === length - 1) {
    //         return "left";
    //     } else {
    //         return "";
    //     }
    // }

    renderTasks() {
        const taskList = document.getElementById(`list_${this.taskListId}`);
        const tasksContainer = taskList.querySelector(".item_cards");
        tasksContainer.innerHTML = '';


        this.tasks.forEach((task, index) => {
            tasksContainer.appendChild((new Task({
                taskName: task,
                taskId: `${this.taskListId}_${index}`,
                editTask: this.editTask,
                moveTask: this.moveTask,
                removeTask: this.removeTask
            })).render())
        })

    }

    // Хотим добавить в DOM на основе того, что есть в объекте
    render() {
        const taskList = document.createElement('div');
        taskList.className = "board_item";
        taskList.id = `list_${this.taskListId}`;

        const taskWrapper = document.createElement('div');
        taskWrapper.className = "item_wrapper";
        taskList.appendChild(taskWrapper);

        const taskName = document.createElement('span');
        taskName.className = "item_title";
        taskName.innerText = this.taskListName
        taskWrapper.appendChild(taskName);

        const cardsContainer = document.createElement('div');
        cardsContainer.className = "item_cards";
        taskWrapper.appendChild(cardsContainer);

        const taskFooter = document.createElement('span');
        taskFooter.className = "item_text";
        taskFooter.innerText = "Add card...";
        // Пишем так, так как addTask принимает на вход аргумент
        taskFooter.addEventListener('click', () => this.addTask(this.taskListId));
        taskWrapper.appendChild(taskFooter);

        document.getElementById("tm_container").insertBefore(
            taskList,
            document.querySelector('.board_item:last-child')
        )
    }
}

class Task {
    constructor({
        taskName,
        taskId,
        editTask,
        moveTask,
        removeTask
    }) {
        this.taskName = taskName;
        this.taskId = taskId;
        this.editTask = editTask;
        this.moveTask = moveTask;
        this.removeTask = removeTask;
    }

    render() {
        const task = document.createElement('div');
        task.className = "card";
        task.id = this.taskId;

        const taskText = document.createElement('div');
        taskText.className = "card_description";
        taskText.innerText = this.taskName;
        task.appendChild(taskText);

        const sidebar = document.createElement('div');
        sidebar.className = "card_sidebar";

        const arrows = document.createElement('div');
        arrows.className = "sidebar_row";

        // if (this.moveDirection === "left" || this.moveDirection === "both") {
        const leftArrow = document.createElement('i');
        leftArrow.className = "sidebar_icon icon_l_arrow";
        leftArrow.addEventListener('click', () => this.moveTask({
            taskId: this.taskId,
            direction: 'left'
        }));
        arrows.appendChild(leftArrow);
        // }

        // if (this.moveDirection === "right" || this.moveDirection === "both") {
        const rightArrow = document.createElement('i');
        rightArrow.className = "sidebar_icon icon_r_arrow";
        rightArrow.addEventListener('click', () => this.moveTask({
            taskId: this.taskId,
            direction: 'right'
        }));
        arrows.appendChild(rightArrow);
        // }

        sidebar.appendChild(arrows);

        const editDelete = document.createElement('div');
        editDelete.className = "sidebar_row";

        const editButton = document.createElement('i');
        editButton.className = "sidebar_icon icon_edit";
        editButton.addEventListener('click', () => this.editTask({
            taskId: this.taskId,
            oldTaskName: this.taskName
        }));
        editDelete.appendChild(editButton);

        const delButton = document.createElement('i');
        delButton.className = "sidebar_icon icon_remove";
        delButton.addEventListener('click', () => this.removeTask(this.taskId));
        editDelete.appendChild(delButton);

        sidebar.appendChild(editDelete);

        task.appendChild(sidebar);

        return task
    }
}