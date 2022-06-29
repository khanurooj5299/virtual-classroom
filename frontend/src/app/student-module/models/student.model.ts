export interface Student {
    _id?: string,
    email?: string,
    courseId?: string,
    personalDetails ?: {
        firstname?: string,
        lastname?: string,
        gender?: string,
        dob?: string,
        age?: Number,
        fathersname?: string,
        mothersname?: string
    },
    addressDetails?: {
        current?: {
            houseNo?: string,
            city?: string,
            state?: string,
            pincode?: string,
            country?: string
        },
        permanent?: {
            houseNo?: string,
            city?: string,
            state?: string,
            pincode?: string,
            country?: string
        }
    },
    academicDetails?: {
        highestQualification?: string,
        secDetails?: {
            secBoard?: string,
            secMarksObtained?: number,
            secMarksTotal?: number,
            secPercentage?: number
        },
        senSecDetails?: {
            senSecBoard?: string,
            senSecMarksObtained?: number,
            senSecMarksTotal?: number,
            senSecPercentage?: number
        },
        gradDetails?: {
            gradBoard?: string,
            gradMarksObtained?: number,
            gradMarksTotal?: number,
            gradPercentage?: number
        }  
    },
    images?: {
        signImg?: any,
        selfImg?: any
    }
    enrollDate?: Date
}