app.post("/logout", async (req, res) => {
  const { username } = req.body;

  await User.updateOne(
    { username },
    { isOnline: false, lastActive: new Date() }
  );

  res.json({ message: "Logged out" });
});