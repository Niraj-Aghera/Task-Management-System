"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function TasksPage() {
  const router = useRouter()

  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch("http://localhost:8000/api/v1/tasks/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (err) {
      console.error("Failed to fetch tasks", err)
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const token = localStorage.getItem("token")
    try {
      const response = await fetch("http://localhost:8000/api/v1/tasks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      })

      if (response.ok) {
        setTitle("")
        setDescription("")
        fetchTasks()
      } else {
        setError("Failed to create task")
      }
    } catch {
      setError("Unable to connect to server")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleComplete = async (task) => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/tasks/${task.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            is_completed: !task.completed,
          }),
        }
      )
      if (response.ok) fetchTasks()
    } catch (err) {
      console.error("Failed to update task", err)
    }
  }

  const handleEditTask = (task) => {
    setEditingTaskId(task.id)
    setEditTitle(task.title)
    setEditDescription(task.description || "")
  }

  const handleSaveTask = async (taskId) => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editTitle,
            description: editDescription,
          }),
        }
      )
      if (response.ok) {
        setEditingTaskId(null)
        fetchTasks()
      }
    } catch (err) {
      console.error("Failed to save task", err)
    }
  }

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (response.ok) fetchTasks()
    } catch (err) {
      console.error("Failed to delete task", err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">My Tasks</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-600 text-white rounded"
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-6 rounded shadow mb-6">
          <form onSubmit={handleCreateTask} className="space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
              className="w-full border px-3 py-2 rounded"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full border px-3 py-2 rounded"
            />
            <button
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded"
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded shadow">
          {tasks.map((task) => (
            <div key={task.id} className="p-6 flex gap-4 border-b">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task)}
              />

              <div className="flex-1">
                {editingTaskId === task.id ? (
                  <>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full border px-2 py-1 rounded mb-2"
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full border px-2 py-1 rounded"
                    />
                    <div className="mt-2 flex gap-3">
                      <button
                        onClick={() => handleSaveTask(task.id)}
                        className="text-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingTaskId(null)}
                        className="text-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3
                      className={`font-medium ${
                        task.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-gray-600">
                        {task.description}
                      </p>
                    )}
                    <button
                      onClick={() => handleEditTask(task)}
                      className="text-blue-600 text-sm"
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
