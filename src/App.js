import React from 'react';

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import submittedReducer from './reducers/submittedReducer';
import { Provider, connect } from 'react-redux';
import { addToDo } from './actions/submittedAction'
import { deleteToDo } from './actions/deleteAction'
import { dragEnterAction } from './actions/dragEnterAction'
import { dragLeaveAction } from './actions/dragLeaveAction'
import { dropAction } from './actions/dropAction'


import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


// TODOS COMPONENT--------------------------------------------------------------

class ToDos extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      input : "", // holding the user's input
      inputSubmitted: [], // full list of todos submitted by user
        inputStyle : ["input"], // style of the singe todo divs, by default normal style, updates when dragged over the element. This is used as className in the rendered divs
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onClickToDoDelete = this.onClickToDoDelete.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

// FUNCTIONS FOR HANDLING INPUT AND BUTTON CLICKS   ----------------------------

// get & save the user's input
handleChange(event) {
  this.setState({input: event.target.value});
  }

// Update the array of todos when user submits new todo
handleSubmit(event) {
  event.preventDefault();
  this.props.toDoSubmitted(this.state.input);
  this.setState({input: ""}); // finallly clear the input state for next sumbit
}

// Delete the currently clicked todo from the array------
onClickToDoDelete(index){
  this.props.toDoDeleted(index);
  this.forceUpdate()
  }


// FUNCTIONS FOR HANDLING DRAG & DROP ------------------------------------------
onDragStart(e, item, index){
  e.dataTransfer.setData("content", item); //save the content
  e.dataTransfer.setData("index", index); //and the index of the the currently dragged item
}

onDrag(e){
  e.target.style.opacity = "0.4"; //reduce opacity of currently dragged item
}

onDragEnd(e){
  e.target.style.opacity = "1"; // set back opacity of currently dragged item when dropped
}

onDragEnter(e, item, index){
  e.preventDefault();
  this.props.dragEnter(index); //call the action Creator from mapDispatchToProps
  this.forceUpdate()
}

onDragLeave(e, item, index){ //set back the array of styles
  e.preventDefault();
  this.props.dragLeave(index); //call the action Creator from mapDispatchToProps
  this.forceUpdate()
}

onDragOver(e, item, index){
  e.preventDefault(); //needed to allow onDrop event
}

onDrop(e, index){ //index is here the index of the element that the mouse is currently positioned over, not the index of the dragged item
  this.props.drop(e, index); //call the action Creator from mapDispatchToProps
  this.forceUpdate()
}

//RENDER FUNCTION - render a div with a todo for every single element in the list array using map
renderToDoSingles() {
  let toDoList = this.props.state.todos.map((item, index) => (
    <div key={index} className="toDoWrap">
     <div><FontAwesomeIcon icon="arrows-alt-v" className="iconDrag" /></div>
      <div className={this.props.state.style[index]}  draggable="true" onDragStart={(e)=>this.onDragStart(e, item, index)}  onDrag={(e)=>this.onDrag(e)} onDragEnd={(e)=>this.onDragEnd(e)}
                      onDragEnter={(e)=>this.onDragEnter(e, item, index)} onDragOver={(e)=>this.onDragOver(e, item, index)}   onDragLeave={(e)=>this.onDragLeave(e, item, index)}   onDrop={(e)=>this.onDrop(e, index)} >
        {item}
      </div>
      <button className="actionButton" onClick={() => this.onClickToDoDelete(index)}> <FontAwesomeIcon icon="trash" className="icon" /> </button>
    </div>
  )
  )

  return toDoList;
}


 // render ------

  render() {
  return (
  <div className="containerToDo">
  <h1 className="appName">Draggable ToDo List</h1>
  <div className="innerContainerToDo"  >
  {this.renderToDoSingles()}
  </div>
  <div className="innerContainerSubmit"  >
  <form className="form" onSubmit={this.handleSubmit}>
    <input className="input" type="text" value={this.state.input} onChange={this.handleChange} />
  <button className="actionButton" type="submit" value="Submit"> <FontAwesomeIcon icon="plus" className="icon" /> </button>
  </form>
  </div>
  </div>
)
}
}


// REDUX -----------------------------------------------------------------------

const store = createStore(submittedReducer, applyMiddleware(thunk));

const mapStateToProps = (state) => {
  return {
    state: state,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    toDoSubmitted: (input) => {
      dispatch(addToDo(input))
    },
    toDoDeleted: (index) => {
      dispatch(deleteToDo(index))
    },
    dragEnter : (index) => {
      dispatch(dragEnterAction(index))
    },
    dragLeave : (index) => {
      dispatch(dragLeaveAction(index))
    },
    drop : (e, index) => {
      dispatch(dropAction(e, index))
    },
  }
};

const Container = connect(mapStateToProps, mapDispatchToProps)(ToDos);


// LIST COMPONENT---------------------------------------------------------------



class ToDoRedux extends React.Component {

  render() {
   return (
     <Provider store={store}>
       <Container />
     </Provider>
  )
  }
}


export default ToDoRedux
