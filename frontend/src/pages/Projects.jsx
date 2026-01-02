/*import { useEffect, useState } from "react";
import api from "../api/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data.data); // ✅ FIX IS HERE
      } catch (err) {
        console.error("Failed to load projects", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p>Loading projects...</p>;

  if (projects.length === 0) {
    return <p>No projects found</p>;
  }

  return (
    <div>
      <h2>Projects</h2>
      {projects.map((p) => (
        <div key={p.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <h3>{p.name}</h3>
          <p>{p.description}</p>
        </div>
      ))}
    </div>
  );
}*/

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // ✅ ADD THIS

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data.data || []);
      } catch (err) {
        console.error("Failed to load projects", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p>Loading projects...</p>;

  if (projects.length === 0) {
    return <p>No projects found</p>;
  }

  return (
    <>
      <Navbar />

      <h2>Projects</h2>

      {projects.map((project) => (
        <div
          key={project.id}
          style={{
            border: "1px solid #ccc",
            margin: 10,
            padding: 10
          }}
        >
          <h3>{project.name}</h3>
          <p>{project.description}</p>

          {/* ✅ VIEW TASKS BUTTON */}
          <button
            onClick={() => navigate(`/projects/${project.id}/tasks`)}
          >
            View Tasks
          </button>
        </div>
      ))}
    </>
  );
}

