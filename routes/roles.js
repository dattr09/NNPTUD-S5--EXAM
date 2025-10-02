const express = require("express");
const Role = require("../schemas/role");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const role = new Role(req.body);
    await role.save();
    res.status(201).json(role);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { name } = req.query;
    const query = { isDelete: false };
    if (name) query.name = { $regex: name, $options: "i" };

    const roles = await Role.find(query);
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role || role.isDelete)
      return res.status(404).json({ error: "Không tìm thấy" });
    res.json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!role) return res.status(404).json({ error: "Không tìm thấy" });
    res.json(role);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { isDelete: true },
      { new: true }
    );
    if (!role) return res.status(404).json({ error: "Không tìm thấy" });
    res.json({ message: "đã xóa", role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
