// Получаем ссылки на HTML-элементы
const searchInput = document.getElementById('searchInput'); // Поле ввода для поиска
const suggestionsList = document.getElementById('suggestions'); // Список подсказок
const resultDiv = document.getElementById('result'); // Элемент для вывода результатов
const latestReleasesButton = document.getElementById('latestReleasesButton'); // Кнопка "Последние релизы"

let gamesData = []; // Переменная для хранения данных об играх

// Функция для загрузки данных об играх из файла
async function fetchGamesData() {
    try {
        const response = await fetch('bd.json'); // Отправляем запрос на файл с данными
        gamesData = await response.json(); // Преобразуем ответ в формат JSON и сохраняем данные
    } catch (error) {
        console.error('Failed to fetch games data:', error); // В случае ошибки выводим сообщение об ошибке
    }
}

fetchGamesData(); // Вызываем функцию загрузки данных об играх

// Функция для обработки ввода в поле поиска
function handleInput() {
    const userInput = searchInput.value.toLowerCase(); // Получаем введенный текст и приводим к нижнему регистру

    suggestionsList.innerHTML = ''; // Очищаем список подсказок
    resultDiv.innerHTML = ''; // Очищаем элемент для вывода результатов

    if (userInput === "") {
        return; // Если введенный текст пустой, завершаем функцию
    }

    const suggestionsMap = new Map(); // Используем Map для хранения уникальных подсказок

    // Проходимся по данным об играх и добавляем подсказки в Map
    gamesData.forEach(game => {
        const lowercaseTitle = game["Название новеллы"].toLowerCase();
        const lowercaseReleaseTitle = game["Русское название релиза"]?.toLowerCase();

        if (lowercaseTitle.includes(userInput)) {
            suggestionsMap.set(game["Название новеллы"], game);
        }

        if (lowercaseReleaseTitle && lowercaseReleaseTitle.includes(userInput)) {
            suggestionsMap.set(game["Русское название релиза"], game);
        }
    });

    // Создаем элементы списка подсказок на основе Map
    suggestionsMap.forEach((game, title) => {
        const li = document.createElement('li'); // Создаем элемент списка
        li.textContent = title; // Устанавливаем текст подсказки
        li.addEventListener('click', () => {
            displayResult(game); // При клике на подсказку выводим результат
            suggestionsList.innerHTML = ''; // Очищаем список подсказок
        });
        suggestionsList.appendChild(li); // Добавляем элемент списка в список подсказок
    });
}

// Добавляем обработчики событий для поля поиска
searchInput.addEventListener('input', handleInput); // При изменении ввода вызываем функцию handleInput
searchInput.addEventListener('paste', () => {
    setTimeout(handleInput, 0); // При вставке в поле поиска, запускаем функцию handleInput через setTimeout
});

// Функция для форматирования даты
function formatDate(dateString) {
    const dateStringStr = String(dateString); // Преобразуем дату в строку
    const year = dateStringStr.slice(0, 4); // Получаем год из строки
    const month = dateStringStr.slice(4, 6); // Получаем месяц из строки
    const day = dateStringStr.slice(6, 8); // Получаем день из строки
    return `${day}-${month}-${year}`; // Возвращаем отформатированную дату
}

