import { FLYOUT_TOGGLE } from '../constants/ActionTypes'

const initialState = {
    id: null,
    open: false
};

const flyoutToggle = (state = initialState, action) => {
    switch (action.type) {
    case FLYOUT_TOGGLE:
        // console.info('reducer flyoutToggle:', state, action);
        let s;

        if (!state.id || state.id === action.id) { // first toggle / same flyout: toggle
            s = !state.open;
        } else if (typeof action.id === 'undefined') { // window click: close
            s = false;
        } else { // different flyout: open
            s = true;
        }

        return Object.assign({}, state, {
            id: action.id,
            open: s
        });
    default:
        // console.info('reducer flyoutToggle DEFAULT:', state);
        return state;
    }
};

export default flyoutToggle;
