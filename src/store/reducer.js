import {
    ADD_TASKLIST,
    ADD_TASK,
    EDIT_TASK,
    MOVE_TASK_BACK,
    MOVE_TASK_FORWARD,
    REMOVE_TASK
} from './actions'

// Стартовое состояние приложения
const initialState = {
    taskLists: []
}

export default function reducer(state = initialState, {type, payload}) {
    switch (type) {
        case ADD_TASKLIST:
            return {
                ...state,
                taskLists: [
                    ...state.taskLists,
                    {
                        taskListName: payload,
                        tasks: []
                    }
                ]
            };

        case ADD_TASK:
            return {
                ...state,
                taskLists: state.taskLists.map(
                    (taskList, index) => index === payload.taskListId
                        ? ({...taskList, tasks: [...taskList.tasks, payload.taskName]})
                        : ({...taskList})
                )
            };

        case EDIT_TASK:
            return {
                ...state,
                taskLists: state.taskLists.map(
                    (taskList, index) => index !== payload.taskListId
                        ? {...taskList}
                        : {
                            ...taskList,
                            tasks: taskList.tasks.map(
                                (task, taskIndex) => taskIndex === payload.taskId
                                    ? payload.newTaskName
                                    : task
                            )
                        }
                )
            };

        case MOVE_TASK_BACK:
            if (payload.taskListId === 0) return state;
            // Переносимый Task
            const movedTaskBack = state.taskLists[payload.taskListId].tasks[payload.taskId];

            const fromTasksBack = state.taskLists[payload.taskListId]
                .tasks.filter(task => task !== movedTaskBack);

            return {
                ...state,
                taskLists: state.taskLists.map((taskList, index) => {
                    if (index === payload.taskListId) {
                        return {
                            ...taskList,
                            tasks: fromTasksBack
                        };
                    }

                    if (index === payload.taskListId - 1) {
                        return {
                            ...taskList,
                            tasks: [
                                ...taskList.tasks,
                                movedTaskBack
                            ]
                        };
                    }

                    // В любом другом случае
                    return {...taskList}
                })
            };

        case MOVE_TASK_FORWARD:
            // Правее двигать некуда
            if (payload.taskListId === state.taskLists.length - 1) return state;
            // Переносимый Task
            const movedTaskForward = state.taskLists[payload.taskListId].tasks[payload.taskId];

            const fromTasksForward = state.taskLists[payload.taskListId]
                .tasks.filter(task => task !== movedTaskForward);

            return {
                ...state,
                taskLists: state.taskLists.map((taskList, index) => {
                    if (index === payload.taskListId) {
                        return {
                            ...taskList,
                            tasks: fromTasksForward
                        };
                    }

                    if (index === payload.taskListId + 1) {
                        return {
                            ...taskList,
                            tasks: [
                                ...taskList.tasks,
                                movedTaskForward
                            ]
                        };
                    }

                    // В любом другом случае
                    return {...taskList}
                })
            };

        case REMOVE_TASK:
            return {
                ...state,
                taskLists: state.taskLists.map((taskList, index) => index === payload.taskListId
                    ? ({
                        ...taskList,
                        tasks: taskList.tasks.filter(
                            (task, taskIndex) => taskIndex !== payload.taskId
                        )
                    })
                    : { ...taskList }
                )
            };

        default:
            // Если пришел "левый" action - возвращаем старое состояние
            return state;
    }
}
