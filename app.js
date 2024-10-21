// Helper to create a new element on canvas
function createElement(type) {
  const element = document.createElement('div');
  element.classList.add('element', type);
  element.draggable = true;
  element.style.left = '100px';
  element.style.top = '100px';

  // Depending on type, assign different styles
  switch (type) {
    case 'start':
      element.innerText = 'Start/End';
      break;
    case 'condition':
      element.innerText = 'Condition';
      element.style.transform = 'rotate(45deg)';
      break;
    case 'input-output':
      element.innerText = 'Input/Output';
      break;
    case 'action':
      element.innerText = 'Action';
      break;
  }

  // Enable dragging of the element
  element.addEventListener('dragstart', dragStart);
  element.addEventListener('dragend', dragEnd);

  return element;
}

let draggedElement = null;

// Drag start function
function dragStart(e) {
  draggedElement = this;
}

// Drag end function
function dragEnd(e) {
  const canvasRect = document.getElementById('canvas').getBoundingClientRect();
  this.style.left = e.clientX - canvasRect.left + 'px';
  this.style.top = e.clientY - canvasRect.top + 'px';
  draggedElement = null;
}

// Add event listeners for creating elements
document.querySelectorAll('.add-element').forEach(button => {
  button.addEventListener('click', function () {
    const type = this.getAttribute('data-type');
    const newElement = createElement(type);
    document.getElementById('canvas').appendChild(newElement);
  });
});

// Enable dragging over the canvas
const canvas = document.getElementById('canvas');
canvas.addEventListener('dragover', function (e) {
  e.preventDefault();
});

// Save canvas as JPEG
document.getElementById('save').addEventListener('click', function () {
  html2canvas(document.getElementById('canvas')).then(canvas => {
    const link = document.createElement('a');
    link.download = 'block-scheme.jpg';
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
  });
});
