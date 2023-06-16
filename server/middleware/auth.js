import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.headers("Authorization");
        if (!token) return res.status(403).json({ message: "Access Denied" });
        if (token.startsWith("Bearer ")) token = token.slice(7, token.length).trimLeft();
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};