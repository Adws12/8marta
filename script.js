const mainScreen = document.getElementById('main-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const easyModeButton = document.getElementById('easy-mode');
const hardModeButton = document.getElementById('hard-mode');
const timerElement = document.getElementById('timer');
const questionElement = document.getElementById('question');
const imageElement = document.getElementById('image');
const buttonsContainer = document.getElementById('buttons-container');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');
const backgroundMusic = document.getElementById('background-music');

let images = [];
let usedImages = [];
let timer;
let timeLeft = 20;
let score = 0;
let currentMode = null;

// Генерация списка изображений
for (let i = 1; i <= 62; i++) {
    images.push(`images/${i.toString().padStart(2, '0')}.png`);
}

// Режим "ПРОСТО"
const easyModeButtons = [
    "АХО", "коммерческий отдел", "ОДП", "ОКК", "ООТ", "отдел дизайна", 
    "отдел персонала", "отдел снабжения", "отдел технологов", "отдел хранения", 
    "производственный отдел", "секретарь", "финансовый отдел"
];

// Режим "ЧУТЬ СЛОЖНЕЕ"
const hardModeButtons = [
    "Лена", "Марина", "Аня", "Ира", "Света", "Таня", "Катя", "Настя", 
    "Олеся", "Оля", "Юля", "Аида", "Галя", "Даша", "Жанна", "Женя", 
    "Карина", "Кристина", "Лариса", "Лиля", "Маша", "Рита"
];

// Соответствие номеров файлов кнопкам
const easyModeMapping = {
     1: "коммерческий отдел", 2: "ОДП", 3: "коммерческий отдел", 4: "финансовый отдел",5: "коммерческий отдел", 
6: "коммерческий отдел",
7: "финансовый отдел",
8:"коммерческий отдел", 
9: "отдел дизайна",
10: "отдел персонала",
11: "отдел дизайна", 
12: "ОДП", 
13: "финансовый отдел",
14: "ОКК",
15: "ОДП", 
16: "ОКК", 
17: "коммерческий отдел",
18: "коммерческий отдел",
19: "коммерческий отдел",
20: "коммерческий отдел",
21: "финансовый отдел",
22: "ОДП",
23: "ООТ",
24: "коммерческий отдел",
25: "финансовый отдел",
26: "коммерческий отдел",
27: "финансовый отдел",
28: "коммерческий отдел",
29: "коммерческий отдел",
30: "коммерческий отдел",
31: "отдел снабжения",
32: "ОДП",
33: "отдел технологов",
34: "отдел хранения",
35: "производственный отдел",
36: "коммерческий отдел",
37: "производственный отдел",
38: "коммерческий отдел",
39: "коммерческий отдел",
40: "ОДП",
41: "ОДП",
42: "коммерческий отдел",
43: "отдел дизайна",
44: "отдел технологов",
45: "отдел хранения",
46: "коммерческий отдел",
47: "секретарь",
48: "коммерческий отдел",
49: "финансовый отдел",
50: "производственный отдел",
51: "производственный отдел",
52: "производственный отдел",
53: "производственный отдел",
54: "АХО",
55: "АХО",
56: "АХО",
57: "АХО",
58: "АХО",
59: "коммерческий отдел",
60: "ОКК",
61: "ОКК",
62: "ОКК",
    // привязка фоток к отделам
};

const hardModeMapping = {
  1: "Оля", 2: "Рита", 3: "Карина", 4: "Ира", 5: "Оля",
6: "Маша",
7: "Настя",
8: "Даша",
9: "Катя",
10: "Марина",
11: "Лена",
12: "Наташа",
13: "Марина",
14: "Аня",
15: "Лена",
16: "Аня",
17: "Юля",
18: "Аня",
19: "Марина",
20: "Наташа",
21: "Жанна",
22: "Лена",
23: "Таня",
24: "Лена",
25: "Света",
26: "Лиля",
27: "Лариса",
28: "Олеся",
29: "Ира",
30: "Наташа",
31: "Наташа",
32: "Аида",
33: "Таня",
34: "Ира",
35: "Наташа",
36: "Женя",
37: "Ира",
38: "Наташа",
39: "Марина",
40: "Таня",
41: "Аня",
42: "Настя",
43: "Наташа",
44: "Кристина",
45: "Лена",
46: "Юля",
47: "Олеся",
48: "Марина",
49: "Галя",
50: "Таня",
51: "Таня",
52: "Юля",
53: "Аня",
54: "Света",
55: "Марина",
56: "Света",
57: "Света",
58: "Таня",
59: "Аня",
60: "Ира",
61: "Катя",
62: "Лена",
    // Добавить остальные соответствия 50-53
};

// Функция для запуска игры
function startGame(mode) {
    currentMode = mode;
    mainScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    usedImages = [];
    score = 0;
    scoreElement.textContent = score;
    setupButtons(mode);
    showNextImage();
    backgroundMusic.play(); // Воспроизведение музыки

    // Устанавливаем текст вопроса в зависимости от режима
    if (mode === 'easy') {
        questionElement.textContent = "Угадай, в каком отделе работает принцесса.";
    } else {
        questionElement.textContent = "Угадай имя принцессы.";
    }
}

// Настройка кнопок в зависимости от режима
function setupButtons(mode) {
    buttonsContainer.innerHTML = '';
    const buttons = mode === 'easy' ? easyModeButtons : hardModeButtons;
    const correctAnswer = getCorrectAnswer();
    const wrongAnswers = getRandomWrongAnswers(correctAnswer, buttons);

    // Создаем три кнопки: одна правильная и две неправильные
    const answerButtons = [correctAnswer, ...wrongAnswers];
    answerButtons.sort(() => Math.random() - 0.5); // Перемешиваем кнопки

    answerButtons.forEach(buttonText => {
        const button = document.createElement('button');
        button.textContent = buttonText;
        button.addEventListener('click', () => checkAnswer(buttonText, correctAnswer));
        buttonsContainer.appendChild(button);
    });
}

// Получение правильного ответа
function getCorrectAnswer() {
    const imageNumber = parseInt(imageElement.src.split('/').pop().split('.')[0]);
    return currentMode === 'easy' ? easyModeMapping[imageNumber] : hardModeMapping[imageNumber];
}

// Получение двух случайных неправильных ответов
function getRandomWrongAnswers(correctAnswer, buttons) {
    const wrongAnswers = buttons.filter(button => button !== correctAnswer);
    return wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 2);
}

