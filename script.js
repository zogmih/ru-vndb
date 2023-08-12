const searchInput = document.getElementById('searchInput');
const suggestions = document.getElementById('suggestions');
const gameDetailsContainer = document.getElementById('gameDetailsContainer');

searchInput.addEventListener('input', handleInput);

let database = [];

async function fetchDatabase() {
    try {
        const response = await fetch('bd.json');
        database = await response.json();
    } catch (error) {
        console.error('Error fetching database:', error);
    }
}

fetchDatabase();

function handleInput() {
    const query = searchInput.value.toLowerCase();
    if (query.length === 0) {
        suggestions.innerHTML = '';
        return;
    }

    const matchingGames = database.filter(game => game['Название новеллы'].toLowerCase().includes(query));
    displaySuggestions(matchingGames);
}

function displaySuggestions(suggestionsArray) {
    const suggestionItems = suggestionsArray.map(suggestion => {
        const suggestionElement = document.createElement('div');
        suggestionElement.classList.add('suggestion');
        suggestionElement.textContent = suggestion['Название новеллы'];
        suggestionElement.addEventListener('click', () => fetchGameDetails(suggestion['Название новеллы']));
        return suggestionElement;
    });

    suggestions.innerHTML = '';
    suggestionItems.forEach(item => suggestions.appendChild(item));
}

async function fetchGameDetails(name) {
    const matchingGames = database.filter(game => game['Название новеллы'] === name);
    displayGameDetails(matchingGames);
}

function displayGameDetails(gameDetailsArray) {
    clearGameDetails();

    const gameDetails = document.createElement('div');
    gameDetails.classList.add('game-details');

    gameDetailsArray.forEach(game => {
        for (const key in game) {
            if (key !== 'Название новеллы' && key !== 'Страница новеллы') {
                const keyValueElement = document.createElement('div');
                keyValueElement.classList.add('key-value');

                const keyElement = document.createElement('div');
                const valueElement = document.createElement('div');

                keyElement.classList.add('key');
                valueElement.classList.add('value');

                keyElement.textContent = key;
                valueElement.innerHTML = game[key] || 'Отсутствует';

                keyValueElement.appendChild(keyElement);
                keyValueElement.appendChild(valueElement);

                gameDetails.appendChild(keyValueElement);
            }
        }
    });

    gameDetailsContainer.appendChild(gameDetails);
}


function clearGameDetails() {
    gameDetailsContainer.innerHTML = '';
}
