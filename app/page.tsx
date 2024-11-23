'use client';
import styles from './page.module.css';


export default function Home() {

  document.addEventListener('DOMContentLoaded', async () => {
    const fileSelect = document.getElementById('file-select') as HTMLSelectElement;
    const startButton = document.getElementById('start-button') as HTMLButtonElement;
    const modeSelect = document.getElementById('mode-select') as HTMLSelectElement;
    const questionContainer = document.getElementById('question-container') as HTMLElement;
    const questionNumberContainer = document.getElementById('question-number') as HTMLElement;
    const questionTextContainer = document.getElementById('question-text') as HTMLElement;
    const answersContainer = document.getElementById('answers-container') as HTMLElement;
    const nextButton = document.getElementById('next-button') as HTMLButtonElement;
    const resultContainer = document.getElementById('result-container') as HTMLElement;
    const quickViewContainer = document.getElementById('quick-view-container') as HTMLElement;
    const quickViewContent = document.getElementById('quick-view-content') as HTMLElement;
    const quickViewAnswers = document.getElementById('quick-view-answers') as HTMLElement;
    const quickViewQuestion = document.getElementById('quick-view-question') as HTMLElement;
    const quickViewClose = document.getElementById('quick-view-close') as HTMLElement;
    const backButton = document.getElementById('back-button') as HTMLButtonElement;
    const titleTest = document.getElementById('title_test') as HTMLElement;
  
    let currentQuestionIndex = 0;
    let correctAnswers = 0;
    let selectedMode: 'normal' | 'cabinet' | 'quickview' = 'normal';
    let questions: Question[] = [];
    let quizFiles: Record<string, Question[]> = {};
    let incorrectlyAnsweredQuestions: number[] = [];
  
    interface Answer {
      text: string;
      correct: boolean;
    }
  
    interface Question {
      question: string;
      answers: Answer[];
    }
  
    async function fetchFiles(): Promise<void> {
      try {
        const response = await fetch('https://api.github.com/repos/sergey-05/custom_quiz/contents/');
        const data = await response.json();
        const jsFiles = data.filter((file: { name: string }) => file.name.endsWith('.js'));
  
        jsFiles.forEach((file: { name: string }) => {
          const option = document.createElement('option');
          option.value = file.name;
          option.textContent = file.name;
          fileSelect.appendChild(option);
        });
      } catch (error) {
        console.error('Ошибка загрузки файлов:', error);
      }
    }
  
    await fetchFiles();
  
    async function loadScript(url: string): Promise<string> {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Не удалось загрузить скрипт: ${url}`);
      }
      return await response.text();
    }
  
    fileSelect.addEventListener('change', async (event) => {
      const selectedFile = (event.target as HTMLSelectElement).value;
      if (selectedFile) {
        try {
          const scriptContent = await loadScript(`https://sergey-05.github.io/custom_quiz/${selectedFile}`);
          const scriptFunction = new Function(scriptContent + ';\nreturn questions;');
          const questionsData = scriptFunction() as Question[];
          quizFiles[selectedFile] = questionsData;
        } catch (error) {
          alert('Не удалось загрузить вопросы. Пожалуйста, проверьте файл.');
          console.error(error);
        }
      }
    });
  
    startButton.addEventListener('click', () => {
      const selectedFile = fileSelect.value;
      if (quizFiles[selectedFile] && quizFiles[selectedFile].length > 0) {
        questions = quizFiles[selectedFile];
        startQuiz();
      } else {
        alert('Пожалуйста, выберите файл для тестирования.');
      }
    });
  
    modeSelect.addEventListener('change', (event) => {
      selectedMode = (event.target as HTMLSelectElement).value as 'normal' | 'cabinet' | 'quickview';
    });
  
    function getRandomQuestions(array: Question[], num: number): Question[] {
      const shuffled = array.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, num);
    }
  
    function startQuiz(): void {
      const fileSelectContainer = document.getElementById('file-select-container') as HTMLElement;
      fileSelectContainer.style.display = 'none';
      backButton.style.display = 'block';
  
      if (selectedMode === 'cabinet' && questions.length > 50) {
        questions = getRandomQuestions(questions, 50);
      }
  
      questionContainer.style.display = 'block';
      nextButton.textContent = 'Проверить ответы';
      showQuestion(questions[currentQuestionIndex]);
    }
  
    function showQuestion(question: Question): void {
      questionNumberContainer.textContent = `Вопрос ${currentQuestionIndex + 1}/${questions.length}`;
      questionTextContainer.textContent = question.question;
      answersContainer.innerHTML = '';
  
      const isSingleAnswer = question.answers.filter(answer => answer.correct).length === 1;
  
      question.answers.forEach((answer, index) => {
        const answerElement = document.createElement('div');
        answerElement.classList.add('answer');
  
        const inputId = `answer-${currentQuestionIndex}-${index}`;
  
        const input = document.createElement('input');
        input.type = isSingleAnswer ? 'radio' : 'checkbox';
        input.name = `answer-${currentQuestionIndex}`;
        input.id = inputId;
        input.value = index.toString();
  
        const label = document.createElement('label');
        label.htmlFor = inputId;
        label.textContent = answer.text;
  
        answerElement.appendChild(input);
        answerElement.appendChild(label);
  
        answersContainer.appendChild(answerElement);
      });
    }
  
    function highlightAnswers(): void {
      const selectedInputs = Array.from(answersContainer.querySelectorAll('input:checked')) as HTMLInputElement[];
  
      questions[currentQuestionIndex].answers.forEach((answer, index) => {
        const answerElement = answersContainer.children[index] as HTMLElement;
        if (answer.correct) {
          if (selectedInputs.some(input => input.value === index.toString())) {
            answerElement.classList.add('correct-selected');
          } else {
            answerElement.classList.add('correct');
          }
        } else {
          if (selectedInputs.some(input => input.value === index.toString())) {
            answerElement.classList.add('incorrect');
          }
        }
      });
    }
  
    function checkAnswer(): void {
      const selectedInputs = Array.from(answersContainer.querySelectorAll('input:checked')) as HTMLInputElement[];
  
      const isSingleAnswer = questions[currentQuestionIndex].answers.filter(answer => answer.correct).length === 1;
      const allAnswered = isSingleAnswer
        ? selectedInputs.length === 1
        : selectedInputs.length > 0;
  
      if (!allAnswered) {
        alert('Пожалуйста, выберите ответ.');
        return;
      }
  
      highlightAnswers();
  
      const correct = questions[currentQuestionIndex].answers.every((answer, index) => {
        const input = answersContainer.children[index].querySelector('input') as HTMLInputElement;
        return (answer.correct && input.checked) || (!answer.correct && !input.checked);
      });
  
      if (!correct && !incorrectlyAnsweredQuestions.includes(currentQuestionIndex)) {
        incorrectlyAnsweredQuestions.push(currentQuestionIndex);
      }
    }
  
    // Дополнительные функции (showQuickView, closeQuickView, showResult) могут быть реализованы аналогично.
  });
  


  return (
    <div className={styles.container}>
  <h1 id="title_test" className='pb-3 text-[#007bff] text-2xl'>Тестирование</h1>
  <div id="file-select-container">
    <select id="file-select">
      <option value="">Выберите файл</option>
    </select>
    <div id="mode-select">
  <div>
    <input type="radio" id="mode-normal" name="mode" value="normal" checked/>
    <label htmlFor="mode-normal">Обычный режим</label>
  </div>
  <div>
    <input type="radio" id="mode-cabinet" name="mode" value="cabinet"/>
    <label htmlFor="mode-cabinet">Тест-кабинет</label>
  </div>
  <div>
    <input type="radio" id="mode-quickview" name="mode" value="quickview"/>
    <label htmlFor="mode-quickview">Быстрый просмотр</label>
  </div>
</div>

    <button id="start-button">Начать</button>
  </div>
  <div id="question-container" className='hidden'>
    <div id="question-number"></div>
    <div id="question-text"></div>
    <div id="answers-container"></div>
    <button id="next-button">Проверить ответы</button>
  </div>
  <button id="back-button" className='hidden'>Вернуться на главный экран</button>
  <div id="result-container"></div>

  <div id="quick-view-container">
  <div id="quick-view-content">
    <span id="quick-view-close">&times;</span>
    <h2 id="quick-view-question">Все вопросы и ответы</h2>
    <div id="quick-view-answers"></div>
  </div>
</div>
</div>

  );
}
