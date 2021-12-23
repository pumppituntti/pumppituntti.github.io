import React from "react";
import axios from "axios";
import classNames from "classnames";
import Badge from "../Badge";

import "./List.scss";
import removeSvg from "../../assets/img/remove.svg";

// The list is used in the sidebar for rendering task lists and other elements ("home", "info" and "add new list" buttons)
const List = ({
  items,
  isRemovable,
  onClick,
  onRemove,
  onClickItem,
  activeItem,
}) => {
  // Delete task list
  const removeList = async (item) => {
    if (
      window.confirm(`Are you sure want to delete the "${item.name}" list?`)
    ) {
      await axios.delete(`http://localhost:3010/lists/${item.id}`).then(() => {
        onRemove(item);
      });
    }
  };

  return (
    <ul className="list" onClick={onClick}>
      {items.map((item, index) => (
        <li
          key={index}
          className={classNames(item.className, {
            active: activeItem && activeItem.id === item.id,
          })}
          onClick={onClickItem ? () => onClickItem(item) : null}
        >
          <i> {item.icon ? item.icon : <Badge color={item.color.name} />}</i>
          <span>{item.name}</span>
          {isRemovable && (
            <img
              className="list__remove-icon"
              src={removeSvg}
              alt="remove icon"
              onClick={() => removeList(item)}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default List;
