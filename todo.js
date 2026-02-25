const container = document.getElementById('todo-item-wrapper');

let draggedItem = null;

const defaultItems = [
  { fruit: "Apple", completed: false },
  { fruit: "Banana", completed: true },
  { fruit: "Orange", completed: false },
  { fruit: "Mango", completed: true }
];

if (!localStorage.getItem('items')) {
  localStorage.setItem('items', JSON.stringify(defaultItems));
}

let storedItems = JSON.parse(localStorage.getItem('items'));

const renderItems = () => {
  container.innerHTML = '';

  storedItems.forEach((item, index) => {
    container.innerHTML += `
      <div draggable="true" data-index="${index}" class="item ${item.completed ? 'completed' : ''}">
        <input type="text" value="${item.fruit}" readonly class="todo-item-input"/>
        <div class="todo-item-btn-wrapper">
        <input type="checkbox" ${item.completed ? 'checked' : ''} onchange="toggleComplete(${index})"/>
          <button onclick="editItem(${index})" class="edit-btn">Edit</button>
          <button onclick="deleteItem(${index})" class="delete-btn">Delete</button>
        </div>
      </div>
    `;
  });

  attachDragEvents();
};

const deleteItem = (index) => {
  storedItems.splice(index, 1);
  localStorage.setItem('items', JSON.stringify(storedItems));
  renderItems();
};

const toggleComplete = (index) => {
  storedItems[index].completed = !storedItems[index].completed;
  localStorage.setItem('items', JSON.stringify(storedItems));

  if (storedItems[index].completed) {
    const input = document.querySelectorAll('.todo-item-input')[index];
    input.classList.add("completed")
  }
  renderItems();
}

const editItem = (index) => {
  const input = document.querySelectorAll('.todo-item-input')[index];

  input.removeAttribute("readonly");
  input.focus();
  input.classList.add("editing");

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      storedItems[index].fruit = input.value;
      localStorage.setItem('items', JSON.stringify(storedItems));
      renderItems();
    }
  }, { once: true }); // prevents stacking listeners

  // add on click done button
};

const attachDragEvents = () => {
  const items = document.querySelectorAll(".todo-item-wrapper .item");

  items.forEach((item) => {
    
    item.addEventListener("dragstart", () => {
      draggedItem = item;
      setTimeout(() => item.classList.add("dragging"), 0);
    });

    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
      draggedItem = null;
      updateArrayOrder();
    });
  });
};

container.addEventListener("dragover", (e) => {
  e.preventDefault();

  const afterElement = getDragAfterElement(container, e.clientY);
  
  if (!draggedItem) return;

  if (afterElement == null) {
    container.appendChild(draggedItem);
  } else {
    container.insertBefore(draggedItem, afterElement);
  }
});

const getDragAfterElement = (container, y) => {
  const draggableElements = [
    ...container.querySelectorAll(".item:not(.dragging)")
  ];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;

    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
};

const updateArrayOrder = () => {
  const domItems = container.querySelectorAll(".item");

  console.log(domItems)
  const newOrder = [];

  domItems.forEach((item) => {
    const index = item.dataset.index;
    newOrder.push(storedItems[index]);
  });

  storedItems = newOrder;
  localStorage.setItem("items", JSON.stringify(storedItems));
  renderItems();
};

const addBtn = document.getElementById("add-btn");

addBtn.addEventListener(("click"), () => {
  const input = document.getElementById("input" )

  if (input.value.trim() !== "") {
    storedItems.push({ fruit: input.value, completed: false })
    localStorage.setItem("items", JSON.stringify(storedItems))
    input.value = "";
    renderItems()
  }
})

renderItems();