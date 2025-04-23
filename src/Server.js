const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/ecommerce-auth", { useNewUrlParser: true, useUnifiedTopology: true });

app.post("/api/register", async (req, res) => {
  const { name, email, phone, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await User.create({ name, email, phone, password: hashedPassword });
    res.status(201).send({ message: "User registered" });
  } catch (e) {
    res.status(400).send({ message: "User already exists" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, "secret123");
  res.send({ token });
});

app.listen(5000, () => console.log("Server running on port 5000"));
