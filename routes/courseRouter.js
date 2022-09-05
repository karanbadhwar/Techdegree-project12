const router = require('express').Router();
const {Course} = require('../models/index');
// const { Course } = require('../models/course');

//Function to add Try-Catch Block to every function/Middleware
function asyncHandler(cb){
    return async(req,res,next) => {
        try{
            await cb(req,res,next)
        } catch (err){
            next(err);
        }
    }
}
// fetching all the Courses list
router.get('/', asyncHandler(async(req,res) =>{
    const courses = await Course.findAll();
    console.log(courses);
    if (courses.length > 0){
        res.status(200).json({ courses });
    }else {
        res.status(200).json({
            message: "No Data Found"
        })
    }
}));

//Fetching One Course searched with ID
router.get('/:id', asyncHandler(async(req,res) =>{
    const id = req.params.id;
    const course = await Course.findByPk(id);
    if (course){
        res.status(200).json({ course });
    } else {
        res.status(200).json({
            message: "Invalid Entry, Data Not Found"
        })
    }
}));

//Creating a Course with POST
router.post('/', asyncHandler( async(req,res) =>{
    const values = req.body;
    await Course.create({
        title: values.title,
        description: values.description,
        estimatedTime: values.estimatedTime,
        materialsNeeded: values.materialsNeeded,
        userId: values.userID
    });
    res.status(201).end();
}));

module.exports = router;