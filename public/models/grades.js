import mongoose from "mongoose";

const { Schema, model } = mongoose;

const questionSchema = new Schema({
    question: String,
    choices: [String],
    isCorrect : Boolean,
    correctAnswerIndex: Number,
    grade: Number
});

// Define the schema for the Exam model
const gradeSchema = new Schema({
    examTitle: String,

    examId:String,
    status : {type : String, default : "UPCOMING"},
    totalGrades: Number,
    examDate:Date,
    questions: [String],
    testDescription: String,
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student' // Reference to the Student model
    }
});



const Grade = model('Grade', gradeSchema );

export default Grade;
