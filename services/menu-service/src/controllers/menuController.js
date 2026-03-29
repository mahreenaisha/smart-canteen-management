const Menu = require("../models/Menu");
const client = require("../cache/redis");

/* =========================
   CREATE MENU ITEM
========================= */
exports.createMenu = async (req, res) => {
  try {
    const newItem = new Menu(req.body);
    const savedItem = await newItem.save();

    // 🔥 Clear cache
    await client.del("menu");

    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* =========================
   GET ALL MENU ITEMS (WITH CACHE + FILTER)
========================= */
exports.getAllMenu = async (req, res) => {
  try {
    let cacheKey = "menu";

    // 🔥 Change cache key if category filter exists
    if (req.query.category) {
      cacheKey = `menu:${req.query.category}`;
    }

    // 🔹 1. Check Redis
    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      console.log("Data from Redis ⚡");
      return res.status(200).json(JSON.parse(cachedData));
    }

    // 🔹 2. Build query
    const query = {};

    if (req.query.category) {
      query.category = req.query.category;
    }

    console.log("Data from MongoDB 🐢");

    const items = await Menu.find(query);

    // 🔹 3. Store in Redis
    await client.setEx(cacheKey, 60, JSON.stringify(items));

    res.status(200).json(items);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET SINGLE MENU ITEM
========================= */
exports.getMenuById = async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   UPDATE MENU ITEM
========================= */
exports.updateMenu = async (req, res) => {
  try {
    const updatedItem = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    // 🔥 Clear cache
    await client.del("menu");

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* =========================
   DELETE MENU ITEM
========================= */
exports.deleteMenu = async (req, res) => {
  try {
    const deletedItem = await Menu.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    // 🔥 Clear cache
    await client.del("menu");

    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};