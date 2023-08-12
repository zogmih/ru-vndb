const suggestionsContainer = document.getElementById('suggestions');
const gameDetailsTable = document.getElementById('gameDetailsTable');

let currentSearchQuery = '';
let database = [];

// Загружаем файл bd.json
fetch('bd.json')
    .then(response => response.json())
    .then(data => {
        database = data; // Загруженные данные сохраняем в переменной database
        initializeSearch(); // Вызываем функцию инициализации поиска после загрузки данных
    })
    .catch(error => {
        console.error('Error loading bd.json:', error);
    });

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
        const inputValue = searchInput.value.trim().toLowerCase();
        suggestionsContainer.innerHTML = '';
        clearGameDetails();
        currentSearchQuery = inputValue;

        if (inputValue.length === 0) {
            return;
        }

        const uniqueGames = new Set();
        database.forEach(game => {
            if (game['Название новеллы'].toLowerCase().includes(inputValue)) {
                uniqueGames.add(game['Название новеллы']);
            }
        });

        uniqueGames.forEach(gameName => {
            const suggestion = document.createElement('div');
            suggestion.classList.add('suggestion');
            suggestion.textContent = gameName;

            suggestion.addEventListener('click', () => {
                const gameDetailsArray = database.filter(game => game['Название новеллы'] === gameName);
                displayGameDetails(gameDetailsArray);
                suggestionsContainer.innerHTML = '';
            });

            suggestionsContainer.appendChild(suggestion);
        });
    });
}

function displayGameDetails(gameDetailsArray) {
    clearGameDetails();

    const table = document.createElement('table');
    table.classList.add('game-details-table');

    gameDetailsArray.forEach(game => {
        const keysToExclude = [
            'Название новеллы',
            'Страница новеллы',
            'Рейтинг новеллы',
            'Картинка',
            'Возрастной рейтинг',
            'Длительность',
            'Описание новеллы'
        ];

        for (const key in game) {
            if (!keysToExclude.includes(key)) {
                const row = document.createElement('tr');
                const keyCell = document.createElement('td');
                const valueCell = document.createElement('td');

                keyCell.classList.add('key');
                valueCell.classList.add('value');

                keyCell.textContent = key;
                valueCell.innerHTML = game[key] || 'Отсутствует';

                table.appendChild(row);

                row.appendChild(keyCell);
                row.appendChild(valueCell);
            }
        }
    });

    gameDetailsTable.appendChild(table);
}


function clearGameDetails() {
    gameDetailsTable.innerHTML = '';
}

// Остальные функции здесь
