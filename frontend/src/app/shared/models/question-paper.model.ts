import { Question } from "./question.model";

export interface QuestionPaper {
    year?: number,
    subjectId?: string,
    courseId?: string,
    questions?: Question[]
}