import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Fuse from "fuse.js";
import { List, AddList, Tasks, Homepage } from "./components";
import listSvg from "./assets/img/list.svg";
import homeSvg from "./assets/img/home.svg";

function App() {
  const [lists, setLists] = useState(null);
  const [colors, setColors] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [searchResults, setSearchResults] = useState(null);

  let location = useLocation();
  let navigate = useNavigate();

  // Sorting an array by date from newest to oldest
  const sortArray = (data) => {
    let sortedData = data.sort(
      (a, b) =>
        new Date(...a.edited.split("-")) - new Date(...b.edited.split("-"))
    );
    return sortedData.reverse();
  };

  // Loading task lists from the json server
  useEffect(() => {
    axios
      .get("http://localhost:3010/lists?_expand=color&_embed=tasks")
      .then(({ data }) => {
        setLists(sortArray(data));
      });
    axios.get("http://localhost:3010/colors").then(({ data }) => {
      setColors(data);
    });
  }, []);

  // Opening task list by parsing url
  useEffect(() => {
    const listId = location.pathname.split("/lists/")[1];
    if (lists) {
      const list = lists.find((list) => list.id === Number(listId));
      setActiveItem(list);
    }
  }, [lists, location.pathname]);

  // Create a copy of the list for the search function. Fuse.js library used for searching.
  if (lists) {
    var fuse = new Fuse(lists, {
      keys: ["name"],
    });
  }

  // Add new task list
  const onAddList = (obj) => {
    const newList = [...lists, obj];
    setLists(newList);
    setSearchResults(newList);
  };

  // Set new edit date to task list and task, if they have been edited
  const onChangeEdited = async (listId, taskId) => {
    const time = new Date();
    const editTime =
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
      time.getSeconds();
    if (taskId) {
      await axios.patch(`http://localhost:3010/tasks/${taskId}`, {
        edited: editTime,
      });
    }
    await axios.patch(`http://localhost:3010/lists/${listId}`, {
      edited: editTime,
    });
  };

  // Add new task to the task list
  const onAddTask = async (listId, taskObj) => {
    if (taskObj.text) {
      const newList = lists.map((item) => {
        if (item.id === listId) {
          item.tasks = [...item.tasks, taskObj];
        }
        return item;
      });
      await setLists(newList);
      await onChangeEdited(listId, taskObj.id);
    }
  };

  // Mark the task completed and patch database
  const onCompleteTask = async (listId, taskId, completed) => {
    const newList = lists.map((list) => {
      if (list.id === listId) {
        list.tasks = list.tasks.filter((task) => {
          if (task.id === taskId) {
            task.completed = completed;
          }
          return task;
        });
      }
      return list;
    });
    setLists(newList);
    await axios.patch(`http://localhost:3010/tasks/${taskId}`, {
      completed,
    });
    onChangeEdited(listId, taskId);
  };

  // Set new task text and patch database
  const onEditTask = async (listId, taskObj) => {
    const newTaskText = window.prompt("Task text", taskObj.text);
    if (newTaskText) {
      const newList = lists.map((list) => {
        if (list.id === listId) {
          list.tasks = list.tasks.filter((task) => {
            if (task.id === taskObj.id) {
              task.text = newTaskText;
            }
            return task;
          });
        }
        return list;
      });
      setLists(newList);
      await axios.patch(`http://localhost:3010/tasks/${taskObj.id}`, {
        text: newTaskText,
      });
      onChangeEdited(listId, taskObj.id);
    }
  };

  // Delete task from task list
  const onRemoveTask = async (listId, taskId) => {
    if (window.confirm("Are you sure want to delete this task?")) {
      const newList = lists.map((list) => {
        if (list.id === listId) {
          list.tasks = list.tasks.filter((task) => task.id !== taskId);
        }
        return list;
      });
      setLists(newList);
      await axios.delete(`http://localhost:3010/tasks/${taskId}`);
      onChangeEdited(listId, null);
    }
  };

  // Set new list title
  const onEditListTitle = async (id, title) => {
    const newList = lists.map((item) => {
      if (item.id === id) {
        item.name = title;
      }
      return item;
    });
    setLists(newList);
    await axios.patch(`http://localhost:3010/lists/${id}`, {
      name: title,
    });
    onChangeEdited(id, null);
  };

  return (
    <div className="todo">
      <div className="todo__sidebar">
        <List
          onClickItem={() => {
            navigate(`/`);
          }}
          items={[
            {
              icon: <img src={homeSvg} alt="Homepage icon" />,
              name: "Home",
            },
          ]}
          activeItem={activeItem}
        />
        <List
          onClickItem={() => {
            navigate(`/lists`);
          }}
          items={[
            {
              icon: <img src={listSvg} alt="List icon" />,
              name: "All tasks",
            },
          ]}
          activeItem={activeItem}
        />
        <AddList onAdd={onAddList} colors={colors} />
        {/* Input for searching */}
        <input
          type="text"
          name="findBy"
          placeholder="Find list"
          onChange={(e) => {
            setSearchResults(
              fuse.search(e.target.value).map((result) => result.item)
            );
            if (e.target.value === "") setSearchResults(lists);
          }}
        />
        {/* If search is active, then render the search results, else render all lists */}
        {searchResults ? (
          <List
            items={searchResults}
            onRemove={(item) => {
              const newLists = lists.filter((list) => list.id !== item.id);
              setLists(newLists);
              setSearchResults(newLists);
            }}
            onClickItem={(item) => {
              navigate(`/lists/${item.id}`);
            }}
            activeItem={activeItem}
            isRemovable
          />
        ) : lists ? (
          <List
            items={lists}
            onRemove={(item) => {
              const newLists = lists.filter((list) => list.id !== item.id);
              setLists(newLists);
              setSearchResults(newLists);
            }}
            onClickItem={(item) => {
              navigate(`/lists/${item.id}`);
            }}
            activeItem={activeItem}
            isRemovable
          />
        ) : (
          "Loading..."
        )}
      </div>
      <div className="todo__tasks">
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          {/* Render tasks from all lists */}
          <Route
            exact
            path="/lists"
            element={
              lists &&
              lists.map((list) => {
                return (
                  <Tasks
                    key={list.id}
                    list={list}
                    onAddTask={onAddTask}
                    onEditTitle={onEditListTitle}
                    onRemoveTask={onRemoveTask}
                    onEditTask={onEditTask}
                    onCompleteTask={onCompleteTask}
                  />
                );
              })
            }
          />
          {/* Render tasks of a specific list */}
          <Route
            path={location.pathname}
            element={
              lists &&
              activeItem && (
                <Tasks
                  list={activeItem}
                  onAddTask={onAddTask}
                  onEditTitle={onEditListTitle}
                  onRemoveTask={onRemoveTask}
                  onEditTask={onEditTask}
                  onCompleteTask={onCompleteTask}
                />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
