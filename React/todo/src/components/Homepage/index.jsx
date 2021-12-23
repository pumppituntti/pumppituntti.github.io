import React from "react";
import "./Homepage.scss";

const Homepage = () => {
  return (
    <div className="homepage">
      <h2 className="homepage__title">TODO</h2>
      <p>
        Welcome to TODO! <br /> To add a new task list, click on the{" "}
        <i>"Add new list"</i> icon on the right side. <br />
        Click on the list to open it for viewing or editing.
      </p>
    </div>
  );
};

export default Homepage;
