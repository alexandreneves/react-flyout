import { FLYOUT_OPTIONS } from '../constants/ActionTypes'
import _ from 'lodash';

const initialState = {
    options: null
};

const flyoutOptions = (state = initialState, action) => {
    switch (action.type) {
    case FLYOUT_OPTIONS:
        // console.info('reducer flyoutOptions:', state, action);
        return _.merge({}, state, {options: action.options});
    default:
        // console.info('reducer flyoutOptions DEFAULT:', state);
        return state;
    }
};

export default flyoutOptions;
