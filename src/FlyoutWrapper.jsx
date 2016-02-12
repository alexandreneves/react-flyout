 'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import FlyoutCore from './FlyoutCore';

class FlyoutWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };

        // pre-binding
        this._handleClick = this._handleClick.bind(this);
    }

    componentDidUpdate() {
        if (this.state.open) {
            this._setClickEvent();
        } else {
            this._unsetClickEvent();
        }
    }

    componentWillUnmount() {
        this._unsetClickEvent();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.open !== nextState.open) return true;
        return false;
    }

    render() {
        if (!this.state.open) return null;
        return <FlyoutCore HOCProps={this.props} mediaQueries={this.mediaQueries} />;
    }

    _setClickEvent() {
        // console.info('Flyout - _setClickEvent');
        setTimeout(() => {
            window.addEventListener('click', this._handleClick);
        }, 0);
    }

    _unsetClickEvent() {
        // console.info('Flyout - _unsetClickEvent');
        window.removeEventListener('click', this._handleClick);
    }

    _handleClick(e) {
        // console.log('Flyout - _handleClick');
        let dom = ReactDOM.findDOMNode(this);

        // check if click was outside or inside the flyout
        if (dom.contains(e.target)) {
            // to-do: bubbling check
            if (e.target.tagName.toLowerCase() === 'a') this.close();
        } else {
            this.close();
        }
    }

    open() {
        this.setState({open: true});
    }

    close() {
        this.setState({open: false});
    }
}

FlyoutWrapper.propTypes = {
    id: React.PropTypes.string.isRequired,
    options: React.PropTypes.object
};

FlyoutWrapper.defaultProps = {
    id: null,
    options: null
};

export default FlyoutWrapper;
