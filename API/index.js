require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("./Models/userModel");
const cors = require("cors");

const MONGO_DB = process.env.MONGO_DB;
const PORT = process.env.PORT;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID; // Add this to your .env file
const JWT_SECRET = process.env.JWT_SECRET;

const client = new OAuth2Client(CLIENT_ID);
app.use(express.json());

app.use(cors({ origin: "http://localhost:3000" }));

app.post("/api/google-login", async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the token using Google API
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    // Check if the user exists in the MongoDB database
    let user = await User.findOne({ googleId: sub });
    if (!user) {
      // Create a new user record if not exists
      user = new User({
        googleId: sub,
        email,
        name,
        picture,
      });
      await user.save();
    }

    // Generate a session token for the authenticated user
    const sessionToken = jwt.sign(
      { userName: user.name, email: user.email, picture: user.picture },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send the session token to the client
    res.json({ success: true, sessionToken });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});

mongoose
  .connect(MONGO_DB)
  .then(() => {
    console.log("connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Node API app is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
