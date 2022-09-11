# Techdegree-project12
Rest API with Express
A Rest API App with Sequelize as ORM :-
  1) Two Models created inside the td-restapi.db 
    1 - User
    2 - Course
  2) Routes created to access data from both the Tables
    1) User -
       1) /api/users - GET
       2) /api/user - POST
    2) Courses -
      1) /api/courses - GET
      2) /api/courses/id - GET
      3) /api/courses - POST
      4) /api/courses/id - PUT
      5) /api/courses/id - DELETE
   3) User authentication done to acces the routes and make changes to specific Routes, Moreover, Only users that are connected to there specific Courses are able to Update and Delete,
       there respective Courses
