import mongoose from "mongoose";

console.log(`DB_URL: ${process.env.DB_URL}`);

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB");
db.on("error", (error) => console.log("DB Error", error));
db.once("open", handleOpen);
