// Importing required modules and libraries
import mongoose from "mongoose";  // MongoDB object modeling tool
import axios from "axios";  // Promise-based HTTP client for making requests
import { MongoClient } from "mongodb";  // MongoDB driver for Node.js
import dotenv from "dotenv";  // Loads environment variables from a .env file
import bodyParser from "body-parser";  // Parses incoming request bodies
import express from "express";  // Web application framework for Node.js
import { dirname } from "path";  // Provides directory-related functionality
import { fileURLToPath } from "url";  // Provides URL-related functionality
import Student from "./public/models/student.js"; // Import the named export 'Student' from the specified path
import Instructor from "./public/models/instructor.js";  // Import the named export 'Instructor'
import Exam from "./public/models/exams.js";  // Import the named export 'Exam'
import Grade from "./public/models/grades.js";  // Import the named export 'Grade'
import excel from "exceljs";  // Excel spreadsheet generation library
import cookieParser from "cookie-parser";  // Parses cookies attached to the client's request object
import session from "express-session";  // Session middleware for Express
import JWT from "jsonwebtoken";  // JSON Web Token implementation for Node.js
import moment from "moment/moment.js";  // Library for parsing, validating, manipulating, and formatting dates

// Load environment variables from a .env file
dotenv.config();

// Get the current directory name using Node.js modules
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

// Retrieve the MongoDB connection string from the environment variables
const uri = process.env.MONGODB_CONNECTION_STRING;

// Connect to MongoDB using Mongoose
mongoose
  .connect("mongodb+srv://jazzyekh:Jazzy112233@gp-cluster.onn8xk6.mongodb.net/gp_collage?retryWrites=true&w=majority", {
    // mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected !");
  })
  .catch((e) => {
    console.log(e);
  });

// Function to generate a random code with a specified length
function generateRandomCode(x) {
  const digits = "01234567890";
  let CODe = "TC_";

  for (let i = 0; i < x; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    CODe += digits[randomIndex];
  }

  return CODe;
}

// Set up middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Set the application to use the EJS view engine
app.set("view engine", "ejs");

// Set up middleware to parse JSON bodies
app.use(express.json());

// Set up middleware to parse cookies
app.use(cookieParser());

