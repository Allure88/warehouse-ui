import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="d-flex flex-column p-3 bg-light" style={{ width: '280px', height: '100vh' }}>
      <h5>Склад</h5>
      <ul className="nav flex-column mb-4">
        <li className="nav-item">
          <Link className="nav-link" to="/balance">Баланс</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/admission">Поступления</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/shipping">Отгрузки</Link>
        </li>
      </ul>

      <h5>Справочники</h5>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link" to="/clients">Клиенты</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/units">Единицы измерения</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/resources">Ресурсы</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;