// Функция для показа следующего изображения
function showNextImage() {
    if (usedImages.length === images.length) {
        endGame();
        return;
    }

    let randomImage;
    do {
        randomImage = images[Math.floor(Math.random() * images.length)];
    } while (usedImages.includes(randomImage));

    usedImages.push(randomImage);
    imageElement.src = randomImage;

    timeLeft = 20;
    timerElement.textContent = timeLeft;

    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);

    setupButtons(currentMode);
}

// Обновление таймера
function updateTimer() {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 0) {
        clearInterval(timer);
        showNextImage();
    }
}

// Проверка ответа
function checkAnswer(selectedButton, correctAnswer) {
    if (selectedButton === correctAnswer) {
        score++;
        scoreElement.textContent = score;
    }
    clearInterval(timer);
    showNextImage();
}

// Завершение игры
function endGame() {
    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    finalScoreElement.textContent = score;
    backgroundMusic.pause(); // Остановка музыки
}

// Перезапуск игры
restartButton.addEventListener('click', () => {
    resultScreen.classList.add('hidden');
    mainScreen.classList.remove('hidden');
    backgroundMusic.play(); // Воспроизведение музыки
});

// Обработчики нажатия на кнопки режимов
easyModeButton.addEventListener('click', () => startGame('easy'));
hardModeButton.addEventListener('click', () => startGame('hard'));
