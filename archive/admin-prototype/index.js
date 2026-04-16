import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [boards, setBoards] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch users from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));

    fetch("http://localhost:5000/api/boards")
      .then((res) => res.json())
      .then((data) => setBoards(data));
  }, []);

  const deleteUser = async (id) => {
    await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "DELETE",
    });
    setUsers(users.filter((u) => u._id !== id));
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 grid gap-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold"
      >
        Admin Dashboard
      </motion.h1>

      <div className="grid grid-cols-3 gap-4">
        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-2xl">{users.length}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">Active Boards</h2>
            <p className="text-2xl">{boards.length}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">System Status</h2>
            <p className="text-green-500">Online</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="flex justify-between items-center p-4 rounded-2xl shadow">
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <Button
                variant="destructive"
                onClick={() => deleteUser(user._id)}
              >
                Delete
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

