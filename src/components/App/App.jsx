import React, {Fragment, PureComponent} from "react";
import { connect } from "react-redux";
import {
    addTaskListAction
} from "../../store/actions";
import TaskList from "../TaskList/TaskList";
import './App.css';

// Fragment - обертка react-компонента, не добавляющая ничего в дом
// PureComponent отличается от Component функцией render (у PureComponent есть внутреннее состояние)
// Если новые данные не изменяют отображение компонента - он кэшируется и не меняет отрисовку
class App extends PureComponent {
    // Все, что пишем в state - будет добавлено в this
    state = {
        isInputActive: false,
        taskListName: ""
    };

    // Автоматически привязваем к контексту this этого класса
    showInput = () => this.setState({isInputActive: true});

    onTaskListNameInput = (value) => this.setState({
        taskListName: value
    });

    handleKeyDown = (event) => {
        if (event.key === "Escape") {
            this.setState({
                isInputActive: false,
                taskListName: ""
            });

            return;
        }

        if (event.key === "Enter") {
            const { taskListName } = this.state;

            if (taskListName) {
                this.props.addTaskListDispatch(taskListName);
                this.setState({
                    taskListName: ""
                });
            }

            this.setState({isInputActive: false});
        }
    };

    // render возврашает react component
    render() {
        const {
            isInputActive,
            taskListName
        } = this.state

        const { taskLists } = this.props

        return (
            <Fragment>
                <header>
                    <div className="header_wrapper">
                        <div className="header_logo">
                            Custom task manager
                        </div>
                        <div className="header_profile">
                    <span className="profile_name">
                        Aruko
                    </span>
                            <img src="../../img/eleina_pic.png" alt="avatar" className="profile_avatar"/>
                        </div>
                    </div>
                </header>
                <main>
                    <div className="board_wrapper" id="tm_container">
                        <Fragment>
                            {taskLists.map(({ taskListName, tasks}, index) => (
                                <TaskList
                                    taskListName={taskListName}
                                    taskListId={index}
                                    tasks={tasks}
                                    key={`list${index}`}
                                />
                            ))}
                        </Fragment>
                        <div className="board_item board_item__inactive">
                            <div className="item_wrapper">
                                <span
                                    className={isInputActive ? "item_big_text item_big_text__inactive" : "item_big_text"}
                                    id="add_list_button"
                                    onClick={this.showInput}>
                                    Add list
                                </span>
                                <input type="text" name="list_name" placeholder="Your list name"
                                       className={isInputActive ? "item_input item_input__active" : "item_input"}
                                       id="add_list_input"
                                       onChange={({target: {value}}) => this.onTaskListNameInput(value)}
                                       onKeyDown={this.handleKeyDown}
                                       value={taskListName}
                                />
                            </div>
                        </div>

                    </div>
                </main>
            </Fragment>
        );
    }
}

// На вход приходит текущее состояние store
// Возвращаем объект с полем taskLists. Это будет добавлено в props
// Создавая эту функцию - подписываемся на обновления store
const mapStateToProps = ({ taskLists }) => ({ taskLists });

const mapDispatchToProps = dispatch => ({
    addTaskListDispatch: (taskListName) => dispatch(addTaskListAction(taskListName))
});
// connect возвращает функцию
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
