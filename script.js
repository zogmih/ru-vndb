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

    gameDetailsArray.forEach(game => {
        const table = document.createElement('table');
        table.classList.add('game-details-table');

        for (const key in game) {
            if (
                key !== 'Название новеллы' &&
                key !== 'Страница новеллы' &&
                key !== 'Рейтинг новеллы' &&
                key !== 'Картинка' &&
                key !== 'Возрастной рейтинг' &&
                key !== 'Длительность' &&
                key !== 'Описание новеллы'
            ) {
                const row = document.createElement('tr');
                const keyCell = document.createElement('td');
                const valueCell = document.createElement('td');
                keyCell.classList.add('key');
                valueCell.classList.add('value');

                if (key === 'Дата релиза') {
                    valueCell.textContent = formatDate(game[key]);
                } else {
                    valueCell.innerHTML = game[key];
                }

                keyCell.textContent = key;
                row.appendChild(keyCell);
                row.appendChild(valueCell);
                table.appendChild(row);
            }
        }

        gameDetailsTable.appendChild(table);
    });
}

function clearGameDetails() {
    gameDetailsTable.innerHTML = '';
}

function formatDate(dateString) {
    const dateStringStr = dateString.toString();
    const year = dateStringStr.substring(0, 4);
    const month = dateStringStr.substring(4, 6);
    const day = dateStringStr.substring(6, 8);
    return `${day}-${month}-${year}`;
}
