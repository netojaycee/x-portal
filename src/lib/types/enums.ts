export enum ENUM_ROLE {
    ADMIN = 'admin',
    SUPERADMIN = 'superAdmin'
    // Add other roles as needed (e.g., TEACHER, STUDENT)
}

export enum ENUM_GENDER {
    MALE = 'male',
    FEMALE = 'female',
}

export enum ENUM_MODULES {
    SCHOOL = "school",
    STUDENT = "student",
    STAFF = "staff",
    PARENT = "parent",
    USER = "user",
    SESSION = "session",
    SUBSCRIPTION = "subscription",
    SUBROLE = "subrole",
    CLASS = "class",
    CLASS_ARM = "classArm",
    SUBJECT = "subject",
    ADMISSION = "admission",
    ATTENDANCE = "attendance",
    CLASS_CATEGORY = "classCategory",
    MARKING_SCHEME = "markingScheme",
    GRADING_SYSTEM = "gradingSystem",
    CONTINUOUS_ASSESSMENT = "continuousAssessment",
    RESULT = "result",
    INVOICE = "invoice",
    DISCOUNT = "discount",
    OFFLINE_PAYMENT = "offlinePayment",
    EVENT = "event",
    CLASS_ARM_SUBJECT = "classArmSubject",
    CLASS_ARM_STUDENT = "classArmStudent",
    CLASS_ARM_STUDENT_SUBJECT = "classArmStudentSubject",
    CLASS_ARM_STUDENT_SUBJECT_RESULT = "classArmStudentSubjectResult",
    CLASS_ARM_STUDENT_SUBJECT_RESULT_TERM = "classArmStudentSubjectResultTerm",
    CLASS_ARM_STUDENT_SUBJECT_RESULT_TERM_SESSION = "classArmStudentSubjectResultTermSession",
    CLASS_ARM_STUDENT_SUBJECT_RESULT_SESSION = "classArmStudentSubjectResultSession",
    CLASS_ARM_STUDENT_SUBJECT_RESULT_SESSION_TERM = "classArmStudentSubjectResultSessionTerm",
    CLASS_ARM_STUDENT_SUBJECT_RESULT_SESSION_TERM_SUBJECT = "classArmStudentSubjectResultSessionTermSubject",
    CLASS_ARM_STUDENT_SUBJECT_RESULT_SESSION_TERM_SUBJECT_TERM = "classArmStudentSubjectResultSessionTermSubjectTerm",
    CLASS_ARM_STUDENT_SUBJECT_RESULT_SESSION_TERM_SUBJECT_SESSION = "classArmStudentSubjectResultSessionTermSubjectSession",
}

export enum ENUM_PERMISSION_SCOPE {
    PLATFORM = 'platform',
    SCHOOL = 'school',
}