// Функция для вывода результатов
function displayResult(game) {
    resultDiv.innerHTML = ''; // Очищаем элемент для вывода результатов

    // Фильтруем данные об играх, чтобы получить совпадающие игры
    const matchingGames = gamesData.filter(dataGame => dataGame["Название новеллы"] === game["Название новеллы"]);

    const table = document.createElement('table'); // Создаем таблицу для результатов
    table.classList.add('result-table'); // Добавляем класс к таблице

    let currentRow = table.insertRow(); // Вставляем строку в таблицу
    let cellIndex = 0; // Индекс текущей ячейки

    // Проходимся по совпадающим играм и создаем содержимое для ячеек
    matchingGames.forEach(matchingGame => {
        if (cellIndex === 3) {
            currentRow = table.insertRow(); // Если достигли 3 ячейки, создаем новую строку
            cellIndex = 0; // Сбрасываем индекс ячейки
        }

        const cell = currentRow.insertCell(); // Создаем ячейку
        const cellContent = document.createElement('div'); // Создаем элемент для содержимого ячейки

        // Проходимся по свойствам игры и создаем ключи и значения
        for (const key in matchingGame) {
            if (key !== "Рейтинг новеллы" && key !== "Картинка" && key !== "Название новеллы" && key !== "Возрастной рейтинг" && key !== "Длительность" && key !== "Описание новеллы") {
                const keyElement = document.createElement('div'); // Создаем элемент для ключа
                keyElement.textContent = `${key}`; // Устанавливаем текст ключа
                keyElement.classList.add('key'); // Добавляем класс к элементу ключа

                const valueElement = document.createElement('div'); // Создаем элемент для значения

                if (key === "Страница новеллы" || key === "Страница релиза" || key === "Сайт проекта") {
                    const linkValue = matchingGame[key] || ""; // Получаем значение ссылки

                    // Создаем ссылки для значений ссылочных полей
                    if (linkValue.startsWith("http://web.archive") || linkValue.startsWith("https://web.archive")) {
                        // Если ссылка начинается с "http://web.archive" или "https://web.archive"
                        const linkElement = document.createElement('a'); // Создаем элемент ссылки
                        linkElement.textContent = "Web archive"; // Устанавливаем текст ссылки
                        linkElement.href = linkValue; // Устанавливаем адрес ссылки
                        linkElement.target = "_blank"; // Устанавливаем атрибут target для открытия в новой вкладке
                        valueElement.appendChild(linkElement); // Добавляем ссылку в элемент значения
                    } else if (linkValue.startsWith("https://mega")) {
                        // Если ссылка начинается с "https://mega"
                        const linkElement = document.createElement('a'); // Создаем элемент ссылки
                        linkElement.textContent = "Mega.nz"; // Устанавливаем текст ссылки
                        linkElement.href = linkValue; // Устанавливаем адрес ссылки
                        linkElement.target = "_blank"; // Устанавливаем атрибут target для открытия в новой вкладке
                        valueElement.appendChild(linkElement); // Добавляем ссылку в элемент значения
                    } else {
                        // Если ссылка не соответствует предыдущим условиям
                        const linkElement = document.createElement('a'); // Создаем элемент ссылки
                        linkElement.textContent = linkValue || "Отсутствует"; // Устанавливаем текст ссылки (или "Отсутствует", если нет значения)
                        linkElement.href = linkValue; // Устанавливаем адрес ссылки
                        linkElement.target = "_blank"; // Устанавливаем атрибут target для открытия в новой вкладке
                        valueElement.appendChild(linkElement); // Добавляем ссылку в элемент значения
                    }
                } else {
                    // Если ключ не соответствует ссылочным полям
                    if (key === "Дата релиза") {
                        // Если ключ соответствует дате релиза
                        valueElement.textContent = matchingGame[key] ? formatDate(matchingGame[key]) : "Отсутствует"; // Устанавливаем отформатированную дату (или "Отсутствует", если нет значения)
                    } else {
                        // Если ключ не соответствует ни одному из предыдущих условий
                        const descriptionValue = matchingGame[key] || "Отсутствует"; // Получаем значение ключа (или "Отсутствует", если нет значения)

                        // Проверяем, содержит ли значение описание теги [url]...[/url]
                        if (descriptionValue.includes('[url=')) {
                            // Если значение содержит теги [url]...[/url]
                            const links = descriptionValue.split('[url=').map(fragment => {
                                if (fragment.includes(']')) {
                                    const [linkPart, rest] = fragment.split(']');
                                    const [url, text] = linkPart.split(']');
                                    return `<a href="${url}" target="_blank">${text || url}</a>${rest}`;
                                }
                                return fragment;
                            });

                            const descriptionElement = document.createElement('div'); // Создаем элемент для описания
                            descriptionElement.innerHTML = links.join(''); // Устанавливаем внутренний HTML-контент с обработанными ссылками
                            valueElement.appendChild(descriptionElement); // Добавляем элемент описания в элемент значения
                        } else {
                            // Если значение не содержит теги [url]...[/url]
                            valueElement.innerHTML = descriptionValue; // Устанавливаем HTML-контент значения
                        }
                    }
                }

                cellContent.appendChild(keyElement); // Добавляем элемент ключа в содержимое ячейки
                cellContent.appendChild(valueElement); // Добавляем элемент значения в содержимое ячейки
            }
        }

        cell.appendChild(cellContent);
        cellIndex++;
    });

    resultDiv.appendChild(table); // Добавляем таблицу с результатами в элемент для вывода результатов
}

// Добавляем обработчик события для кнопки "Последние релизы"
latestReleasesButton.addEventListener('click', () => {
    fetchGamesData(); // Загружаем данные об играх
    setTimeout(() => {
        displayLatestReleases(gamesData); // Отображаем последние релизы после задержки
    }, 100);
});
