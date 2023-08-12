const searchInput = document.getElementById('searchInput');
const suggestions = document.getElementById('suggestions');
const gameDetailsContainer = document.getElementById('gameDetailsContainer');

searchInput.addEventListener('input', handleInput);

function handleInput() {
    const query = searchInput.value.toLowerCase();
    if (query.length === 0) {
        suggestions.innerHTML = '';
        return;
    }

    fetchSuggestions(query);
}

async function fetchSuggestions(query) {
    try {
        const response = await fetch(`get_games.php?query=${query}`);
        const data = await response.json();
        displaySuggestions(data);
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
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
    try {
        const response = await fetch(`get_game_details.php?name=${encodeURIComponent(name)}`);
        const data = await response.json();
        displayGameDetails(data);
    } catch (error) {
        console.error('Error fetching game details:', error);
    }
}

function displayGameDetails(gameDetailsArray) {
    clearGameDetails();

    const gameDetails = document.createElement('div');
    gameDetails.classList.add('game-details');

    gameDetailsArray.forEach(game => {
        for (const key in game) {
            const keyElement = document.createElement('div');
            const valueElement = document.createElement('div');

            keyElement.classList.add('key');
            valueElement.classList.add('value');

            keyElement.textContent = key;
            valueElement.innerHTML = game[key] || 'Отсутствует';

            gameDetails.appendChild(keyElement);
            gameDetails.appendChild(valueElement);
        }
    });

    gameDetailsContainer.appendChild(gameDetails);
}

function clearGameDetails() {
    gameDetailsContainer.innerHTML = '';
}
