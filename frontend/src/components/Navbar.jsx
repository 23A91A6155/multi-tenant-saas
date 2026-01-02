/*import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tenantId");
    navigate("/");
  };

  return (
    <div
      style={{
        background: "#222",
        padding: 15,
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
     /* {/* LEFT MENU */
      /*<div>
        <Link to="/dashboard" style={linkStyle}>
          Dashboard
        </Link>
        <Link to="/projects" style={linkStyle}>
          Projects
        </Link>
        <Link to="/users" style={linkStyle}>
          Users
        </Link>
      </div>

      {/* RIGHT MENU */
     /* <button onClick={handleLogout} style={logoutStyle}>
        Logout
      </button>
    </div>
  );
}

const linkStyle = {
  color: "#fff",
  marginRight: 20,
  textDecoration: "none"
};

const logoutStyle = {
  background: "red",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  cursor: "pointer"
};*/


import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Detect if user is inside a project
  const isInProject = location.pathname.includes("/projects/");

  return (
    <div
      style={{
        background: "#222",
        padding: 15,
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      {/* LEFT MENU */}
      <div>
        <Link to="/dashboard" style={linkStyle}>
          Dashboard
        </Link>

        <Link to="/projects" style={linkStyle}>
          Projects
        </Link>

        <Link to="/users" style={linkStyle}>
          Users
        </Link>

        {/* Show Tasks link only inside project */}
        {isInProject && (
          <span style={{ color: "#aaa", marginLeft: 10 }}>
            Tasks
          </span>
        )}
      </div>

      {/* RIGHT MENU */}
      <button onClick={handleLogout} style={logoutStyle}>
        Logout
      </button>
    </div>
  );
}

const linkStyle = {
  color: "#fff",
  marginRight: 20,
  textDecoration: "none"
};

const logoutStyle = {
  background: "red",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  cursor: "pointer"
};


