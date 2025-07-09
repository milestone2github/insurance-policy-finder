import express from "express";
import { dbConnection } from "./config/dbConnection";
import cors from "cors";
import router from "./routes";
import session from "express-session";
import MongoStore from "connect-mongo";
import { CorsCallback } from "./utils/interfaces";
import "dotenv/config";
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
