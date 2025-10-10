const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
	try {
		const authHeader = req.headers["authorization"];
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.contactNumber = decoded.contactNumber;
		next();
	} catch (err) {
		console.error("Unable to verify the JWT Token:", err.message);
		return res.status(403).json({ error: "Forbidden" });
	}
};

module.exports = verifyJWT;