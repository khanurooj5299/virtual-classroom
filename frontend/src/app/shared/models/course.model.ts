export interface Course {
    _id?: string,
    name?: string;
    code?: string;
    duration?: string;
    credits?: number;
    description?: string;
    image?: any,
    requirements?: string[],//
    learningObjectives?: string[],//
    rating?: any,  
    subjects?: any,
    detailedDescription?: string
}