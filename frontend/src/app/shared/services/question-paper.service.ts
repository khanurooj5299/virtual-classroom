import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { QuestionPaper } from "../models/question-paper.model";
import { AnswerPaper } from "../models/answer-paper.model";

@Injectable({
    providedIn: 'root'
})
export class QuestionPaperService {
    serverUrl = environment.serverUrl;

    constructor(private http: HttpClient) {}

    setQuestionPaper(questionPaper: QuestionPaper) {
        return this.http.post(`${this.serverUrl}staff/set-question-paper`, questionPaper);
    }

    questionPaperExists(queryObject: any) {
        return this.http.post(`${this.serverUrl}staff/question-paper-exists`, queryObject);
    }

    addAnswerPaper(answerPaper: AnswerPaper) {
        return this.http.post(`${this.serverUrl}student/add-answer-paper`, answerPaper);
    }

    answerPaperExists(queryObject: any) {
        return this.http.post(`${this.serverUrl}student/answer-paper-exists`, queryObject);
    }

    getQuestion(questionPaperId: string|undefined, skip: number) {
        return this.http.get(`${this.serverUrl}student/${questionPaperId}/get-question/${skip}`);
    }
}