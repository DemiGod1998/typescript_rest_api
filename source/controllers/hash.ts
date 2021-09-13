const bcrypt = require("bcryptjs");
const saltRounds = 10;

async function hashPassword(password: string){
    const salt = await bcrypt.genSalt(saltRounds);
    const encryptedPassword: string = await bcrypt.hash(password, salt);
    return encryptedPassword;
}

async function validatePassword(password: string, encryptedPassword: string){
    const valid = await bcrypt.compare(password, encryptedPassword);
    return valid;
}

export {hashPassword, validatePassword};