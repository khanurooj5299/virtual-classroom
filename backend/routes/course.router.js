const express = require('express');

const verifyJwt = require('../auth-middleware/verify-jwt');
const courseController = require('../controllers/course.controller');

const router = express.Router();

router.post('/add-course', verifyJwt, courseController.addCourse);

router.get('/get-courses', verifyJwt, courseController.getCourses);

router.get('/get-course-number', verifyJwt, courseController.getCourseNumber);

router.get('/get-courses-for-courses-component', verifyJwt, courseController.getCoursesForCoursesComponent);

router.get('/get-courses-for-admit-card-component', verifyJwt, courseController.getCoursesForAdmitCardComponent);

router.get('/get-courses-for-student-courses-component', verifyJwt, courseController.getCoursesForStudentCoursesComponent);

router.get('/search-courses/:searchValue', verifyJwt, courseController.searchCourses);

router.get('/:courseId/get-course-and-subjects', verifyJwt, courseController.getCourseAndSubjects);

router.get('/:courseId/get-course-subjects', verifyJwt, courseController.getCourseSubjects);

router.get('/:courseId/get-course-subjects-for-subjects-component', verifyJwt, courseController.getCourseSubjectsForSubjectsComponent);

router.put('/:courseId/update-course', verifyJwt, courseController.updateCourse);

module.exports = router;