function formatRelativeTime(timestamp) {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(timestamp).toLocaleDateString()
}

function Sidebar({ sessions, activeSessionId, onSelectSession, onNewChat, onDeleteSession, isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-logo">Ask Ollie 🦉</span>
        </div>

        <button className="new-chat-btn" onClick={onNewChat}>
          <span className="new-chat-icon">+</span> New chat
        </button>

        <nav className="session-list" aria-label="Chat history">
          {sessions.length === 0 && (
            <p className="session-empty">No chats yet</p>
          )}
          {sessions.map(session => (
            <div
              key={session.id}
              className={`session-item ${session.id === activeSessionId ? 'session-item-active' : ''}`}
            >
              <button
                className="session-item-btn"
                onClick={() => onSelectSession(session.id)}
                title={session.title}
              >
                <span className="session-title">{session.title}</span>
                <span className="session-time">{formatRelativeTime(session.updatedAt)}</span>
              </button>
              <button
                className="session-delete-btn"
                aria-label={`Delete chat: ${session.title}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteSession(session.id)
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar