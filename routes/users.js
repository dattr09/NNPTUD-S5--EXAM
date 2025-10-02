const express = require("express");
const User = require("../schemas/user");
const Role = require("../schemas/role");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { username, password, email, role } = req.body;
    const roleObj = await Role.findById(role);
    if (!roleObj) return res.status(400).json({ error: "Không tìm thấy" });

    const user = new User({ username, password, email, role });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { username, fullName } = req.query;
    const query = { isDelete: false };

    if (username) query.username = { $regex: username, $options: "i" };
    if (fullName) query.fullName = { $regex: fullName, $options: "i" };

    const users = await User.find(query).populate("role", "name description");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "role",
      "name description"
    );
    if (!user || user.isDelete)
      return res.status(404).json({ error: "Không tìm thấy" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/by/username/:username", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
      isDelete: false,
    }).populate("role", "name description");
    if (!user) return res.status(404).json({ error: "Không tìm thấy" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).json({ error: "Không tìm thấy" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isDelete: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "Không tìm thấy" });
    res.json({ message: "đã xóa ", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/check", async (req, res) => {
  try {
    const { email, username } = req.body;
    const user = await User.findOne({ email, username, isDelete: false });

    if (!user) return res.status(404).json({ error: "Không tìm thấy" });

    user.status = true;
    await user.save();

    res.json({ message: "thành công", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
