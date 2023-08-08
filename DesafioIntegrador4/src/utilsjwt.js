import jwt from "jsonwebtoken";
import config from "./config.js";

const { jwtSecret } = config;

export const generateToken = (user) => {
  const token = jwt.sign({ user }, jwtSecret, { expiresIn: "24h" });
  return token;
};

export const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(400).send({ error: "Not Authenticated" });
  console.log(authHeader)
  const token = authHeader.split(" ")[1];
  jwt.verify(token, jwtSecret, (error, credentials) => {
    if (error) res.status(403).send({ error: "Authentication Error" });

    req.user = credentials.user;
    next();
  });
};