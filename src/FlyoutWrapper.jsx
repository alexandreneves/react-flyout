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
            if (this._closest(e.target, 'tag', 'a')) this.close();
        } else {
            this.close();
        }
    }

    _closest(el, findBy, findValue) {
        if (!el) return false;

        let value;

        if (el.tagName.toLowerCase() === 'body') return null;

        if (findBy === 'class') value = el.className;
        if (findBy === 'id') value = el.id;
        if (findBy === 'tag') value = el.tagName.toLowerCase();

        if (value === findValue) return el; // found
        return this._closest(el.parentNode, findBy, findValue); // not found, recurse
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
