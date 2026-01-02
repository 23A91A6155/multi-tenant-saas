import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function Tasks() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get(`/projects/${projectId}/tasks`)
      .then(res => {
        setTasks(res.data.data || []);
      })
      .catch(err => {
        console.error("Failed to load tasks", err);
      });
  }, [projectId]);

  return (
    <>
      <Navbar />

      <h2>Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <strong>{task.title}</strong> — {task.status}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
