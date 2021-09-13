import { Response, NextFunction } from "express";
import { db } from "../config/firebase";
const bcrypt = require("bcryptjs");

type EntryType = {
    email: string,
    password: string,
    firstName: string,
    lastName: string
}

type Request= {
    body: EntryType
}

const register = async(req: Request, res: Response, next: NextFunction) =>{
    const {email, password, firstName, lastName} = req.body;
    if(!(email && password && firstName && lastName))
    {
        res.status(400).json({
            status: "failed",
            message: "all fields are required."
        });
    }

    const userRef = db.collection('Users').doc(email.toLowerCase());
    const userDoc = await userRef.get();
    if(userDoc.exists)
    {
        res.status(409).json({
            status: "failed",
            message: "user already exist. Plese login."
        })
    }

    console.log("I am here");
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email.toLowerCase(),
        password: encryptedPassword,
    }

    await userRef.set(newUser);
    res.status(200).json({
        status: "success",
        message: "user created",
        data: newUser
    })
};


const login = async(req : Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const password = req.body.password;
    // const {email, password, firstName, lastName} = req.body;
    if(!(email && password))
    {
        res.status(400).json({
            status: "failed",
            message: "email and password are required."
        });
    }

    const userRef = db.collection('Users').doc(email.toLowerCase());
    const userDoc = await userRef.get();
    // console.log(userDoc);
    if(userDoc.empty)
    {
        res.status(409).json({
            status: "failed",
            message: "user doesnot exist. Plese register."
        })
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const fetchedUser = await userDoc.data();
    console.log(fetchedUser)
    if(await bcrypt.compare(encryptedPassword, fetchedUser.password))
    {
        res.status(400).json({
            status: 'failed',
            message: "Login failed. Incorrect credentials."
        })
    }

    res.status(200).json({
        status: "success",
        message: "Login successful.",
        data: fetchedUser
    })
};

export default {
    register,
    login,
};