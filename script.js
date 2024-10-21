// Получаем элементы кнопок
const addStartBtn = document.getElementById('add-start');
const addEndBtn = document.getElementById('add-end');
const addActionBtn = document.getElementById('add-action');
const addConditionBtn = document.getElementById('add-condition');
const addIoBtn = document.getElementById('add-io');
const workspace = document.querySelector('.workspace');

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
}

// Обработчики событий для кнопок
addStartBtn.addEventListener('click', () => createElement('start', 'Начало'));
addEndBtn.addEventListener('click', () => createElement('end', 'Конец'));
addActionBtn.addEventListener('click', () => createElement('action', 'Сделать что-то'));
addConditionBtn.addEventListener('click', () => createElement('condition', 'Условие'));
addIoBtn.addEventListener('click', () => createElement('io', 'Ввод/Вывод'));
