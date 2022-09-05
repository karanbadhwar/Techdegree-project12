const router = require('express').Router();
const {User} = require('../models/index');

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
router.get('/', asyncHandler(async(req,res) =>{
const users = await User.findAll();
console.log(users);
if(users.length > 0){
    res.status(200).json({ users });
}else{
    console.log(users);
    res.status(401).json({
        message: "No Data Present!"
    })
}
}));

// Creating a User Data
router.post('/', asyncHandler( async(req,res) =>{
    const values = req.body;
    await User.create({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
    });
    res.status(201).json()
}));


module.exports = router;