import { Link } from "react-router-dom";
import { navItems } from "../nav-items";

const Navbar = () => {
  return (
    <nav className="material-navbar p-2">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="Chibi Chef" className="h-12 w-auto" />
        </Link>
        <div className="flex space-x-4">
          {navItems.filter(item => !item.hidden && item.title !== "Home").map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-white hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-full transition-colors duration-300 flex items-center"
            >
              {item.icon}
              <span className="ml-1 hidden md:inline">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
