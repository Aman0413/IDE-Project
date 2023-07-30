const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const codeRoutes = require("./routes/codeRoutes");
const cors = require("cors");

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

let client = "http://localhost:3000";

if (process.env.NODE_ENV === "production") {
  client = process.env.CLIENT_URL;
}

app.use(
  cors({
    origin: client,
  })
);
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
//default request
app.get("/", (req, res) => {
  return res.send("Ok from server");
});

app.use("/api/v1", codeRoutes);
