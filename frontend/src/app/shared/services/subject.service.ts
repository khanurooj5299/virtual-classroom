import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

import { SubjectContent } from 'src/app/shared/models/subject-content.model';
import { Subject } from "../models/subject.model";

@Injectable({
    providedIn: 'root'
})
export class SubjectService {
    serverUrl = environment.serverUrl;

    constructor(private http: HttpClient) {}

    addSubject(subject: Subject, editMode: boolean) {
        if(editMode) {
            return this.http.put(`${this.serverUrl}subject/${subject._id}/update-subject`, subject);
        }
        else {
            return this.http.post(`${this.serverUrl}subject/add-subject`, subject);
        }
    }

    removeSubject(subjectId: string) {
        return this.http.delete(`${this.serverUrl}subject/${subjectId}/remove-subject`);
    }

    addContentToSubject(subjectId: string, content: SubjectContent[]) {
        return this.http.post(`${this.serverUrl}staff/${subjectId}/add-content-to-subject`, content);
    }

    getSubjectContentForAdmitCardComponent(subjectId: string, addedBy: string|undefined) {
        return this.http.get(`${this.serverUrl}staff/${subjectId}/get-subject-content-for-admit-card-component/${addedBy}`);
    }

    removeSubjectContent(subjectId: string, fileId: string) {
        return this.http.get(`${this.serverUrl}staff/${subjectId}/remove-subject-content/${fileId}`);
    }
}