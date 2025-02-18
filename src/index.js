require('./instrumentation');

require('dotenv').config();

// Import the Express module
const express = require('express');

// Create a new Express app
const app = express();

const { loadControllers } = require('./controllers');

loadControllers(app);

// Start the server and listen on port 3000
const port = process.env.APP_PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});