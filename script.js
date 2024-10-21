let draggedElement = null;

// Функция для создания нового элемента блок-схемы
function createElement(type, text) {
    const element = document.createElement('div');
    element.classList.add('block', type);
    element.textContent = text;
    element.draggable = true; // Позволяет перетаскивать элемент
    workspace.appendChild(element);

    // Центрируем элемент на экране
    element.style.position = 'absolute';
    element.style.left = '50%';
    element.style.top = '50%';
    element.style.transform = 'translate(-50%, -50%)';

    // Обработчики событий для перетаскивания
    element.addEventListener('dragstart', (e) => {
        draggedElement = element;
        setTimeout(() => {
            element.style.display = 'none'; // Скрываем элемент при перетаскивании
        }, 0);
    });

    element.addEventListener('dragend', () => {
        setTimeout(() => {
            draggedElement.style.display = 'block'; // Показываем элемент после завершения перетаскивания
            draggedElement = null;
        }, 0);
    });

    workspace.addEventListener('dragover', (e) => {
        e.preventDefault(); // Разрешаем перетаскивание
    });

    workspace.addEventListener('drop', (e) => {
        e.preventDefault();
        const x = e.clientX - workspace.getBoundingClientRect().left; // Получаем координаты
        const y = e.clientY - workspace.getBoundingClientRect().top;
        draggedElement.style.left = `${x}px`;
        draggedElement.style.top = `${y}px`;
        draggedElement.style.transform = 'none'; // Убираем трансформацию при перетаскивании
    });

    // Редактирование текста при двойном клике
    element.addEventListener('dblclick', () => {
        const newText = prompt('Введите новый текст:', text);
        if (newText !== null) {
            element.textContent = newText;
        }
    });
}
