/*import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";

export default function ProjectTasks() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);

  const loadTasks = async () => {
    const res = await api.get(`/projects/${projectId}/tasks`);
    setTasks(res.data.data.tasks || []);
  };

  useEffect(() => {
    async function load() {
      const me = await api.get("/auth/me");
      setUser(me.data.data);
      await loadTasks();
    }
    load();
  }, []);

  return (
    <>
      <Navbar user={user} />
      <div style={{ padding: 20 }}>
        <h2>Tasks</h2>

        <TaskForm projectId={projectId} onCreated={loadTasks} />

        {tasks.length === 0 && <p>No tasks found.</p>}

        {tasks.map(t => (
          <div key={t.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
            <b>{t.title}</b>
            <p>Status: {t.status}</p>
          </div>
        ))}
      </div>
    </>
  );
}*/


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/projects").then((res) => {
      setProjects(res.data.data || []);
    });
  }, []);

  return (
    <>
      <Navbar />
      <h2>Projects</h2>

      {projects.length === 0 && <p>No projects found</p>}

      <ul>
        {projects.map((project) => (
          <li key={project.id} style={{ marginBottom: 10 }}>
            <strong>{project.name}</strong>
            <br />
            <Link to={`/projects/${project.id}/tasks`}>
              View Tasks
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

