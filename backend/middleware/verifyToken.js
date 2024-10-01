//checking ng token if valid ba siya or not
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
	const token = req.cookies.token; //tinawag natin yong "token variable doon sa generateTokenAndSetCookie.js"
	if (!token) return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET); //yong process.env.JWT_SECRET, kinuha suya sa generateTokenAndSetCookie.js para makagawa ng Token

		if (!decoded) return res.status(401).json({ success: false, message: "Unauthorized - invalid token" }); //lalabas pag invalid yong token na nilagay

		req.userId = decoded.userId;
		next(); //icacall niya yong next function which is yong checkAuth function

	} catch (error) {
		console.log("Error in verifyToken ", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
};