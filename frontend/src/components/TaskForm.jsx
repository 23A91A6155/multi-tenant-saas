import { useState } from "react";
import api from "../api/api";

export default function TaskForm({ projectId, onCreated }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post(`/projects/${projectId}/tasks`, {
        title,
        priority: "medium"
      });
      setTitle("");
      onCreated();
    } catch (err) {
      alert("Task creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <button disabled={loading}>
        {loading ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}
