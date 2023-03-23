import React from 'react';
import '../styles/SideBar.css'
import { Col } from "react-bootstrap";

function Sidebar() {
  return (
    <Col sm={3} md={2} lg={2} xl={1.5} className="sidebar">
      <ul>
        <li >
          <a href="#">Admin</a>
        </li>
        <li >
          <a href="#">Dashboard</a>
        </li>
        <li className='menu_btn'>
          <a href="/">Users</a>
        </li>
        <li className='menu_btn'>
          <a href="/pubs">Publishers</a>
        </li>
      </ul>
    </Col>
  );
}

export default Sidebar;