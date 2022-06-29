import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { Course } from "../models/course.model";

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    serverUrl = environment.serverUrl;

    constructor(private http: HttpClient) {}

    addCourse(course: Course, editMode: boolean) {
        if(editMode) {
            return this.http.put(`${this.serverUrl}course/${course._id}/update-course`, course);
        }
        else {
            return this.http.post(`${this.serverUrl}course/add-course`, course); 
        }
    }

    //gets all course documents in an array
    getCourses() {
        return this.http.get(`${this.serverUrl}course/get-courses`);
    }

    getCoursesForCoursesComponent() {
        return this.http.get(`${this.serverUrl}course/get-courses-for-courses-component`);
    }

    getCoursesForAdmitCardComponent() {
        return this.http.get(`${this.serverUrl}course/get-courses-for-admit-card-component`);
    }

    getCoursesForStudentCoursesComponent() {
        return this.http.get(`${this.serverUrl}course/get-courses-for-student-courses-component`);
    }

    searchCourses(searchValue: string) {
        return this.http.get(`${this.serverUrl}course/search-courses/${searchValue}`);
    }

    //gets the specified course document, along with its subjects
    getCourseAndSubjects(courseId: string) {
        return this.http.get(`${this.serverUrl}course/${courseId}/get-course-and-subjects`);
    }
    
    //gets all subjects(documents) of the specified course in an array
    getCourseSubjects(courseId: string) {
        return this.http.get(`${this.serverUrl}course/${courseId}/get-course-subjects`);
    }

    //gets all subjects(documents) of the specified course in an array
    getCourseSubjectsForSubjectsComponent(courseId: string) {
        return this.http.get(`${this.serverUrl}course/${courseId}/get-course-subjects-for-subjects-component`);
    }
}