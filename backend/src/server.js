//Load environment variable
import { config } from "dotenv";
config();

// Import express and cors
import express from "express";
import axios from "axios";
import cors from "cors";

// Set up express
const app = express();
app.disable("x-powered-by");
app.use(cors());
// Tell express to use a JSON parser middleware
app.use(express.json());
// Tell express to use a URL Encoding middleware
app.use(express.urlencoded({ extended: true }));


//Add routers below:
app.get("/", async function(req, res) {
    try {
        const response = await fetch("https://dummyjson.com/products");
        const data = await response.json();

        res.status(200).json({ data: data });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ Error: "An error occurred while fetching data" });
    }
} )

// Set up a default "catch all" route to use when someone visits a route
// that we haven't built
app.get("*", (req, res) => {
  res.json({ ok: true });
});

// Start API server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`\n Server is running on http://localhost:${port}\n`);
});