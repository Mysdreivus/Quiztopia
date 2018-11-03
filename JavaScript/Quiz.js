export class Quiz {
    costructor() {
      this.name = "";
      this.description = "";
      this.questions = [];
    }

    setName(name) {
      this.name = name;
    }

    setDescription(description) {
      this.description = description;
    }
    addQuestion(question) {
        this.questions.push(question);
    }

    getQuestion() {
        return this.questions;
    }
}
// module.exports = Quiz;
