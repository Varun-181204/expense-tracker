require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const budgetRoutes = require("./routes/budgetRoutes");

connectDB();

app.use(cors());

app.use(express.json());

app.use("/api/transactions", transactionRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/budget", budgetRoutes);

app.get("/", (req, res) => {

    res.send("Expense Tracker Backend Running");

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server Running on Port ${PORT}`);

});