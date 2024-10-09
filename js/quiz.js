
const searchParams = new URLSearchParams(location.search);
console.log(searchParams.get("id"));
const id = searchParams.get("id");

const baseURL = "http://localhost:5000";

const getQuizById = async (id) => {
  try {
    let questionNum = 0;
    const res = await fetch(`${baseURL}/quizzes/${id}`);//חיבור לדטה בייס
    const quiz = await res.json();//המרת הנתונים לאובייקט
    console.log(quiz);
    const quizData = document.querySelector("#quizData");//מכיל את כל פרטי השאלון
    let h1 = document.createElement("h1");
    h1.textContent = quiz.name;//כותרת השאלון
    quizData.append(h1);
    const questions = quiz.questions;//קבלת כל השאלות
    console.log(questions);
    const container = document.createElement("form");//מכיל את כל השאלות/תשובות
    container.classList.add("flex-col");
    for (const q of questions) {
      let answerNum = 0;
      questionNum++;
      const h4 = document.createElement("h4");
      h4.textContent = q.content;//תוכן השאלה
      container.appendChild(h4);
      for (const answer of q.answers) {//מעבר על כל התשובות ויצירת כפתורי רדיו
        answerNum++;
        const quizCon = document.createElement("div");
        quizCon.classList.add("flex-row");
        const label = document.createElement("label");
        label.htmlFor = `question_${questionNum}-answer_${answerNum}`;
        label.textContent = answer.content;
        const input = document.createElement("input");
        input.id = `question_${questionNum}-answer_${answerNum}`;
        input.type = "radio";
        input.name = `question_${questionNum}`;
        quizCon.appendChild(input);
        quizCon.appendChild(label);
        container.appendChild(quizCon);
      }
    }
    quizData.appendChild(container);

    const button = document.createElement("button");
    button.textContent = "חשב";
    button.addEventListener("click", () => {
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    });
    container.appendChild(button);
  } catch (error) {
    console.log(error);
  }
};
