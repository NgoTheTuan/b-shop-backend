const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const bodyParser = require("body-parser");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const categoriesRoutes = require("./routes/categories");
const categoryProductRoutes = require("./routes/categoryProduct");
const uploadRoutes = require("./routes/uploads");
const systemRoutes = require("./routes/system");
const newsRoutes = require("./routes/news");
const paymentRoutes = require("./routes/payment");
const contactRoutes = require("./routes/contact");
const supplierRoutes = require("./routes/supplier");
const warehouseRoutes = require("./routes/wareHouse");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB is connected!!!"));

mongoose.connection.on("error", (err) => {
  console.log(`DB connection fail ${err.message}`);
});

//middleware
app.use(express.json());
app.use(cors());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);

app.use(bodyParser.json());
app.use(helmet());
app.use(morgan("common"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

app.use("/api/categories", categoriesRoutes);
app.use("/api/categoryProduct", categoryProductRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/system", systemRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/warehouse", warehouseRoutes);

app.listen(4000, () => {
  console.log("Back end server is ready 4000!");
});
