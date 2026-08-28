const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || "super_secret_key_123";

module.exports = (req, res, next) => {
   
    const token = req.header('Authorization');
    
   
    if (!token) return res.status(401).json({ error: "Access Denied" });

    try {
        
        const cleanToken = token.replace('Bearer ', '');
        const verified = jwt.verify(cleanToken, SECRET_KEY);
        
        
        req.user = verified;
        next(); 
    } catch (error) {
        res.status(400).json({ error: "Invalid Token" });
    }
};