import React from 'react';
import ReactDOM from 'react-dom';
import Flyout from './Flyout';
import Closest from '@aneves/js-closest';

class FlyoutWrapper extends React.Component {
    constructor(props) {
        super(props);

        // pre-binding
        this._handleClick = this._handleClick.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        // console.info('flyout - componentDidUpdate');
        if (this.props.options.type === 'tooltip') return false;
        if (!this.props.onWindowClick) return false;
        if (prevProps.open === this.props.open) return false;
        this.props.open ? this._setClickEvent() : this._unsetClickEvent();
    }

    componentWillUnmount() {
        // console.info('flyout - componentWillUnmount');
        this._unsetClickEvent();
    }

    render() {
        // console.info('flyout - render');
        if (!this.props.open) return null;
        return <Flyout {...this.props} mediaQueries={this.mediaQueries} />;
    }

    _setClickEvent() {
        // console.info('flyout - _setClickEvent');
        setTimeout(() => {
            window.addEventListener('click', this._handleClick);
        }, 0);
    }

    _unsetClickEvent() {
        // console.info('flyout - _unsetClickEvent');
        window.removeEventListener('click', this._handleClick);
    }

    _handleClick(e) {
        // console.log('flyout - _handleClick');
        let dom = ReactDOM.findDOMNode(this);

        if (e.target.getAttribute('data-flyout') === 'keepopen') return false;

        // check if click was outside or inside the flyout
        if (dom && dom.contains(e.target)) {
            if (Closest(e.target, 'tag', 'a')) this.props.onWindowClick();
        } else {
            this.props.onWindowClick();
        }
    }
}

FlyoutWrapper.propTypes = {
    id: React.PropTypes.string.isRequired,
    open: React.PropTypes.bool,
    options: React.PropTypes.object
};

FlyoutWrapper.defaultProps = {
    id: null,
    options: {}
};

export default FlyoutWrapper;
