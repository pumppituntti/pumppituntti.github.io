import axios from "axios";
import React, { useState } from "react";
import addSvg from "../../assets/img/add.svg";

const AddTaskForm = ({ list, onAddTask }) => {
  const [visibleForm, setVisibleForm] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Changing the "add new task" form visibility
  const toggleFormVisible = () => {
    setVisibleForm(!visibleForm);
    setInputValue("");
  };

  // Add new task to the task list
  const addTask = () => {
    const obj = {
      listId: list.id,
      text: inputValue,
      completed: false,
    };

    if (obj.text) {
      axios.post("http://localhost:3010/tasks", obj).then(({ data }) => {
        onAddTask(list.id, data);
        toggleFormVisible();
      });
    } else {
      alert("This field should not be empty!");
    }
  };

  return (
    <div className="tasks__form">
      {!visibleForm ? (
        <div onClick={toggleFormVisible} className="tasks__form-new">
          <img src={addSvg} alt="add icon" />
          <span>New task</span>
        </div>
      ) : (
        <div className="tasks__form-block">
          <input
            className="field"
            type="text"
            placeholder="Task text"
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={addTask} className="button">
            Add new task
          </button>
          <button onClick={toggleFormVisible} className="button button--grey">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default AddTaskForm;
