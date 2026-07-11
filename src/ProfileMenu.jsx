import { useState, useRef, useEffect } from 'react'

function ProfileMenu({ profile, onSignOut }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initial = profile?.name ? profile.name.charAt(0).toUpperCase() : '?'

  return (
    <div className="profile-menu" ref={menuRef}>
      <button
        className="profile-avatar-btn"
        onClick={() => setOpen(o => !o)}
        aria-label="Open profile menu"
        aria-expanded={open}
      >
        {profile?.picture ? (
          <img src={profile.picture} alt="" className="profile-avatar-img" />
        ) : (
          <span className="profile-avatar-fallback">{initial}</span>
        )}
      </button>

      {open && (
        <div className="profile-dropdown" role="menu">
          <div className="profile-dropdown-header">
            {profile?.picture ? (
              <img src={profile.picture} alt="" className="profile-dropdown-img" />
            ) : (
              <span className="profile-avatar-fallback profile-avatar-fallback-lg">{initial}</span>
            )}
            <div className="profile-dropdown-info">
              <span className="profile-dropdown-name">{profile?.name || 'Signed in'}</span>
              <span className="profile-dropdown-email">{profile?.email}</span>
            </div>
          </div>
          <button className="profile-dropdown-signout" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileMenu