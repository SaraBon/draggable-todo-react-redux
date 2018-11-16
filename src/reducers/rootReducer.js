import { combineReducers } from 'redux';
import submittedReducer from './submittedReducer';

export default combineReducers({
 submit: submittedReducer,  
});
