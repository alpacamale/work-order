import "dotenv/config";
import "./db";
import "./models/Comment";
import "./models/Post";
import "./models/User";
import app from "./server";

const handleListening = () =>
  console.log(`Server listening on http://localhost:${process.env.PORT}`);

app.listen(process.env.PORT, handleListening);
