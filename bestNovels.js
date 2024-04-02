// Получаем ссылку на кнопку "Лучшие новеллы"
const bestNovelsButton = document.getElementById('bestNovelsButton');

// Переменная для хранения данных о лучших новеллах
let bestNovelsData = [];

// Функция для отображения лучших новелл
function displayBestNovels() {
    resultDiv.innerHTML = ''; // Очищаем элемент для вывода результатов

    const uniqueNovels = new Map(); // Используем Map для хранения уникальных новелл

    // Преобразуем данные о новеллах, добавляем числовой рейтинг
    bestNovelsData
    .map(novel => ({
            ...novel,
            "Rating": parseFloat(novel["Rating"]) || 0, // Преобразуем в число, или 0, если null
        }))
    .forEach(novel => {
        const novelName = novel["Title"] || "-";
        const novelRating = novel["Rating"];
        const ageRating = novel["Age Rating"] || "-";

        // Проверяем, была ли уже добавлена такая новелла
        if (uniqueNovels.has(novelName)) {
            const existingRating = uniqueNovels.get(novelName)["Rating"];
            if (novelRating <= existingRating) {
                return; // Пропускаем, если новелла с более низким рейтингом уже есть
            }
        }

        // Добавляем новеллу в Map
        uniqueNovels.set(novelName, {
            "Title": novelName,
            "Rating": novelRating,
            "Age Rating": ageRating,
            "Novel URL": novel["Novel URL"] || "#" // Добавляем ссылку
        });
    });

    // Сортируем новеллы по рейтингу и ограничиваем до первых 250
    const sortedNovels = Array.from(uniqueNovels.values())
        .sort((a, b) => b["Rating"] - a["Rating"])
        .slice(0, 250);

    const table = document.createElement('table'); // Создаем таблицу
    table.classList.add('result-table'); // Добавляем класс к таблице

    const headerRow = table.insertRow(); // Вставляем строку заголовка
    const headers = ["Rating", "Age Rating", "Title"];
    headers.forEach(headerText => {
        const headerCell = document.createElement('th'); // Создаем ячейку заголовка
        headerCell.textContent = headerText; // Устанавливаем текст заголовка
        headerRow.appendChild(headerCell); // Добавляем ячейку в строку заголовка
    });

    // Проходимся по отсортированным новеллам и создаем строки и ячейки для каждой новеллы
    sortedNovels.forEach(novel => {
        const row = table.insertRow(); // Вставляем строку
        const cellRating = row.insertCell(); // Создаем ячейку для рейтинга
        const cellAgeRating = row.insertCell(); // Создаем ячейку для возрастного рейтинга
        const cellName = row.insertCell(); // Создаем ячейку для имени новеллы

        cellRating.textContent = novel["Rating"]; // Заполняем рейтинг
        cellAgeRating.textContent = novel["Age Rating"] || "Отсутствует"; // Заполняем Age Rating

        const nameLink = document.createElement('a'); // Создаем ссылку на страницу новеллы
        nameLink.textContent = novel["Title"] || "Отсутствует"; // Заполняем имя
        nameLink.href = novel["Novel URL"]; // Исправленная ссылка
        nameLink.target = "_blank";
        cellName.appendChild(nameLink); // Добавляем ссылку в ячейку
    });

    resultDiv.appendChild(table); // Добавляем таблицу в элемент для вывода результатов
}

// Добавляем обработчик события для кнопки "Лучшие новеллы"
bestNovelsButton.addEventListener('click', () => {
    fetchGamesData(); // Загружаем данные об играх
    setTimeout(() => {
        bestNovelsData = gamesData.slice(); // Копируем данные об играх
        displayBestNovels(); // Отображаем лучшие новеллы после задержки
    }, 100);
});
