async function loadKanbanData() {
    const response = await fetch('/api/board');
    if (!response.ok) {
        console.error('Failed to fetch board data:', response.statusText);
        const errorContainer = document.getElementById('errors');
        errorContainer.textContent = `Error: ${response.statusText}`;
        return;
    }

    try {
        const data = await response.json();
        console.log('Fetched Kanban Data:', data); // Debug Log
        renderKanbanBoard(data);
    } catch (error) {
        console.error('Error parsing board data:', error);
        const errorContainer = document.getElementById('errors');
        errorContainer.textContent = `Parsing Error: ${error.message}`;
    }
}

function renderKanbanBoard(data) {
    const boardContainer = document.getElementById('board');
    boardContainer.innerHTML = ''; // Clear existing content

    const { columns, columnOrder } = data;

    columnOrder.forEach(columnName => {
        console.debug(`Processing column: ${columnName}, Cards Count: ${columns[columnName]?.length || 0}`); // Debug Log

        const column = document.createElement('div');
        column.className = 'column';
        column.id = columnName;

        const header = document.createElement('h3');
        header.textContent = `${columnName} (${columns[columnName]?.length || 0})`;
        column.appendChild(header);

        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';
        const cards = columns[columnName] || [];

        cards.forEach(({ id, title }) => {
            console.debug(`Rendering card: ID=${id}, Title=${title}, Column=${columnName}`); // Debug Log
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.id = id;
            card.textContent = title || 'Untitled'; // Handle missing title
            cardContainer.appendChild(card);
        });

        if (cards.length === 0) {
            const placeholder = document.createElement('div');
            placeholder.className = 'placeholder';
            placeholder.textContent = 'Drop card here';
            cardContainer.appendChild(placeholder);
        }

        column.appendChild(cardContainer);
        boardContainer.appendChild(column);
    });

    console.debug('Final Rendered Board Structure:', boardContainer.innerHTML); // Debug Log
}

document.addEventListener('DOMContentLoaded', loadKanbanData);