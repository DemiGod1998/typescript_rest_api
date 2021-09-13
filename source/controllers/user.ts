import { Response, NextFunction } from "express";
import { db } from "../config/firebase";
import {hashPassword, validatePassword} from "./hash"
import { TOKEN_STRING } from "./config";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
type EntryType = {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    token: string
}

type Request= {
    body: EntryType
}

const verbose: boolean = false;

const register = async(req: Request, res: Response, next: NextFunction) =>{
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    if(!(email && password && firstName && lastName))
    {
        res.status(400).json({
            status: "failed",
            message: "firstName, lastName, email and password are required for registration."
        });
        return;
    }

    const olduserRef = db.collection('Users').where('email', '==',email);
    const olduserDoc = await olduserRef.get();
    if(olduserDoc._size != 0)
    {
        res.status(409).json({
            status: "failed",
            message: "user already exist. Plese login."
        })
        return;
    }

    if(verbose)
        console.log("I am here");
    
    const newUserRef = db.collection('Users').doc();
    const encryptedPassword = await hashPassword(password);
    const token = jwt.sign(
    { user_id: newUserRef._path.segments[1], email },
    TOKEN_STRING,
    {expiresIn: "2h",}
    );
    
    const newUser:EntryType = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: encryptedPassword,
        token: token
    }

    await newUserRef.set(newUser);
    res.status(200).json({
        status: "success",
        message: "user created",
        data: newUser
    })
};


const login = async(req : Request, res: Response, next: NextFunction) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    // const {email, password, firstName, lastName} = req.body;
    if(!(email && password))
    {
        res.status(400).json({
            status: "failed",
            message: "email and password are required."
        });
        return;
    }

    const userRef = db.collection('Users').where('email', '==', email);
    const userDoc = await userRef.get();
    if(userDoc._size == 0)
    {
        res.status(409).json({
            status: "failed",
            message: "user doesnot exist. Plese register."
        })
        return;
    }

    const user = userDoc.docs.map(
        (doc: any) => (
            {
                id: doc.id,
                ...doc.data(),
            }
        )
    )[0];
    if(verbose)
    {
        console.log(user);
        console.log(user.password);
    }
    // const encryptedPassword = await bcrypt.hash(password, 10);
    // console.log(encryptedPassword);
    const valid = await validatePassword(password, user.password);
    //How to compare user.password (which is hashed stored in db) and password(entered by user)
    if(!valid)
    {
        res.status(400).json({
            status: 'failed',
            message: "Login failed. Incorrect credentials."
        })
        return;
    }

    if(verbose)
        console.log("##############################################")
    
    const token = jwt.sign(
    {user_id: user.id, email},
    TOKEN_STRING,
    {expiresIn: "2h",}
    );
    user.token = token;
    const alreadyUser = db.collection('Users').doc(user.id);
    alreadyUser.update({
        token: token
    })
    res.status(200).json({
        status: "success",
        message: "Login successful.",
        data: user
    })
};

export default {
    register,
    login,
};