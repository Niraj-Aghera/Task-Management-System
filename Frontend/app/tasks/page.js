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

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }
    fetchTasks()
  }, [router])

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
    } catch (err) {
      setError("Unable to connect to server")
    } finally {
      setLoading(false)
    }
  }

  // ✅ FIXED TO MATCH BACKEND
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
            is_completed: !task.is_completed,
          }),
        }
      )

      if (response.ok) {
        fetchTasks()
      }
    } catch (err) {
      console.error("Failed to update task", err)
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

      if (response.ok) {
        fetchTasks()
      }
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Tasks</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Task</h2>

          <form onSubmit={handleCreateTask} className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
              className="w-full px-3 py-2 border rounded"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full px-3 py-2 border rounded"
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold p-6 border-b">Task List</h2>

          {tasks.length === 0 ? (
            <p className="p-6 text-center text-gray-500">No tasks yet</p>
          ) : (
            <div className="divide-y">
              {tasks.map((task) => (
                <div key={task.id} className="p-6 flex gap-4">
                  {/* ✅ FIXED */}
                  <input
                    type="checkbox"
                    checked={task.is_completed}
                    onChange={() => handleToggleComplete(task)}
                    className="mt-1 h-5 w-5"
                  />

                  <div className="flex-1">
                    <h3
                      className={`font-medium ${
                        task.is_completed
                          ? "line-through text-gray-400"
                          : ""
                      }`}
                    >
                      {task.title}
                    </h3>

                    {task.description && (
                      <p
                        className={`text-sm ${
                          task.is_completed
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}
                      >
                        {task.description}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
