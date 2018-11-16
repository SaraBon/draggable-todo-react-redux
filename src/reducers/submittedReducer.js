export default (state = {todos: [], style : ["input"]}, action) => {
 switch (action.type) {

  case 'ADD':
    let newStateAdd = Object.assign(state);
    if(action.input.trim()) {newStateAdd.todos = [...newStateAdd.todos, action.input]}; //if the input isn't empty, add the input to the end of the list
    newStateAdd.style = Array(newStateAdd.todos.length+1).fill("input"); // also update the array of styles (css classes) which is used for the dragging visualization
    return newStateAdd;

   case 'DELETE':
    let newStateDel = Object.assign(state);
    newStateDel.todos.splice(action.index,1);
    return newStateDel;

  case "DRAGENTER" :
    let newStateDragEnter = Object.assign(state);
    newStateDragEnter.style[action.index] = "inputDragged"; // set a new style of the currently dragged-over item
    return newStateDragEnter;

  case "DRAGLEAVE" :
    let newStateDragLeave = Object.assign(state);
    newStateDragLeave.style = Array(newStateDragLeave.todos.length+1).fill("input"); // reset all the elements to default style
    return newStateDragLeave;

  case "DROP" :
    let newStateDrop = Object.assign(state);
    let droppedContent = action.e.dataTransfer.getData("content"); // get content of the draggen item
    let droppedIndex = action.e.dataTransfer.getData("index"); // and index of the dragged item

    newStateDrop.todos.splice(droppedIndex, 1); //delete the dragged element from the original array position
    newStateDrop.todos.splice(action.index,0,droppedContent); // and insert it in the new position

    newStateDrop.style = Array(newStateDrop.todos.length+1).fill("input"); //finally reset all the elements to default style
    return newStateDrop;

  default:
   return state
 }
}
