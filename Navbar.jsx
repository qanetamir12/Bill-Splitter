import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <span className="brand">💰 Bill Splitter</span>
      <div className="nav-links">
        {user ? (
          <>
            <NavLink to="/" end>Split</NavLink>
            <NavLink to="/history">History</NavLink>
            <span className="nav-user">Hi, {user.name}</span>
            <button className="btn btn-light" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Sign up</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
