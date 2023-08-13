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
            "Рейтинг новеллы": parseFloat(novel["Рейтинг новеллы"]) || 0, // Преобразуем в число, или 0, если null
        }))
    .forEach(novel => {
        const novelName = novel["Название новеллы"] || "-";
        const novelRating = novel["Рейтинг новеллы"];
        const ageRating = novel["Возрастной рейтинг"] || "-";

        // Проверяем, была ли уже добавлена такая новелла
        if (uniqueNovels.has(novelName)) {
            const existingRating = uniqueNovels.get(novelName)["Рейтинг новеллы"];
            if (novelRating <= existingRating) {
                return; // Пропускаем, если новелла с более низким рейтингом уже есть
            }
        }

        // Добавляем новеллу в Map
        uniqueNovels.set(novelName, {
            "Название новеллы": novelName,
            "Рейтинг новеллы": novelRating,
            "Возрастной рейтинг": ageRating,
            "Страница новеллы": novel["Страница новеллы"] || "#" // Добавляем ссылку
        });
    });

    // Сортируем новеллы по рейтингу и ограничиваем до первых 250
    const sortedNovels = Array.from(uniqueNovels.values())
        .sort((a, b) => b["Рейтинг новеллы"] - a["Рейтинг новеллы"])
        .slice(0, 250);

    const table = document.createElement('table'); // Создаем таблицу
    table.classList.add('result-table'); // Добавляем класс к таблице

    const headerRow = table.insertRow(); // Вставляем строку заголовка
    const headers = ["Рейтинг новеллы", "Возрастной рейтинг", "Имя новеллы"];
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

        cellRating.textContent = novel["Рейтинг новеллы"]; // Заполняем рейтинг
        cellAgeRating.textContent = novel["Возрастной рейтинг"] || "Отсутствует"; // Заполняем возрастной рейтинг

        const nameLink = document.createElement('a'); // Создаем ссылку на страницу новеллы
        nameLink.textContent = novel["Название новеллы"] || "Отсутствует"; // Заполняем имя
        nameLink.href = novel["Страница новеллы"]; // Исправленная ссылка
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