// Set up middleware for handling sessions
app.use(
  session({
    secret: "mysuperSecret",
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware to check if an instructor is authenticated
const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.JWT_TOKEN;
  // console.log({token})
  // return
  if (token) {
    JWT.verify(token, "mysuperSecret", async (err, decoded) => {
      console.log({ decoded });
      // return
      if (err) {
        res.redirect("/"); // Redirect to the login page if token verification fails
      } else {
        // Token is valid, check the user in the database
        const user = await Instructor.findById(decoded._id);
        if (err || !user) {
          res.redirect("/"); // Redirect to the login page if the user is not found
        } else {
          req.session.user = user;
          next(); // User is authenticated
        }
      }
    });
  } else {
    res.redirect("/"); // Redirect to the login page if no token is found
  }
};

// Middleware to check if a student is authenticated
const authenticateStudent = async (req, res, next) => {
  const token = req.cookies.JWT_TOKEN;
  // console.log({token})
  // return
  if (token) {
    JWT.verify(token, "mysuperSecret", async (err, decoded) => {
      console.log({ decoded });
      // return
      if (err) {
        res.redirect("/"); // Redirect to the login page if token verification fails
      } else {
        // Token is valid, check the user in the database
        const user = await Student.findById(decoded._id);
        if (err || !user) {
          res.redirect("/"); // Redirect to the login page if the user is not found
        } else {
          req.session.user = user;
          next(); // User is authenticated
        }
      }
    });
  } else {
    res.redirect("/"); // Redirect to the login page if no token is found
  }
};

// Set up static file serving for the 'public' directory
app.use(express.static("public"));

//------------------------------------------------

//------------------------------------------------

//homepage
app.get("/", (req, res) => {
  // res.sendFile(`${__dirname}/index.html`);
  res.render("index", { pageTitle: 'Watheeq' });
});

//------------------------------------------------

//login student
app.post("/studentLogin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  console.log(req.body.email);
  console.log(req.body.password);

  try {
    // Find the student by email
    const student = await Student.findOne({ email: req.body.email });
    // student.forEach((student) => {
    // console.log("Student found in database:", student); // Log the student found
    //});
    // If the student does not exist, return an error
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Compare the provided plaintext password with the stored plaintext password
    if (password !== student.password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate an authentication token for the student
    const token = await student.AuthUser();
    console.log({ token });
    // Set the JWT token as a cookie in the response
    res.cookie("JWT_TOKEN", token);
    // Store the authenticated student in the session
    req.session.user = student;
    res.redirect("/student");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/student", authenticateStudent, async (req, res) => {
  // Retrieve completed tests for the authenticated student from the database
  const completedTests = await Grade.find({ studentId: req.session.user._id });
  // Retrieve all available tests from the database
  const allTests = await Exam.find();
  // Filter the tests to find upcoming tests that the student has not attended
  const upcomingTests = allTests.filter(
    (item) => !item.attendedStutends.includes(req.session.user._id)
  );

  // Generate a random access code for the student
  const accessCode = generateRandomCode(10);
  console.log(accessCode);

  res.render("studentDashboard", { upcomingTests, completedTests });
});

//------------------------------------------------

//login instructor
app.post("/instructor", async (req, res) => {
  const password = req.body.password;

  console.log(req.body.email);
  console.log(req.body.password);

  try {
    // Find the student by email
    const instructor = await Instructor.findOne({ email: req.body.email });
    // student.forEach((student) => {
    console.log("instructor found in database:", instructor); // Log the student found
    //});
    // If the student does not exist, return an error
    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    // Compare the provided plaintext password with the stored plaintext password
    if (password !== instructor.password) {
      return res.status(401).json({ message: "Incorrect password" });
    }


    // Generate an authentication token for the instructor
    const token = await instructor.AuthUser();
    console.log({ token });

    // Set the JWT token as a cookie in the response
    res.cookie("JWT_TOKEN", token);

    // Store the authenticated instructor in the session
    req.session.user = instructor;

    // Retrieve exams from the database and sort them by status
    const exams = await Exam.find().sort({ status: -1 });

    // Render the "instructorDashboard" view with user information and exams data
    res.render("instructorDashboard", {
      user: instructor,
      form: 0,
      examId: null,
      allExams: exams,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Handling GET request for the "/instructor" route, with authentication middleware
app.get("/instructor", isAuthenticated, async (req, res) => {

  // Retrieve exams from the database and sort them by status
  const exams = await Exam.find().sort({ status: -1 });
  console.log({ exams });

  res.render("instructorDashboard", {
    user: req.session.user,
    form: 0,
    examId: null,
    allExams: exams,
  });
});

//------------------------------------------------


//------------------------------------------------

//getting grades page
app.get("/studentGrades", authenticateStudent, async (req, res) => {
  const grades = await Grade.find({ studentId: req.session.user._id });
  res.render("studentGrades", { grades });
});

app.get("/deleteExam/:id", isAuthenticated, async (req, res) => {
  await Exam.findOneAndDelete({ _id: req.params.id });

  const exams = await Exam.find();
  res.render("instructorDashboard", {
    user: req.session.user,
    form: 0,
    examId: null,
    allExams: exams,
  });
});

app.post("/makeAnnounment", isAuthenticated, async (req, res) => {
  // handdle announcement stuff here
  const exams = await Exam.find();

  res.render("instructorDashboard", {
    user: req.session.user,
    form: 0,
    examId: null,
    allExams: exams,
  });
});

//------------------------------------------------

//getting exam page
app.post("/enterTest", authenticateStudent, async (req, res) => {
  try {
    const exam = await Exam.findOne({ accessCode: req.body.accessCode });

    if (exam.attendedStutends.includes(req.session.user._id)) {
      return res.send("You Aleady Had Given This Exam  !");
    }
    if (exam.status !== "UPCOMING") {
      return res.send("Exam is already Finished !");
    }

    const testDate = moment(exam.testDate).startOf("day");
    const currentDate = moment().startOf("day");

    if (testDate.isAfter(currentDate)) {
      // Test date hasn't arrived yet
      return res.status(403).send("Quiz is not available yet.");
    }

    res.redirect(`studentExam/${req.body.accessCode}/0`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/studentExam/:accessCode/:qid", async (req, res) => {
  const { accessCode, qid } = req.params;
  // console.log(accessCode , qid)
  // return
  try {
    const exam = await Exam.findOne({ accessCode });
    console.log({ exam });

    const referenceDate = moment().format("YYYY-MM-DD");

    // Parse the starting and ending times using moment, adding the reference date
    const startMoment = moment(
      `${referenceDate} ${exam.startingTime}`,
      "YYYY-MM-DD HH:mm"
    );
    const endMoment = moment(
      `${referenceDate} ${exam.endingTime}`,
      "YYYY-MM-DD HH:mm"
    );

    // Calculate the duration in minutes
    const durationMinutes = endMoment.diff(startMoment, "minutes");
    // console.log({durationMinutes})
    res.render("studentExam", { exam, moment, durationMinutes, qid });
  } catch (error) {
    console.error(error);
    res.redirect("/student");
  }
});

app.get("/submitQuestion", (req, res) => {
  console.log({ first });
});

app.post("/submitQuestion", authenticateStudent, async (req, res) => {
  console.log(req.body);
  const qid = Number(req.body.qid);
  const exam = await Exam.findById(req.body.examId);

  let grade;
  grade = await Grade.findOne({
    $and: [{ examId: req.body.examId }, { studentId: req.session.user._id }],
  });
  if (grade) {
    console.log("grade found");
  } else {
    console.log("no grade");
    const result = new Grade({
      examId: req.body.examId,
      examDate: exam.testDate,
      examTitle: exam.title,
      testDescription: exam.description,
      totalGrades: 0,
      studentId: req.session.user._id,
      questions: [req.body.question_id],
    });

    grade = await result.save();
  }
  if (Number(req.body.option) === Number(req.body.correctAnswer)) {
    grade.totalGrades += Number(req.body.questionGrade);
    await grade.save();
  }
  if (exam) {
    if (exam.questions.length > qid + 1) {
      return res.redirect(`studentExam/${exam.accessCode}/${qid + 1}`);
    } else {
      exam.attendedStutends.push(req.session.user);
      await exam.save();
      const grades = await Grade.find({ studentId: req.session.user._id });
      const studentDetail = await Student.find({ _id: req.session.user._id });

      const lastGrade = grades[grades.length - 1];
      const studentDetailIndex = studentDetail[0];

      const studentName = studentDetailIndex.name;
      const studentEmail = studentDetailIndex.email;
      const studentMarks = lastGrade.totalGrades;
      const examName = lastGrade.examTitle;

      const apiUrl = "http://localhost:3001/submit"; // Replace with the actual URL
      const requestBody = {
        examName: examName,
        studentName: studentName,
        studentEmail: studentEmail,
        studentMarks: studentMarks.toString(),
      };

      // Send POST request
      axios
        .post(apiUrl, requestBody)
        .then((response) => {
          console.log("Response:", response.data);
          // Handle the response as needed
        })
        .catch((error) => {
          console.error("Error:", error.message);
          // Handle errors
        });
      return res.redirect(`/studentGrades`);
    }
  }
});

app.get("/editExam/:id", isAuthenticated, async (req, res) => {
  console.log(req.params.id);
  const exams = await Exam.find();
  const exam = await Exam.findById(req.params.id);
  console.log({ instructorId: exam.instructorId });
  console.log({ userId: req.session.user._id });
  if (!exam.instructorId.equals(req.session.user._id)) {
    // The ObjectIds are equal
    return res.send("You can't Edit This Exam !!!");
  }
  res.render("editExam", {
    user: req.session.user,
    form: 0,
    examId: exam,
    allExams: exams,
  });
});

app.get(
  "/updateQuestion/:examId/:questionId",
  isAuthenticated,
  async (req, res) => {
    const { examId, questionId } = req.params;
    const exam = await Exam.findById(examId);
    const question = await Exam.findOne({ _id: examId }, { "questions.$": 1 })
      .where("questions._id")
      .equals(questionId)
      .exec();

    if (question) {
      console.log(question.questions[0]);
      res.render("updateQuestion", {
        user: req.session.user,
        form: 0,
        examId: exam,
        allExams: null,
        question: question.questions[0],
      });
    } else {
      console.log("Question not found");
    }
  }
);
app.get(
  "/deleteQuestion/:examId/:questionId",
  isAuthenticated,
  async (req, res) => {
    const { examId, questionId } = req.params;
    const exam = await Exam.findById(examId);
    const removedQuestion = await Exam.findOneAndUpdate(
      { _id: examId },
      {
        $pull: {
          questions: { _id: questionId },
        },
      },
      { new: true, useFindAndModify: false }
    );

    if (removedQuestion) {
      res.render("editExam", {
        user: req.session.user,
        form: 0,
        examId: exam,
        allExams: null,
      });
    } else {
      console.log("Question not found");
    }
  }
);

app.post("/updateQuestion", isAuthenticated, async (req, res) => {
  console.log("body", req.body);
  const options = [
    req.body.option0,
    req.body.option1,
    req.body.option2,
    req.body.option3,
  ];

  const updateQuestion = async (examId, questionId, newQuestionData) => {
    try {
      const updatedExam = await Exam.findOneAndUpdate(
        { _id: examId, "questions._id": questionId },
        {
          $set: {
            "questions.$": newQuestionData,
          },
        },
        { new: true, useFindAndModify: false }
      );

      if (!updatedExam) {
        throw new Error("Question not found or Exam not found");
      }

      return updatedExam;
    } catch (error) {
      throw error;
    }
  };

  // Usage
  // const examId = '653b922e05725a4bd0b47af5'; // Replace with the actual examId
  // const questionId = '653b923f05725a4bd0b47af9'; // Replace with the actual questionId
  const newQuestionData = {
    question: req.body.question,
    choices: options,
    correctAnswerIndex: req.body.correctAnswerIndex,
    grade: req.body.grade,
  };

  const exam = await Exam.findById(req.body.examId);

  updateQuestion(req.body.examId, req.body.questionId, newQuestionData)
    .then((updatedExam) => {
      console.log("Question updated successfully:", updatedExam);
      res.render("editExam", {
        user: req.session.user,
        form: 0,
        examId: exam,
        allExams: null,
      });
    })

    .catch((error) => {
      console.error("Error:", error.message);
    });
});

app.post("/editExam", isAuthenticated, async (req, res) => {
  console.log(req.body);
  const {
    examTitle,
    startingTime,
    endingTime,
    grade,
    status,
    description,
    testDate,
    instructorId,
  } = req.body;
  const exam = await Exam.findById(req.body.examId);
  if (!exam) {
    return res.send("No Exam Found !");
  } else {
    exam.title = examTitle;
    exam.startingTime = startingTime;
    exam.endingTime = endingTime;
    exam.grade = grade;
    exam.status = status;
    exam.description = description;
    exam.testDate = testDate;
    exam.accessCode = req.body.accessCode;
    await exam.save();
  }
  const exams = await Exam.find();
  res.render("instructorDashboard", {
    user: req.session.user,
    form: 0,
    examId: null,
    allExams: exams,
  });
});

app.get("/s-exam.html", (req, res) => {
  res.sendFile(`${__dirname}/s-exam.html`);
});

//------------------------------------------------

//------------------------------------------------

// Display the edit test form
app.get("/views/editTest.ejs", (req, res) => {
  // Render the editTest.ejs template
  res.render("/views/editTest.ejs", { testName });
});

// Handle the form submission
app.post("/views/editTest.ejs", (req, res) => {
  try {
    // Process the form data here
    const testName = req.body.examTitle;

    // Redirect to another page after form submission
    res.render("/views/ins-home.ejs", { testName });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//------------------------------------------------

app.get("/views/ins-home.ejs", (req, res) => {
  const examTitle = req.query.examTitle; // Retrieve examTitle from the query parameters

  res.render("/views/editTest.ejs", {
    examTitle: examTitle,
    action: "/exams",
    examTitle: "",
    questions: [],
    choices: [],
    correctAnswers: [],
  });
});

// Handle exam creation/edit form submission
app.post("/create-exam", async (req, res) => {
  const {
    examTitle,
    startingTime,
    endingTime,
    grade,
    description,
    testDate,
    instructorId,
  } = req.body;
  console.log({ body: req.body });
  // return
  // Create or update the exam in MongoDB
  const exam = new Exam({
    title: examTitle,
    startingTime,
    endingTime,
    grade,
    description,
    testDate,
    instructorId,
    accessCode: generateRandomCode(10),
  });

  try {
    await exam.save();
    const exams = await Exam.find();

    res.render("instructorDashboard", {
      user: req.session.user,
      form: 1,
      examId: exam._id,
      allExams: exams,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving the exam.");
  }
});

app.get("/add-question/:examId", isAuthenticated, async (req, res) => {
  const exam = await Exam.findById(req.params.examId);
  try {
    const exams = await Exam.find();

    res.render("instructorDashboard", {
      user: req.session.user,
      form: 1,
      examId: exam._id,
      allExams: exams,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving the exam.");
  }
});

app.post("/addQuestions", async (req, res) => {
  console.log(req.body);
  const {
    question,
    option1,
    option2,
    option3,
    option4,
    examId,
    correctAnswerIndex,
    grade,
  } = req.body;
  const choices = [option1, option2, option3, option4];
  console.log({ choices });
  const exam = await Exam.findById(examId);
  if (exam) {
    exam.questions.push({
      question,
      choices,
      correctAnswerIndex,
      grade,
    });
  }
  await exam.save();
  const exams = await Exam.find();

  res.render("instructorDashboard", {
    user: req.session.user,
    form: 1,
    examId,
    allExams: exams,
  });
});

//Reema Alolayan Page s-home Start

app.get("/s-home", (req, res) => {
  res.render("s-home", {
    array: ArrCom,
  });

  res.sendFile(`${__dirname}/s-home`);
});

app.post("/s-home", function (req, res) {
  ArrCom.forEach(function (Shome) {
    ArrCom.pop();
  });

  res.redirect("/s-home");
});

app.post("/ins-home", function (req, res) {
  //completed
  const Com = {
    TestName: req.body.TestName,
    TestDate: req.body.TestDate,
  };

  ArrCom.push(Com);
});

//Reema Alolayan Page s-home End

// EMTENAN s-esam page start -----------------------------
app.post("/submit", (req, res) => {
  // Handle the form submission here

  const answer = req.body.answer;
  // Handle the answer as needed, e.g., save it to a database or send a response
  console.log("Received answer:", answer);

  // You can customize the response or redirect as needed
  res.send("Answer received: " + answer);
});

// excel code

// Sample data (replace with your data)
// const data = [
//   { name: 'John', age: 30, city: 'New York' },
//   { name: 'Alice', age: 25, city: 'Los Angeles' },
//   // Add more data here
// ];

app.get("/export-excel", async (req, res) => {
  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet("Data");
  const grades = await Grade.find().populate("studentId");
  const data = [];

  grades.forEach((grade) => {
    data.push({
      studentName: grade.studentId.name,
      studentEmail: grade.studentId.email,
      examTitle: grade.examTitle,
      examDate: grade.examDate,
      totalGrades: grade.totalGrades,
    });
  });

  // Define the columns
  worksheet.columns = [
    { header: "Student Name", key: `studentName`, width: 30 },
    { header: "Student Email", key: `studentEmail`, width: 30 },
    { header: "Exam Title", key: "examTitle", width: 15 },
    { header: "Total Grades", key: "totalGrades", width: 15 },
    { header: "Exam Date", key: "examDate", width: 30 },
  ];

  // Add the data
  data.forEach((item) => {
    worksheet.addRow(item);
  });

  // Set the response headers for the Excel file
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${data[0]?.examTitle}-grades.xlsx`
  );

  // Send the workbook as a response
  workbook.xlsx.write(res).then(function () {
    res.end();
  });
});

app.get("/export_exam/:id", async (req, res) => {
  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet("Data");
  const grades = await Grade.find({ examId: req.params.id }).populate(
    "studentId"
  );
  console.log(grades);
  const data = [];

  grades.forEach((grade) => {
    data.push({
      studentName: grade.studentId.name,
      studentEmail: grade.studentId.email,
      examTitle: grade.examTitle,
      examDate: grade.examDate,
      totalGrades: grade.totalGrades,
    });
  });

  // Define the columns
  worksheet.columns = [
    { header: "Student Name", key: "studentName", width: 30 },
    { header: "Student Email", key: "studentEmail", width: 30 },
    { header: "Exam Title", key: "examTitle", width: 15 },
    { header: "Total Grades", key: "totalGrades", width: 15 },
    { header: "Exam Date", key: "examDate", width: 30 },
  ];

  // Add the data
  data.forEach((item) => {
    worksheet.addRow(item);
  });

  // Set the response headers for the Excel file
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${data[0]?.examTitle}-grades.xlsx`
  );

  // Send the workbook as a response
  workbook.xlsx.write(res).then(function () {
    res.end();
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("JWT_TOKEN");
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
