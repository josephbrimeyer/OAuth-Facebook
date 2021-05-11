const mongoose = require("mongoose");
require("dotenv").config();
const connectionString = process.env.MONGO_URI;

const db = mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDb connected"))
  .catch((err) => console.log(err));
