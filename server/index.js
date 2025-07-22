const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { dbConnect } = require("./dbConfig/dbConfig");
require("dotenv").config();
const PORT = process.env.PORT || 8080;
const routes = require("./routes/routes");
const app = express();

// Middleware
app.use(
  cors({
    origin: `${process.env.FRONTEND_URI}`,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);
dbConnect();

app.get("/api/health", (req, res) => {
  res.status(200).send("Healthy");
});
app.use((err, req, res, next) => {
  return res.status(500).send("Something broke!");
  next();
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
