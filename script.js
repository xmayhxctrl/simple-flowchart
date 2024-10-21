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

    // События для перемещения элемента
    element.addEventListener('mousedown', (e) => {
        const offsetX = e.clientX - element.getBoundingClientRect().left; // Получаем смещение
        const offsetY = e.clientY - element.getBoundingClientRect().top;

        const moveElement = (moveEvent) => {
            element.style.left = `${moveEvent.clientX - offsetX}px`; // Обновляем положение
            element.style.top = `${moveEvent.clientY - offsetY}px`;
        };

        const stopMoving = () => {
            window.removeEventListener('mousemove', moveElement); // Убираем обработчик
            window.removeEventListener('mouseup', stopMoving); // Убираем обработчик
        };

        window.addEventListener('mousemove', moveElement); // Добавляем обработчик
        window.addEventListener('mouseup', stopMoving); // Добавляем обработчик
    });

    // Редактирование текста при двойном клике
    element.addEventListener('dblclick', () => {
        const newText = prompt('Введите новый текст:', text);
        if (newText !== null) {
            element.textContent = newText;
        }
    });
}
