"use strict";

import { dbConnection } from "./config/dbConnection.js";
import app from "./app.js";
import "dotenv/config";

const PORT = process.env.PORT || 8000;


dbConnection().then(() => {
  app.listen(PORT, () => {
    console.log("Running: http://127.0.0.1:" + PORT);
  });
});


