function dragStart(event) {
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData("Text", event.target.getAttribute('id'));
  event.dataTransfer.setDragImage(event.target,0,0);

  return true;
}

function dragEnter(event) {
  event.preventDefault();
  return true;
}

function dragOver(event) {
  return false;
}

function dragDrop(event) {
  var src = event.dataTransfer.getData("Text");
  event.target.append($(src));
  event.stopPropagation();
  return false;
}
