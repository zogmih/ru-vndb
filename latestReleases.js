// Функция для отображения последних релизов игр
function displayLatestReleases(games) {
    resultDiv.innerHTML = ''; // Очищаем элемент для вывода результатов

    const currentDate = new Date(); // Получаем текущую дату

    // Фильтруем игры по условиям релиза и сортируем их по дате релиза
    const latestReleases = games
        .filter(game => {
            const releaseDate = game["Дата релиза"];
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
            const dateA = new Date(a["Дата релиза"]);
            const dateB = new Date(b["Дата релиза"]);
            return dateB - dateA; // Сортируем по убыванию даты релиза
        })
        .slice(0, 250); // Оставляем только первые 250 результатов

    const table = document.createElement('table'); // Создаем таблицу
    table.classList.add('result-table', 'no-word-wrap'); // Добавляем классы к таблице

    const headerRow = table.insertRow(); // Вставляем строку заголовка
    const headers = ["Дата релиза", "Рейтинг новеллы", "Возрастной рейтинг", "Имя новеллы", "Страница релиза", "Сайт проекта"];
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
        const cellProjectSite = row.insertCell(); // Создаем ячейку для ссылки на сайт проекта

        // Заполняем ячейки данными из объекта игры
        cellDate.textContent = game["Дата релиза"] ? formatDate(game["Дата релиза"]) : "";
        cellRating.textContent = game["Рейтинг новеллы"] || "-";
        cellAgeRating.textContent = game["Возрастной рейтинг"] || "-";
        const nameLink = document.createElement('a'); // Создаем ссылку на страницу новеллы
        nameLink.textContent = game["Название новеллы"] || "-";
        nameLink.href = game["Страница новеллы"] || "#";
        nameLink.target = "_blank";
        cellName.appendChild(nameLink);

        const releasePageLink = document.createElement('a'); // Создаем ссылку на страницу релиза
        releasePageLink.textContent = "Страница релиза";
        releasePageLink.href = game["Страница релиза"] || "#";
        releasePageLink.target = "_blank";
        cellReleasePage.appendChild(releasePageLink);

        const projectSiteLink = document.createElement('a'); // Создаем ссылку на сайт проекта
        projectSiteLink.textContent = "Сайт проекта";
        projectSiteLink.href = game["Сайт проекта"] || "#";
        projectSiteLink.target = "_blank";
        cellProjectSite.appendChild(projectSiteLink);
    });

    resultDiv.appendChild(table); // Добавляем таблицу в элемент для вывода результатов
}
