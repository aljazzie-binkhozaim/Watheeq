import mongoose from "mongoose";

const { Schema, model } = mongoose;

const questionSchema = new Schema({
    question: String,
    choices: [String],
    correctAnswerIndex: Number,
    grade: Number
});

// Define the schema for the Exam model
const examSchema = new Schema({
    title: String,
    description: String,
    startingTime: String,
    endingTime: String,
    status : {type : String, default : "UPCOMING"},
    grade: Number,
    accessCode: String,
    testDate:Date,
    randomizeQuestions : Boolean,
    questions: [questionSchema],
    attendedStutends : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student' // Reference to the Instructor model
        }
    ],
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor' // Reference to the Instructor model
    }
});

// const Exam = mongoose.model('exams', examSchema);

// module.exports = Exam;

const Exam = model('Exam', examSchema );

export default Exam;
