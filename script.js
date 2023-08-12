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

    const numberOfRows = Math.ceil(gameDetailsArray.length / 3);
    for (let i = 0; i < numberOfRows; i++) {
        const row = document.createElement('tr');

        for (let j = 0; j < 3; j++) {
            const gameIndex = i * 3 + j;
            if (gameIndex < gameDetailsArray.length) {
                const game = gameDetailsArray[gameIndex];

                const keyCell = document.createElement('td');
                const valueCell = document.createElement('td');
                keyCell.classList.add('key');
                valueCell.classList.add('value');

                if (game['Дата релиза']) {
                    valueCell.textContent = formatDate(game['Дата релиза']);
                } else {
                    valueCell.textContent = 'Отсутствует';
                }

                keyCell.textContent = 'Дата релиза';
                row.appendChild(keyCell);
                row.appendChild(valueCell);
            }
        }

        table.appendChild(row);
    }

    gameDetailsTable.appendChild(table);
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
