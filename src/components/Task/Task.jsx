import React, {memo} from 'react';
import { connect } from 'react-redux'
import {
    editTaskAction,
    moveTaskBackAction,
    moveTaskForwardAction,
    removeTaskAction
} from "../../store/actions";

const Task = ({
  taskName,
  taskId,
  taskListId,
  editTaskDispatch,
  moveTaskBackDispatch,
  moveTaskForwardDispatch,
  removeTaskDispatch
}) => {
    const editTask = () => {
        let newTaskName = prompt("Enter new task description", taskName);

        if (!newTaskName) return;

        newTaskName = newTaskName.trim();

        if (!newTaskName || newTaskName === taskName) return;

        editTaskDispatch({ taskListId, taskId, newTaskName });
    }

    const removeTask = () => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm(`Are you sure that you want to delete task ${taskName}?`)) {
            removeTaskDispatch({ taskListId, taskId });
        }
    };

    return (
        <div className="card" id={`${taskListId}-${taskId}`}>
            <div className="card_description">
                {taskName}
            </div>
            <div className="card_sidebar">
                <div className="sidebar_row">
                    <i className="sidebar_icon icon_l_arrow"
                       onClick={() => moveTaskBackDispatch({ taskListId, taskId })}
                    />
                    <i className="sidebar_icon icon_r_arrow"
                       onClick={() => moveTaskForwardDispatch({ taskListId, taskId })}
                    />
                </div>
                <div className="sidebar_row">
                    <i className="sidebar_icon icon_edit"
                       onClick={editTask}
                    />
                    <i className="sidebar_icon icon_remove"
                       onClick={removeTask}
                    />
                </div>
            </div>
        </div>
    );
};

const mapDispatchToProps = dispatch => ({
    editTaskDispatch: ({
        taskListId, taskId, newTaskName
    }) => dispatch(editTaskAction({ taskListId, taskId, newTaskName })),
    moveTaskBackDispatch: ({
        taskListId, taskId
    }) => dispatch(moveTaskBackAction({ taskListId, taskId })),
    moveTaskForwardDispatch: ({
        taskListId, taskId
    }) => dispatch(moveTaskForwardAction({ taskListId, taskId })),
    removeTaskDispatch: ({
        taskListId, taskId
    }) => dispatch(removeTaskAction({ taskListId, taskId })),
});

// Подключаться напрямую к store, чтобы вытаскивать что-то оттуда, не нужно, поэтому первый параметр - null
export default connect(
    null,
    mapDispatchToProps
)(memo(Task));
