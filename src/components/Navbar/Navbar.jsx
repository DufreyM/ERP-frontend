import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ items }) => {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        {items.map(({ label, to, icon: Icon }) => (
          <li key={to} className="nav-item">
            {Icon && <Icon className="nav-icon" />}
            <NavLink
              to={to}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
