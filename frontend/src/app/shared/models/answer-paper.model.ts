export interface AnswerPaper {
    studentId?: string,
    questionPaperId?: string,
    responses?: {
        questionId?: string,
        response?: string
    }[],
    subjectName?: string //this is needed to add it to the results subjects array
}