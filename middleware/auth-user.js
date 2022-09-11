const auth = require('basic-auth');
const {User} = require('../models/index');
const bcrypt = require('bcryptjs');

const authenitcateUser = async (req,res,next) =>{
    const credentials = auth(req);
    console.log(credentials)
    if (credentials){
        const user = await User.findOne({ where:{ emailAddress: credentials.name} });
            if (user){
                const authenticated = bcrypt.compareSync(credentials.pass, user.password);
                if (authenticated){
                    console.log(`User Authenticated Successfully: ${user.emailAddress}`);
                    req.currentUser = user;
                } else {
                    console.log(`Authentication Failed for User: ${user.emailAddress}`);
                    req.authFailed = `Authentication Failed for User: ${user.emailAddress}`;
                } 
            }else {
                console.log(`User Not Found!`);
                req.authFailed = `User Not Found!`;
            }
    } else {
        console.log("Auth header not found!");
        req.authFailed = "Auth header not found!";
    }
    next();
}
module.exports = authenitcateUser;