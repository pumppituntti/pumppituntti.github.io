import React, { useEffect, useState } from "react";
import List from "../List";
import "./AddListButton.scss";
import Badge from "../Badge";

import closeSvg from "../../assets/img/close.svg";
import axios from "axios";

const AddList = ({ colors, onAdd }) => {
  const [visiblePopup, setVisiblePopup] = useState(false);
  const [selectedColor, selectColor] = useState(1);
  const [inputValue, setInputValue] = useState("");

  // Set the default badge color (the first color from the list)
  useEffect(() => {
    if (Array.isArray(colors)) {
      selectColor(colors[0].id);
    }
  }, [colors]);

  // Closing the popup add list box
  const onClose = () => {
    setVisiblePopup(false);
    setInputValue("");
    selectColor(colors[0].id);
  };

  // Add a new task list
  const addList = () => {
    if (!inputValue) {
      alert("The list name field should not be empty!");
      return;
    }
    const time = new Date();
    axios
      .post("http://localhost:3010/lists", {
        name: inputValue,
        colorId: selectedColor,
        edited:
          time.getFullYear() +
          "-" +
          (time.getMonth() + 1) +
          "-" +
          time.getDate() +
          "-" +
          time.getHours() +
          "-" +
          time.getMinutes() +
          "-" +
          time.getSeconds(),
      })
      .then(({ data }) => {
        const color = colors.filter((color) => color.id === selectedColor)[0];
        const newObj = { ...data, color, tasks: [] };
        onAdd(newObj);
        onClose();
      });
  };

  return (
    <div className="add-list">
      <List
        onClick={() => setVisiblePopup(true)}
        items={[
          {
            className: "list__add-button",
            // Add list icon
            icon: (
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 1V15"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1 8H15"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
            name: "Add new list",
          },
        ]}
      />
      {visiblePopup && (
        <div className="add-list__popup">
          <img
            src={closeSvg}
            alt="close button"
            className="add-list__popup-close-btn"
            onClick={() => onClose()}
          />
          {/* Input for list name */}
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            type="text"
            placeholder="List name"
          />
          {/* Choosing a badge color */}
          <div className="add-list__popup-colors">
            {colors.map((color) => (
              <Badge
                onClick={() => selectColor(color.id)}
                key={color.id}
                color={color.name}
                className={selectedColor === color.id && "active"}
              />
            ))}
          </div>
          <button onClick={addList} className="button">
            Add
          </button>
        </div>
      )}
    </div>
  );
};

export default AddList;
