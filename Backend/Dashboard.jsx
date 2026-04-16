import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then(res => res.json())
      .then(setUsers);

    fetch("http://localhost:5000/api/boards")
      .then(res => res.json())
      .then(setBoards);
  }, []);

  const deleteUser = async (id) => {
    await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "DELETE"
    });
    setUsers(users.filter(u => u._id !== id));
  };

  return (
    <div className="dashboard">
      <h1>Admin Panel</h1>

      <h2>Total Users: {users.length}</h2>
      <h2>Total Boards: {boards.length}</h2>

      <h3>Users</h3>
      {users.map(user => (
        <div key={user._id}>
          {user.name} ({user.email})
          <button onClick={() => deleteUser(user._id)}>Delete</button>
        </div>
      ))}

      <h3>Boards</h3>
      {boards.map(board => (
        <div key={board._id}>
          {board.title} - Users: {board.users.length}
        </div>
      ))}
    </div>
  );
}