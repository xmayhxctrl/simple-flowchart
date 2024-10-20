const canvas = document.getElementById('canvas');
const elements = document.querySelectorAll('.element');
let draggedElement = null;
let currentLine = null;
let connections = [];
let scissorsMode = false;
let isDrawingLine = false;
let undoStack = [];

function createBlock(type, x, y) {
    const block = document.createElement('div');
    block.classList.add('block', type);
    block.style.left = `${x}px`;
    block.style.top = `${y}px`;
    block.draggable = true;

    const label = document.createElement('div');
    label.textContent = getLabel(type);
    label.style.fontWeight = 'bold';
    label.style.marginBottom = '10px';
    block.appendChild(label);

    if (type !== 'start' && type !== 'end') {
        const input = document.createElement('textarea');
        input.classList.add('block-input');
        input.placeholder = "Введите текст...";
        input.style.resize = 'none';
        input.style.width = '100%';
        block.appendChild(input);
    }

    canvas.appendChild(block);

    block.addEventListener('mousedown', (e) => {
        if (isDrawingLine && currentLine) {
            const x1 = parseInt(currentLine.style.left, 10);
            const y1 = parseInt(currentLine.style.top, 10);
            const x2 = e.clientX;
            const y2 = e.clientY;
            createLine(x1, y1, x2, y2);
            currentLine = null;
            isDrawingLine = false;
        }
    });

    block.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', 'drag');
        draggedElement = block;
    });

    block.addEventListener('dragend', (e) => {
        draggedElement = null;
        saveState();
    });
}

canvas.addEventListener('dragover', (e) => {
    e.preventDefault();
});

canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    const type = draggedElement.getAttribute('data-type');
    const x = e.clientX - 60;
    const y = e.clientY - 30;
    createBlock(type, x, y);
    draggedElement = null;
});

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
