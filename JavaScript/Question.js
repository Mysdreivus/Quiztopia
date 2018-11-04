export class Question {
    constructor() {
        this.question = '';
        this.correct_answer = '';
        this.wrong_answers = [];
    }

    setQuestion(question) {
      this.question = question;
    }

    setCorrectAnswer(answer) {
      this.correct_answer = answer;
    }

    setWrongAnswers(wrongAnswer) {
      this.wrong_answers.push(wrongAnswer);
    }
    getQuestion() {
        return this.question;
    }

    getCorrectAnswer() {
        return this.correct_answer;
    }

    getWrongAnswers() {
        return this.wrong_answers;
    }
}

// module.exports = Question;
