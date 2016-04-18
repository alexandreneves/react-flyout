import {combineReducers} from 'redux';
import flyoutToggle from './flyoutToggle';
import flyoutOptions from './flyoutOptions';

const exampleApp = combineReducers({
    flyoutToggle,
    flyoutOptions
});

export default exampleApp;
