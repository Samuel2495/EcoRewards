import dotenv from "dotenv";
import app from "./app.js";
// From the db.js file
// import { connectDB, disconnectDB } from "./config/db.js";
// const app = express();

// configs();
// connectDB();

// // const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});