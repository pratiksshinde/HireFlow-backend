const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const { User } = require("./models/user.js");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes.js");
const { sequelize } = require("./config/db.js");


const app = express();

app.use(
    cors({
         origin: "http://localhost:3000",
         credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api/auth", authRoutes);

//test db connection
sequelize
    .authenticate()
    .then(() => {
        console.log("Database connected...");
    })
    .catch((err) => {
        console.log("Error: " + err);
    });
    
//server listening
const PORT = process.env.PORT || 4000;
app.listen(PORT , () =>{
    console.log(`server is running on port ${PORT}`);
});