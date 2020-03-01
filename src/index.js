require('./db/mongoose');
const express = require('express');
const userRouter = require('./db/routers/user');
const taskRouter = require('./db/routers/task');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);  
app.use(taskRouter);


app.listen(port, () => `Server is up and running on ${port}`);
