import React, { useEffect, useState } from "react";
import Fuse from "fuse.js";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AddTaskForm from "./AddTaskForm";
import Task from "./Task";

import "./Tasks.scss";
import editSvg from "../../assets/img/edit.svg";

const Tasks = ({
  list,
  onEditTitle,
  onAddTask,
  onEditTask,
  onRemoveTask,
  onCompleteTask,
}) => {
  const [searchResults, setSearchResults] = useState(null);
  const [tasks, updateTasks] = useState(list.tasks);

  // Sorting an array by date from newest to oldest
  const sortArray = (data) => {
    let sortedData = data.sort((a, b) => {
      if (a.edited && b.edited) {
        return (
          new Date(...a.edited.split("-")) - new Date(...b.edited.split("-"))
        );
      } else return 0;
    });
    return sortedData.reverse();
  };

  // Setting tasks to another array to use drag and drop
  useEffect(() => {
    updateTasks(sortArray(list.tasks));
    setSearchResults(sortArray(list.tasks));
  }, [list.tasks]);

  // Drop handling and rearranging elements in array
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const itemsArray = Array.from(tasks);
    const [reorderItem] = itemsArray.splice(result.source.index, 1);
    itemsArray.splice(result.destination.index, 0, reorderItem);
    updateTasks(itemsArray);
  };

  // Drop handling and rearranging elements in array when search is active
  const handleSearchOnDragEnd = (result) => {
    if (!result.destination) return;
    const itemsArray = Array.from(searchResults);
    const [reorderItem] = itemsArray.splice(result.source.index, 1);
    itemsArray.splice(result.destination.index, 0, reorderItem);
    setSearchResults(itemsArray);
  };

  // Create a copy of the tasks for the search function. Fuse.js library used for searching.
  if (list.tasks) {
    var fuse = new Fuse(list.tasks, {
      keys: ["text"],
    });
  }

  // Change the title of the task list
  const editTitle = () => {
    const newTitle = window.prompt("List name", list.name);
    if (newTitle) {
      onEditTitle(list.id, newTitle);
    }
  };

  return (
    <div className="tasks">
      <h2 style={{ color: list.color.hex }} className="tasks__title">
        {list.name}
        <img
          onClick={() => {
            editTitle();
          }}
          src={editSvg}
          alt="edit icon"
        />
      </h2>
      <div className="tasks__items">
        {/* Input for searching */}
        <input
          type="text"
          name="findBy"
          placeholder="Find task"
          onChange={(e) => {
            setSearchResults(
              fuse.search(e.target.value).map((result) => result.item)
            );
            if (e.target.value === "") setSearchResults(tasks);
          }}
        />
        {list.tasks && !list.tasks.length && <h2>Here is no tasks yet</h2>}
        {/* If search is active, then render the search results, else render all tasks */}
        {searchResults ? (
          // Search results
          <div>
            <DragDropContext onDragEnd={handleSearchOnDragEnd}>
              <Droppable droppableId="list">
                {(provided) => (
                  <ul {...provided.droppableProps} ref={provided.innerRef}>
                    {list.tasks &&
                      searchResults.map((task, index) => {
                        return (
                          <Draggable
                            key={index}
                            draggableId={index.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <li
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                              >
                                <Task
                                  key={task.id}
                                  {...task}
                                  list={list}
                                  onEdit={onEditTask}
                                  onRemove={onRemoveTask}
                                  onComplete={onCompleteTask}
                                />
                              </li>
                            )}
                          </Draggable>
                        );
                      })}

                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        ) : (
          // All tasks
          <div>
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="list">
                {(provided) => (
                  <ul {...provided.droppableProps} ref={provided.innerRef}>
                    {list.tasks &&
                      tasks.map((task, index) => {
                        return (
                          <Draggable
                            key={index}
                            draggableId={index.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <li
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                              >
                                <Task
                                  key={task.id}
                                  {...task}
                                  list={list}
                                  onEdit={onEditTask}
                                  onRemove={onRemoveTask}
                                  onComplete={onCompleteTask}
                                />
                              </li>
                            )}
                          </Draggable>
                        );
                      })}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}
        {/* Add new task */}
        <AddTaskForm list={list} onAddTask={onAddTask} />
      </div>
    </div>
  );
};

export default Tasks;
