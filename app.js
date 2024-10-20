const canvas = document.getElementById('canvas');
const elements = document.querySelectorAll('.element');
let draggedElement = null;

// Создание элемента на холсте
function createBlock(type, x, y) {
    const block = document.createElement('div');
    block.classList.add('block', type);
    block.style.left = `${x}px`;
    block.style.top = `${y}px`;
    block.draggable = true;  // Элемент можно будет перетаскивать

    const label = document.createElement('div');
    label.textContent = getLabel(type);
    label.style.fontWeight = 'bold';
    block.appendChild(label);

    if (type !== 'start' && type !== 'end') {
        const input = document.createElement('textarea');
        input.classList.add('block-input');
        input.placeholder = "Введите текст...";
        block.appendChild(input);
    }

    block.addEventListener('mousedown', (e) => {
        block.style.position = 'absolute';
        moveAt(e.pageX, e.pageY);
        document.body.append(block);
    
        function moveAt(pageX, pageY) {
            block.style.left = pageX - block.offsetWidth / 2 + 'px';
            block.style.top = pageY - block.offsetHeight / 2 + 'px';
        }

        function onMouseMove(e) {
            moveAt(e.pageX, e.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        block.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            block.onmouseup = null;
        };
    });

    canvas.appendChild(block);
}

// Присвоение каждому элементу возможность перетаскивания
elements.forEach(element => {
    element.addEventListener('dragstart', (e) => {
        draggedElement = e.target;
    });
});

// Перетаскивание элемента на холст
canvas.addEventListener('dragover', (e) => {
    e.preventDefault();  // Разрешить сброс
});

canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    const type = draggedElement.getAttribute('data-type');
    const x = e.clientX - 60;
    const y = e.clientY - 30;
    createBlock(type, x, y);
    draggedElement = null;
});

// Функция для получения метки
function getLabel(type) {
    switch (type) {
        case 'start':
            return 'Начало';
        case 'process':
            return 'Действие';
        case 'decision':
            return 'Условие';
        case 'io':
            return 'Ввод/Вывод';
        case 'end':
            return 'Конец';
        default:
            return '';
    }
}


function createLine(x1, y1, x2, y2) {
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;
    canvas.appendChild(line);
    connections.push(line);
}

document.getElementById('create-line-btn').addEventListener('click', () => {
    isDrawingLine = true;
    canvas.addEventListener('click', (e) => {
        if (isDrawingLine) {
            currentLine = document.createElement('div');
            currentLine.classList.add('line');
            currentLine.style.left = `${e.clientX}px`;
            currentLine.style.top = `${e.clientY}px`;
            canvas.appendChild(currentLine);
        }
    });
});

document.getElementById('scissors-btn').addEventListener('click', () => {
    scissorsMode = !scissorsMode;
    document.getElementById('scissors-btn').textContent = scissorsMode ? 'Режим ножниц Вкл.' : 'Режим ножниц Выкл.';
});

document.getElementById('undo-btn').addEventListener('click', () => {
    if (undoStack.length > 0) {
        canvas.innerHTML = '';
        const lastState = undoStack.pop();
        canvas.appendChild(lastState.cloneNode(true));
    }
});

document.getElementById('save-btn').addEventListener('click', () => {
    html2canvas(canvas).then(canvasImage => {
        const link = document.createElement('a');
        link.download = 'block-shema.jpeg';
        link.href = canvasImage.toDataURL('image/jpeg');
        link.click();
    });
});

function saveState() {
    const canvasClone = canvas.cloneNode(true);
    undoStack.push(canvasClone);
}
