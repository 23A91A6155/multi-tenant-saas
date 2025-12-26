import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get(`/projects/${projectId}/tasks`).then((res) => {
      setTasks(res.data.data || []);
    });
  }, [projectId]);

  return (
    <>
      <Navbar />
      <h2>Project Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks</p>
      ) : (
        <ul>
          {tasks.map((t) => (
            <li key={t.id}>{t.title}</li>
          ))}
        </ul>
      )}
    </>
  );
}
