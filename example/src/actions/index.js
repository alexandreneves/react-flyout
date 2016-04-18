import * as types from '../constants/ActionTypes'

export const flyoutToggle = (id) => {
    // console.log('action flyoutToggle:', id);
    return {type: types.FLYOUT_TOGGLE, id: id};
};

export const flyoutOptions = (options) => {
    // console.log('action flyoutOptions:', options);
    return {type: types.FLYOUT_OPTIONS, options: options};
};
