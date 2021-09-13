const jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from "express";
import { TOKEN_STRING } from "../config/config";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }

    try {
        const decoded = jwt.verify(token, TOKEN_STRING);
        // res.status(200).json({data: decoded});
      } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
}

export {verifyToken};