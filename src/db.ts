import mongoose, { Error } from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/gyutube", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;

const handleError = (error: Error) => console.log("❌ DB Error: ", error);
const handleOpen = () => console.log("✅ Connected to DB");

db.on("error", handleError);
db.once("open", handleOpen);
