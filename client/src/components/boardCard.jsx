function BoardCard({ board, isOwner, onView, onEdit, onDelete }) {
  return (
    <article className="board-card">
      <h3>{board.title}</h3>

      <p>{board.description || "No description"}</p>

      {isOwner && (
        <span className="owner-label">Owner</span>
      )}

      <div className="board-actions">
        <button onClick={() => onView(board)}>
          View Tasks
        </button>

        <button onClick={() => onEdit(board)}>
          Edit
        </button>

        <button
          className="delete"
          onClick={() => onDelete(board)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default BoardCard;