/*
import { Quiz } from './Quiz.js';
import { Question } from './Question.js';

let Quiz = require("./Quiz.js");
let Question = require("./Question.js");
*/

function submitQuiz() {
    alert("Entered submitQuiz");
    let questionIds = ["question_1", "question_2", "question_3", "question_4", "question_5", "question_6"
                        ,"question_7", "question_8", "question_9", "question_10"];

    let correctAnswerIds = ["correct_answer_1", "correct_answer_2", "correct_answer_3", "correct_answer_4"
                            ,"correct_answer_5", "correct_answer_6", "correct_answer_7", "correct_answer_8"
                            ,"correct_answer_9", "correct_answer_10"];

    let wrongAnswersIds = [["wrong_answer1_1", "wrong_answer1_2", "wrong_answer1_3"]
                            ,["wrong_answer2_1", "wrong_answer2_2", "wrong_answer2_3"]
                            ,["wrong_answer3_1", "wrong_answer3_2", "wrong_answer3_3"]
                            ,["wrong_answer4_1", "wrong_answer4_2", "wrong_answer4_3"]
                            ,["wrong_answer5_1", "wrong_answer5_2", "wrong_answer5_3"]
                            ,["wrong_answer6_1", "wrong_answer6_2", "wrong_answer6_3"]
                            ,["wrong_answer7_1", "wrong_answer7_2", "wrong_answer7_3"]
                            ,["wrong_answer8_1", "wrong_answer8_2", "wrong_answer8_3"]
                            ,["wrong_answer9_1", "wrong_answer9_2", "wrong_answer9_3"]
                            ,["wrong_answer10_1", "wrong_answer10_2", "wrong_answer10_3"]];

    let quiz_name = document.getElementById("quiz_name").value;
    let category = document.getElementById("category").value;
    let quiz_description = document.getElementById("quiz_description").value;
    // TODO: user id needs to inserted into the quiz s well

    alert("Going to add something");
    let databaseRef = firebase.database().ref().child("quizzes/" + category + "/" + quiz_name);
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
