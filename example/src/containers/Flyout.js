import {connect} from 'react-redux';
import {flyoutToggle} from '../actions';
import _ from 'lodash';

import FlyoutWrapper from '../../../src/FlyoutWrapper';

const mapStateToProps = (state, ownProp) => {
    if (state.flyoutToggle.id === ownProp.id) {
        // console.log('mapStateToProps', state, ownProp);
        return {
            open: state.flyoutToggle.open,
            options: Object.assign({}, ownProp.options, state.flyoutOptions.options)
        };
    }
    return {};
}

const mapDispatchToProps = (dispatch, ownProps) => {
    // console.log('mapDispatchToProps', ownProps);
    return {
        onWindowClick: () => { dispatch(flyoutToggle()) }
    }
}

const Flyout = connect(
    mapStateToProps,
    mapDispatchToProps
)(FlyoutWrapper);

export default Flyout;
