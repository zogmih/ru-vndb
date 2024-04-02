// Функция для отображения последних релизов игр
function displayLatestReleases(games) {
    resultDiv.innerHTML = ''; // Очищаем элемент для вывода результатов

    const currentDate = new Date(); // Получаем текущую дату

    // Фильтруем игры по условиям релиза и сортируем их по дате релиза
    const latestReleases = games
        .filter(game => {
            const releaseDate = game["Date"];
            if (!releaseDate) {
                return false; // Пропускаем игры без даты релиза
            }
            const dateString = String(releaseDate);
            const day = parseInt(dateString.slice(6, 8));
            const month = parseInt(dateString.slice(4, 6));
            const year = parseInt(dateString.slice(0, 4));
            const gameReleaseDate = new Date(year, month - 1, day);
            return gameReleaseDate <= currentDate && day <= 31 && month <= 12; // Включаем игры, релиз которых был до текущей даты
        })
        .sort((a, b) => {
            const dateA = new Date(a["Date"]);
            const dateB = new Date(b["Date"]);
            return dateB - dateA; // Сортируем по убыванию даты релиза
        })
        .slice(0, 250); // Оставляем только первые 250 результатов

    const table = document.createElement('table'); // Создаем таблицу
    table.classList.add('result-table', 'no-word-wrap'); // Добавляем классы к таблице

    const headerRow = table.insertRow(); // Вставляем строку заголовка
    const headers = ["Date", "Rating", "Age Rating", "Title", "Release URL", "Release website"];
    headers.forEach(headerText => {
        const headerCell = document.createElement('th'); // Создаем ячейку заголовка
        headerCell.textContent = headerText; // Устанавливаем текст заголовка
        headerRow.appendChild(headerCell); // Добавляем ячейку в строку заголовка
    });

    // Проходимся по играм и создаем строки и ячейки для каждой игры
    latestReleases.forEach(game => {
        const row = table.insertRow(); // Вставляем строку
        const cellDate = row.insertCell(); // Создаем ячейку для даты релиза
        const cellRating = row.insertCell(); // Создаем ячейку для рейтинга новеллы
        const cellAgeRating = row.insertCell(); // Создаем ячейку для возрастного рейтинга
        const cellName = row.insertCell(); // Создаем ячейку для имени новеллы
        const cellReleasePage = row.insertCell(); // Создаем ячейку для ссылки на страницу релиза
        const cellProjectSite = row.insertCell(); // Создаем ячейку для ссылки на Release website

        // Заполняем ячейки данными из объекта игры
        cellDate.textContent = game["Date"] ? formatDate(game["Date"]) : "";
        cellRating.textContent = game["Rating"] || "-";
        cellAgeRating.textContent = game["Age Rating"] || "-";
        const nameLink = document.createElement('a'); // Создаем ссылку на страницу новеллы
        nameLink.textContent = game["Title"] || "-";
        nameLink.href = game["Novel URL"] || "#";
        nameLink.target = "_blank";
        cellName.appendChild(nameLink);

        const releasePageLink = document.createElement('a'); // Создаем ссылку на страницу релиза
        releasePageLink.textContent = "Release URL";
        releasePageLink.href = game["Release URL"] || "#";
        releasePageLink.target = "_blank";
        cellReleasePage.appendChild(releasePageLink);

        const projectSiteLink = document.createElement('a'); // Создаем ссылку на Release website
        projectSiteLink.textContent = "Release website";
        projectSiteLink.href = game["Release website"] || "#";
        projectSiteLink.target = "_blank";
        cellProjectSite.appendChild(projectSiteLink);
    });

    resultDiv.appendChild(table); // Добавляем таблицу в элемент для вывода результатов
}
