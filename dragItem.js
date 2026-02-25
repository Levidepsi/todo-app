
// if Array.from method not used use forEach loop to retrieve items
const items = Array.from(
  document.querySelectorAll(".todo-item-wrapper .item")
);

let draggedItem = null;


const draggableItems = () => {

  items.map((item, index) => {
    item.addEventListener("mousedown", () => {
      item.classList.add("clicked")
    })
    item.addEventListener("mouseup", () => {
      item.classList.remove("clicked")

    });

    item.addEventListener(("dragstart"), (e) => {
      draggedItem = item;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData("text/plain", item.dataset.index);
      setTimeout(() => item.classList.add('dragging'), 0);
    })

    item.addEventListener('dragend', () => {
      draggedItem.classList.remove('dragging');
      draggedItem = null;
    });

    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(item, e.clientY);
      console.log(afterElement)
      if (afterElement == null) {
          list.appendChild(draggedItem);
      } else {
          list.insertBefore(draggedItem, afterElement);
      }
    });
    item.addEventListener('drop', () => {
        // Find the new order in the DOM
        const newOrderIDs = Array.from(list.querySelectorAll('li')).map(li => parseInt(li.dataset.id));
        
        // Update the original JavaScript array
        updateArrayOrder(newOrderIDs);
    });
  })
}

draggableItems()
