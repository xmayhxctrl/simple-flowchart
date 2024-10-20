const canvas = document.getElementById('canvas');
const elements = document.querySelectorAll('.element');
let draggedElement = null;
let connections = [];
let scissorsMode = false;
let undoStack = [];

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

elements.forEach(element => {
    element.addEventListener('dragstart', (e) => {
        draggedElement = e.target.cloneNode(true);
        draggedElement.classList.add('block');
        draggedElement.style.position = 'absolute';
    });
});

canvas.addEventListener('dragover', (e) => {
    e.preventDefault();
});

canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    if (draggedElement) {
        draggedElement.style.left = `${e.clientX - 60}px`;
        draggedElement.style.top = `${e.clientY - 30}px`;
        canvas.appendChild(draggedElement);
        draggedElement = null;
        saveState();
    }
});

canvas.addEventListener('mousedown', (e) => {
    if (scissorsMode) {
        const targetLine = e.target;
        if (targetLine.classList.contains('line')) {
            targetLine.remove();
            saveState();
        }
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

function saveState() {
    const canvasClone = canvas.cloneNode(true);
    undoStack.push(canvasClone);
}
