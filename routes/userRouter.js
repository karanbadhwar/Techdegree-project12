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
    const authenticated = req.currentUser.emailAddress;
    let users = await User.findOne({ where:{ emailAddress: authenticated},
        attributes: ['id', 'firstName', 'lastName', 'emailAddress']
    });
    users = users.dataValues;
    console.log(users);
    // const user = await User.findOne({ where: {
    //     emailAddress: req.currentUser.name
    // }});
    if(users){
        res.status(200).json({ users });
    }else {
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
    let errors = [];
    if (!values.firstName){
        errors.push('Please provide a value for First Name!');
    }
    if (!values.lastName){
        errors.push('Please provide a value for Last Name!');
    }
    if (!values.emailAddress){
        errors.push('Please Provide a value for Email Address!');
    }
    if (!values.password){
        errors.push('Please Provide a value for Password!');
    }
    if (errors.length > 0){
        res.status(400).json({ errors });
    } else {
        const hashedPass = bcrypt.hashSync(values.password, 10);
        const user = await User.create({
            firstName: values.firstName,
            lastName: values.lastName,
            emailAddress: values.emailAddress,
            password: hashedPass,
        });
        res.location('/');
        res.status(201).json();
    }

}));



module.exports = router;