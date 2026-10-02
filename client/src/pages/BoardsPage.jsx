import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function BoardsPage({ user, setUser }) {
  const navigate = useNavigate();

  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create board form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");

  // Edit board form
  const [editingBoard, setEditingBoard] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Tasks
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("All");
  const [tasksLoading, setTasksLoading] = useState(false);

  // Get all boards
  const loadBoards = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/board");
      setBoards(res.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load boards"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoards();
  }, []);

  // Create board
  const createBoard = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/board", {
        title,
        description,
        password,
      });

      setTitle("");
      setDescription("");
      setPassword("");

      await loadBoards();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create board"
      );
    }
  };

  // Check if current user owns the board
  const isOwner = (board) => {
    const ownerId =
      typeof board.owner === "object"
        ? board.owner?._id
        : board.owner;

    return (
      board.isOwner === true ||
      (ownerId && ownerId.toString() === user?._id?.toString())
    );
  };

  // Open edit form
  const startEdit = (board) => {
    setEditingBoard(board);
    setEditTitle(board.title);
    setEditDescription(board.description || "");
  };

  // Update board
  const updateBoard = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let body = {
        title: editTitle,
        description: editDescription,
      };

      if (!isOwner(editingBoard)) {
        const boardPassword = window.prompt(
          "Enter the board password:"
        );

        if (boardPassword === null) return;

        body.password = boardPassword;
      }

      await api.patch(
        `/board/${editingBoard._id}`,
        body
      );

      setEditingBoard(null);
      await loadBoards();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update board"
      );
    }
  };

  // Delete board
  const deleteBoard = async (board) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${board.title}"?`
    );

    if (!confirmed) return;

    setError("");

    try {
      let body = {};

      if (!isOwner(board)) {
        const boardPassword = window.prompt(
          "Enter the board password:"
        );

        if (boardPassword === null) return;

        body.password = boardPassword;
      }

      await api.delete(`/board/${board._id}`, {
        data: body,
      });

      if (selectedBoard?._id === board._id) {
        setSelectedBoard(null);
        setTasks([]);
      }

      if (editingBoard?._id === board._id) {
        setEditingBoard(null);
      }

      await loadBoards();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete board"
      );
    }
  };

  // Load tasks and filter by status
  const loadTasks = async (boardId, selectedStatus) => {
    setTasksLoading(true);
    setError("");

    try {
      const params = { boardId };

      if (selectedStatus !== "All") {
        params.status = selectedStatus;
      }
      const res = await api.get("/task", { params });
      setTasks(res.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load tasks"
      );
      setTasks([]);
    } finally {
      setTasksLoading(false);
    }
  };

  const openTasks = (board) => {
    setSelectedBoard(board);
    setStatus("All");
    loadTasks(board._id, "All");
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    if (selectedBoard) {
      loadTasks(selectedBoard._id, newStatus);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <main className="container">
      <header className="navbar">
        <h2>Task Manager</h2>

        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      {error && <p className="error">{error}</p>}

      {/* Create Board */}
      <section>
        <h2>Create New Board</h2>

        <form onSubmit={createBoard}>
          <input
            type="text"
            placeholder="Board title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Board description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="password"
            placeholder="Board password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Create Board</button>
        </form>
      </section>

      {/* Edit Board */}
      {editingBoard && (
        <section>
          <h2>Edit Board</h2>

          <form onSubmit={updateBoard}>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
            />

            <textarea
              value={editDescription}
              onChange={(e) =>
                setEditDescription(e.target.value)
              }
            />

            {!isOwner(editingBoard) && (
              <p>
                You must enter the board password when saving.
              </p>
            )}

            <button type="submit">Save Changes</button>

            <button
              type="button"
              onClick={() => setEditingBoard(null)}
            >
              Cancel
            </button>
          </form>
        </section>
      )}

      {/* All Boards */}
      <section>
        <h2>All Boards</h2>

        {loading ? (
          <p>Loading boards...</p>
        ) : boards.length === 0 ? (
          <p>No boards found. Create your first board!</p>
        ) : (
          <div className="boards">
            {boards.map((board) => (
              <article className="board-card" key={board._id}>
                <h3>{board.title}</h3>
                <p>{board.description}</p>

                {isOwner(board) && (
                  <span className="owner-label">Owner</span>
                )}

                <div className="board-actions">
                  <button onClick={() => openTasks(board)}>
                    View Tasks
                  </button>

                  <button onClick={() => startEdit(board)}>
                    Edit
                  </button>

                  <button
                    className="delete"
                    onClick={() => deleteBoard(board)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Tasks */}
      {selectedBoard && (
        <section>
          <div className="tasks-header">
            <h2>{selectedBoard.title} - Tasks</h2>
            <button
              onClick={() => {
                setSelectedBoard(null);
                setTasks([]);
              }}
            >
              Close
            </button>
          </div>

          <label htmlFor="status-filter">
            Filter by status:
          </label>

          <select
            id="status-filter"
            value={status}
            onChange={handleStatusChange}
          >
            <option value="All">All</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          {tasksLoading ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p>No tasks found.</p>
          ) : (
            <div className="tasks">
              {tasks.map((task) => (
                <article className="task-card" key={task._id}>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <span className="status">
                    {task.status}
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default BoardsPage;