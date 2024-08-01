
import React from 'react';

interface LogoutButtonProps {
  onLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  return (
    <button onClick={onLogout} className="logout-button">
      <i className="bi bi-door-open"></i>
    </button>
  );
}

export default LogoutButton;
