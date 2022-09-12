'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const sequelize = require('./models/index.js').sequelize;
const userRouter = require('./routes/userRouter');
const courseRouter = require('./routes/courseRouter');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();
app.use(express.json());

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// Authenticating Sequelize
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

app.use('/api/users', userRouter);
app.use('/api/courses', courseRouter);

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  console.log(err.errors[0]);
  console.log(err);

  if (err.errors[0].type === 'Validation error' || 'notNull Violation' || 'SequelizeUniqueConstraintError'){
    err.status = 400;
  }
  console.log(err.errors[0].type)
  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
