/*import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";


export default function Dashboard() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/projects").then((res) => {
      setProjects(res.data.data || []);
    });
  }, []);

  return (
    <>
      <Navbar />
      <h1>Dashboard</h1>

      <div style={{ display: "flex", gap: 20 }}>
        <Card title="Total Projects" value={projects.length} />
        <Card title="Total Tasks" value={0} />
        <Card title="Completed Tasks" value={0} />
        <Card title="Pending Tasks" value={0} />
      </div>
    </>
  );
}

function Card({ title, value }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: 20, width: 200 }}>
      <h3>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
}*/

import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/projects");
        const projectList = res.data.data || [];
        setProjects(projectList);

        // 🔥 COUNT TASKS FROM EACH PROJECT
        let taskCount = 0;

        for (const project of projectList) {
          const taskRes = await api.get(`/projects/${project.id}/tasks`);
          taskCount += (taskRes.data.data || []).length;
        }

        setTotalTasks(taskCount);

      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <>
      <Navbar />
      <h1>Dashboard</h1>

      <div style={{ display: "flex", gap: 20 }}>
        <Card title="Total Projects" value={projects.length} />
        <Card title="Total Tasks" value={totalTasks} />
        <Card title="Pending Tasks" value={0} />
      </div>
    </>
  );
}

function Card({ title, value }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: 20, width: 200 }}>
      <h3>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
}
