const ADD_TASKLIST = "ADD_TASKLIST";
const ADD_TASK = "ADD_TASK";
const EDIT_TASK = "EDIT_TASK";
const MOVE_TASK_BACK = "MOVE_TASK_BACK";
const MOVE_TASK_FORWARD = "MOVE_TASK_FORWARD";
const REMOVE_TASK = "REMOVE_TASK";

const addTaskListAction = (taskListName) => ({
    type: ADD_TASKLIST,
    payload: taskListName
});

const addTaskAction = ({ taskListId, taskName }) => ({
    type: ADD_TASK,
    payload: {
        taskListId,
        taskName
    }
});

const editTaskAction = ({ taskListId, taskId, newTaskName }) => ({
    type: EDIT_TASK,
    payload: {
        taskListId,
        taskId,
        newTaskName
    }
});

const moveTaskBackAction = ({ taskListId, taskId }) => ({
    type: MOVE_TASK_BACK,
    payload: {
        taskListId,
        taskId
    }
})

const moveTaskForwardAction = ({ taskListId, taskId }) => ({
    type: MOVE_TASK_FORWARD,
    payload: {
        taskListId,
        taskId
    }
})

const removeTaskAction = ({ taskListId, taskId}) => ({
    type: REMOVE_TASK,
    payload: {
        taskListId,
        taskId
    }
});

export {
    ADD_TASKLIST,
    ADD_TASK,
    EDIT_TASK,
    MOVE_TASK_BACK,
    MOVE_TASK_FORWARD,
    REMOVE_TASK,
    addTaskListAction,
    addTaskAction,
    editTaskAction,
    moveTaskBackAction,
    moveTaskForwardAction,
    removeTaskAction
}