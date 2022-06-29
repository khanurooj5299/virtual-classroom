const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const userRouter = require('./routes/user.router');
const adminRouter = require('./routes/admin.router');
const staffRouter = require('./routes/staff.router');
const courseRouter = require('./routes/course.router');
const subjectRouter = require('./routes/subject.router');
const studentRouter = require('./routes/student.router');
const addressRouter = require('./routes/address.router');
const config = require('./env/config');

const app = express();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log('connection to DB created successfully.');
}).catch((err)=>{
    console.log('error : '+err);
});

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/staff', staffRouter);
app.use('/course', courseRouter);
app.use('/subject', subjectRouter);
app.use('/student', studentRouter);
app.use('/address', addressRouter);

app.listen(process.env.PORT, ()=>{
    console.log(`server listening on port ${process.env.PORT}`);
})