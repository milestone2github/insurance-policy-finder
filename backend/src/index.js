const express = require("express");
const { dbConnection } = require("./config/dbConnection");
const cors = require("cors");
const router = require("./routes");
const path = require("path");
// const session = require("express-session");
// const MongoStore = require("connect-mongo");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
const allowedOrigins = process.env.ALLOWED_ORIGINS;

(async () => {
	try {
		// Connect to database
		await dbConnection(`${DB_URL}/insurance-policy`);

		// Configure session middleware
		// app.use(
		// 	session({
		// 		secret: process.env.EXPRESS_SESSION_SECRET,
		// 		resave: false,
		// 		saveUninitialized: true,
		// 		store: MongoStore.create({
		// 			mongoUrl: process.env.DB_URL,
		// 			dbName: "insurance-policy",
		// 			ttl: 24 * 60 * 60, // 1-day session expiration
		// 		}),
		// 		cookie: {
		// 			secure: false, // put it 'true' in prod
		// 			maxAge: 24 * 60 * 60 * 1000,
		// 		},
		// 	})
		// );

		// CORS configuration
		const corsOptions = {
			origin: (origin, callback) => {
				if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
					callback(null, true);
				} else {
					callback(new Error('Not allowed by CORS'));
				}
			},
			credentials: true,
			exposedHeaders: ['Content-Disposition']
		};

		app.use(cors(corsOptions));
		app.use(express.json());
		app.use(express.static(path.join(__dirname, "../../frontend/dist")));

		// routes 
		app.use("/api", router);

		// wildcard route to serve react using express
		app.get("*", (_req, res) => {
			res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
		});

		const connection = app.listen(PORT, () => {
			console.log(`Server Connected to Port ${PORT}.`);
			connection.on("error", (error) => {
				return console.error("Error while connecting to server.\n", error);
			});
		});
	} catch (err) {
		console.error("Error while starting server:", err);
	}
})();