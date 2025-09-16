import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const generatetoken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {expiresIn: "1d"});
};

export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};