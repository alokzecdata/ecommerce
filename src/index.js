// src/index.js
import dotenv from 'dotenv';
dotenv.config(); // Loads environment variables from .env
import app from './app.js'; // Import the Express app configuration

const PORT = process.env.PORT || 5000; // Default port if not set in .env

// Start the server

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
