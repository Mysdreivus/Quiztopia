/*
import { Quiz } from './Quiz.js';
import { Question } from './Question.js';

let Quiz = require("./Quiz.js");
let Question = require("./Question.js");
*/

function submitQuiz() {
    alert("Entered submitQuiz");
    let questionIds = ["question_1"];
    let correctAnswerIds = ["correct_answer_1"];
    let wrongAnswersIds = [["wrong_answer1", "wrong_answer2", "wrong_answer3"]];
    let quiz_name = document.getElementById("quiz_name").value;
    let category = document.getElementById("category").value;
    let quiz_description = document.getElementById("quiz_description").value;
    // TODO: user id needs to inserted into the quiz s well

    alert("Going to add something");
    let databaseRef = firebase.database().ref().child(category + "/" + quiz_name);
    let questions = {};

    for (let i = 0; i < questionIds.length; i++) {
        questions[questionIds[i]] = {
            question: document.getElementById(questionIds[i]).value,
            correct_answer: document.getElementById(correctAnswerIds[i]).value,
            wrong_answers1: document.getElementById(wrongAnswersIds[i][0]).value,
            wrong_answers2: document.getElementById(wrongAnswersIds[i][1]).value,
            wrong_answers3: document.getElementById(wrongAnswersIds[i][2]).value
        };
        databaseRef.set({
            description: quiz_description,
            questions: questions
        });
    }
    alert("Added stuffs to database");

    // TODO: this is not working
    /*
    databaseRef.child(category).child(quiz_name).set(true);
    alert("databaseRef: " + typeof(databaseRef));
    let questions = {};
    alert("Added something in firebase");
    */


    /*
    let quiz = new Quiz();
    alert("Quiz name: " + document.getElementById("quiz_name").value);
    alert("Question text: " + document.getElementById("question_1").value);

    quiz.setName(document.getElementById("quiz_name").value);

    // let questionIds = ["question_1", "question_2", "question_3", "question_4",
    // "question_5", "question_6", "question_7", "question_8", "question_9", "question_10"];
    for (let i = 0; i < questionIds.length; i++) {
      let question = new Question();
      question.setQuestion(document.getElementById(questionIds[i]).value);
      alert(question.getQuestion());
      question.setCorrectAnswer(document.getElementById(correctAnswerIds[i]).value);
      for (let j = 0; j < 3; j++) {
        question.setWrongAnswers(document.getElemmentById(wrongAnswersIds[i][j]).value);
      }
      quiz.addQuestion(question);
    }
    */
}
