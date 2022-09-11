const router = require('express').Router();
const {User} = require('../models/index');
const bcrypt = require('bcryptjs');
const authenticateUser  = require('../middleware/auth-user');

function asyncHandler(cb){
    return async(res,req,next) => {
        try{
            await cb(res,req,next)
        } catch (err){
            next(err);
        }
    }
}
// fetching all the User Data
router.get('/', authenticateUser ,asyncHandler(async(req,res) =>{
    // console.log(res.status());
   if(req.currentUser !== undefined){
    const users = await User.findAll({
        attributes: ['id', 'firstName', 'lastName', 'emailAddress']
    });
    console.log(users);
    if(users.length > 0){
        res.status(200).json({ users });
    }else{
        console.log(users);
        res.status(200).json({
            message: "No Data Present!"
        })
}
   } else {
    res.status(401).json({
        msg: req.authFailed
    })
   }

}));

// Creating a User Data
router.post('/', asyncHandler( async(req,res) =>{
    const values = req.body;
    const hashedPass = bcrypt.hashSync(values.password, 10);
    await User.create({
        firstName: values.firstName,
        lastName: values.lastName,
        emailAddress: values.emailAddress,
        password: hashedPass,
    });
    res.status(201).json()
}));



module.exports = router;