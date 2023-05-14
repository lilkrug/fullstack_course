import React, { useState } from "react";
import { Link } from "react-router-dom";

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown">
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        Open Menu
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          <li>
            <Link to="/creatematch">Create A Match</Link>
          </li>
          <li>
            <Link to="/createteam">Create A Team</Link>
          </li>
          <li>
            <Link to="/createplayer">Create A Player</Link>
          </li>
          <li>
            <Link to="/updateplayer">Update A Player</Link>
          </li>
          <li>
            <Link to="/updatematch">Update A Match</Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
