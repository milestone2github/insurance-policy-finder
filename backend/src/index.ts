import express from "express";
import { dbConnection } from "./config/dbConnection";
import cors from "cors";
import router from "./routes";
import session from "express-session";
import MongoStore from "connect-mongo";
import { CorsCallback } from "./utils/interfaces";
import "dotenv/config";
import path from "path";

const app = express();
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
const allowedOrigins = process.env.ALLOWED_ORIGINS;

(async () => {
	try {
		// Connect to database
		// await dbConnection(`${DB_URL}/insurance-policy`);

		// Configure session middleware
		// app.use(
		// 	session({
		// 		secret: process.env.EXPRESS_SESSION_SECRET as string,
		// 		resave: false,
		// 		saveUninitialized: true,
		// 		store: MongoStore.create({
		// 			mongoUrl: process.env.DB_URL,
		// 			dbName: "insurance-policy",
		// 			ttl: 24 * 60 * 60, // 1-day session expiration
		// 		}),
		// 		cookie: {
		// 			secure: false,     // put it 'true' in prod
		// 			maxAge: 24 * 60 * 60 * 1000,
		// 		},
		// 	})
		// );

		// Set CORS options
		const corsOptions = {
			origin: (origin: string | undefined, callback: CorsCallback) => {
				if (!origin || allowedOrigins?.includes(origin)) {
					callback(null, true);
				} else {
					callback(new Error("Not allowed by CORS."));
				}
			},
			credentials: true,
		};

		app.use(cors(corsOptions));
		app.use(express.json());
		app.use("/api", router);

		const connection = app.listen(PORT, () => {
			console.log(`Server Connected to Port ${PORT}.`);
			connection.on("error", (error) => {
				return console.error("Error while connecting to server.\n", error);
			});
		});
	} catch (err) {
		console.error("Error while starting server.", err);
	}
})();

(async () => {
  try {
    // …DB, CORS, JSON middleware, API routes…

    // 1️⃣ Serve React’s static assets
    const clientBuildPath = path.join(__dirname, "..", "frontend", "dist");
    app.use(express.static(clientBuildPath));

    // 2️⃣ “Catch‑all” route to return index.html for any non-API request
    app.get("/*", (_req, res) => {
      res.sendFile(path.join(clientBuildPath, "index.html"));
    });

    // 3️⃣ Then start your server
    const connection = app.listen(PORT, () => {
      console.log(`Server Connected to Port ${PORT}.`);
      connection.on("error", (error) => {
        console.error("Error while connecting to server.\n", error);
      });
    });
  } catch (err) {
    console.error("Error while starting server.", err);
  }
})();