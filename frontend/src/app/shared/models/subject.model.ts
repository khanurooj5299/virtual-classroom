import { SubjectContent } from './subject-content.model';

export interface Subject {
    _id?: string,
    name?: string,
    description?: string,
    requirements?: string,
    instructor?: string,
    courseId?: string,
    content?: SubjectContent[]
}