import "./Navbar.css";
import { ButtonsNavbar }  from "./ButtonsNavbar/ButtonsNavbar";


const Navbar = ({ items }) => {
  return (
    <nav className="navbar">
    

       <div className="opcionesNavBar">
        {items.map(({ label, to, icon }, index) => (
         
            <ButtonsNavbar
              key={index}
              icono = {icon}
              text = {label}
              to = {to}
            />
           
          
        ))}
      </div>
      
    </nav>
  );
};

export default Navbar;
