

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    try {
        const decoded = JsonWebTokenError.verify(token , process.env.JWT_SECREAT);
        req.user = decoded;
        next();
    }catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

module.exports = { authMiddleware };