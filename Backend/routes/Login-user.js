app.post("/login", async (req, res) => {
  const { username } = req.body;

  let user = await User.findOne({ username });

  if (!user) {
    user = new User({ username, isOnline: true });
  } else {
    user.isOnline = true;
    user.lastActive = new Date();
  }

  await user.save();
  res.json(user);
});