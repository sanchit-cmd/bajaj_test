const express = require("express");
const path = require("path");
const bfhlRoutes = require("./routes/bfhl.routes");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "templates")));

app.use("/", bfhlRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
