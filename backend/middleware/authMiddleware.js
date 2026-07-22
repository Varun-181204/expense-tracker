const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {

    let token;

    // Check Authorization Header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {

        try {

            // Get Token
            token = req.headers.authorization.split(" ")[1];

            // Verify Token
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            // Save User ID in Request
            req.user = {
                id: decoded.id,
            };

            next();

        } catch (error) {

            return res.status(401).json({
                message: "Invalid Token"
            });

        }

    }

    if (!token) {

        return res.status(401).json({
            message: "No Token Found"
        });

    }

};

module.exports = protect;