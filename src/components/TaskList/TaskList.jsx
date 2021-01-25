import React, {memo} from 'react';
import { connect } from 'react-redux'
import {
    addTaskAction
} from "../../store/actions";
import Task from "../Task/Task";

// memo - stateless component

// Параметр addTaskDispatch будет добавлен от диспетчера
const TaskList = ({
  taskListName,
  taskListId,
  tasks,
  addTaskDispatch
}) => {
    const addTask = () => {
        let taskName = prompt("Please, describe Your task");

        if (!taskName) return;

        taskName = taskName.trim();

        if (!taskName) return;

        addTaskDispatch({ taskListId, taskName })
    }

    return (
        <div className="board_item" id={`list_${taskListId}`}>
            <div className="item_wrapper">
            <span className="item_title">
                {taskListName}
            </span>
                <div className="item_cards">
                    {tasks.map((task, index) => (
                        <Task
                            taskName={task}
                            taskId={index}
                            taskListId={taskListId}
                            key={`list${taskListId}-task${index}`}
                        />
                    ))}
                </div>
                <span className="item_text" onClick={addTask}>
                Add card...
            </span>
            </div>
        </div>
    )
};

const mapDispatchToProps = dispatch => ({
   addTaskDispatch: ({ taskListId, taskName}) => dispatch(
       addTaskAction({ taskListId, taskName })
   )
});

export default connect(
    null,
    mapDispatchToProps
)(memo(TaskList));