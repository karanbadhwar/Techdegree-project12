const router = require("express").Router();
const { Course, User } = require("../models/index");
const authenticateUser = require("../middleware/auth-user");

//Function to add Try-Catch Block to every function/Middleware
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}
// fetching all the Courses list
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      attributes: [
        "id",
        "title",
        "description",
        "estimatedTime",
        "materialsNeeded",
        "userId",
      ],
    });
    // console.log(courses);
    if (courses.length > 0) {
      res.status(200).json({ courses });
    } else {
      res.status(200).json({
        message: "No Data Found",
      });
    }
  })
);

//Fetching One Course searched with ID
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const course = await Course.findOne({
      where: { id },
      include: {
        model: User,
        as: 'User',
        attributes:[
            'firstName',
            'lastName',
            'emailAddress'
        ]
      },
      attributes: [
        "id",
        "title",
        "description",
        "estimatedTime",
        "materialsNeeded",
        "userId",
      ],
    });
    if (course) {
      res.status(200).json({ course });
    } else {
      res.status(200).json({
        message: "Invalid Entry, Data Not Found",
      });
    }
  })
);

//Creating a Course with POST
router.post(
  "/",
  authenticateUser,
  asyncHandler(async (req, res) => {
    if (req.currentUser !== undefined) {
      const values = req.body;
      const errors = [];
      if (!values.title){
        errors.push("Please provide a valid Title!")
      }
      if (!values.description){
        errors.push('Pelase provide a Valid Description!')
      }
      if (errors.length > 0){
        res.status(400).json({errors})
      }else {
        const course = await Course.create({
          title: values.title,
          description: values.description,
          estimatedTime: values.estimatedTime,
          materialsNeeded: values.materialsNeeded,
          userId: values.userId,
        });
        res.location(`/${course.id}`);
        res.status(201).end();
      }

    } else {
      res.status(401).json({
        msg: req.authFailed,
      });
    }
  })
);

//Updating a Course with ID
router.put(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    if (req.currentUser !== undefined) {
      const id = req.params.id;
      const values = req.body;
      const errors = [];
      if (!values.title){
        errors.push('Title Cannot be Empty!');
      }
      if (!values.description){
        errors.push('Description Cannot be Empty!')
      }
      if (errors.length > 0){
        res.status(400).json({errors});
      } else {
        const course = await Course.findByPk(id);
        const user = await User.findOne({
          where: {
            emailAddress: req.currentUser.emailAddress,
          },
        });
        if (course.userId === user.id) {
          if (course) {
              course.id,
              course.title = values.title,
              course.description = values.description,
              course.estimatedTime = values.estimatedTime,
              course.materialsNeeded = values.materialsNeeded,
              course.userId;
          }
          await course.update(
            {
              course,
            },
            {
              where: {
                id: req.params.id,
              },
            }
          );
          await course.save();
          res.status(204).end();
        } else {
          res.status(403).json({
            msg: "User Not Authorized To This Course!",
          });
      }

      }
    } else {
      res.status(401).json({
        msg: req.authFailed,
      });
    }
  })
);

// Deleting A Course Record
router.delete(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    if (req.currentUser !== undefined) {
      const course = await Course.findByPk(req.params.id);
      const user = await User.findOne({
        where: {
          emailAddress: req.currentUser.emailAddress,
        },
      });
      if (course.userId === user.id) {
        if (course) {
          course.destroy();
          res.status(204).end();
        }
      } else {
        res.status(403).json({
          msg: "user Not Authorized To This Course",
        });
      }
    } else {
      res.status(401).json({
        msg: req.authFailed,
      });
    }
  })
);

module.exports = router;
