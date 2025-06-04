import mongoose from "mongoose";

export const dbConnection = async (DB_URL: string) => {
	try {
		await mongoose
			.connect(DB_URL)
			.then(() => console.log("Connected to Insurance Policy DB!"));
	} catch (e) {
		console.error("Error while connecting to DB.");
	}
};
