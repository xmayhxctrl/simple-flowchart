const canvas = document.getElementById('canvas');
const elements = document.querySelectorAll('.element');
let draggedElement = null;

elements.forEach(element => {
    element.addEventListener('dragstart', (e) => {
        draggedElement = e.target.cloneNode(true);
    });
});

canvas.addEventListener('dragover', (e) => {
    e.preventDefault();
});

canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    if (draggedElement) {
        draggedElement.style.position = 'absolute';
        draggedElement.style.left = `${e.clientX - 50}px`;
        draggedElement.style.top = `${e.clientY - 25}px`;
        draggedElement.classList.add('block');
        canvas.appendChild(draggedElement);
        draggedElement = null;
    }
});

// Save as JPEG
document.getElementById('save-btn').addEventListener('click', () => {
    html2canvas(canvas).then(canvasImage => {
        const link = document.createElement('a');
        link.download = 'flowchart.jpeg';
        link.href = canvasImage.toDataURL('image/jpeg');
        link.click();
    });
});
