import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "src/app/auth-module/services/auth.service";

import { environment } from "src/environments/environment";
import { Student } from "../models/student.model";

@Injectable({
    providedIn: 'root'
})
export class StudentService {
    serverUrl = environment.serverUrl;

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {}

    isEnrolled() {
        //this function works with userId and not studentId
        const loggedInUserId = localStorage.getItem('loggedInUserId');
        return this.http.get(`${this.serverUrl}student/${loggedInUserId}/is-enrolled`);
    }

    courseEnroll(student: Student) {
        return this.http.post(`${this.serverUrl}student/course-enroll`, student);
    }

    getStudent(email: string) {
        return this.http.get(`${this.serverUrl}student/${email}/get-student`);
    }

    getResultCard(queryObject: any): any{// queryObject should have courseId, subjectId and year
        const userId = localStorage.getItem('loggedInUserId');
        return this.http.post(`${this.serverUrl}student/${userId}/get-result-card`, queryObject);
    }

    getCertificate(inputs: any): any{ //inputs is an object containing rollNo, year and courseName
        const userId = localStorage.getItem('loggedInUserId');
        return this.http.post(`${this.serverUrl}student/${userId}/get-certificate`, inputs);
}
}