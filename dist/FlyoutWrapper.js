'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Flyout = require('./Flyout');

var _Flyout2 = _interopRequireDefault(_Flyout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FlyoutWrapper = function (_React$Component) {
    _inherits(FlyoutWrapper, _React$Component);

    function FlyoutWrapper(props) {
        _classCallCheck(this, FlyoutWrapper);

        // pre-binding

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FlyoutWrapper).call(this, props));

        _this._handleClick = _this._handleClick.bind(_this);
        return _this;
    }

    _createClass(FlyoutWrapper, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            // console.info('flyout - componentDidUpdate');
            if (this.props.options.type === 'tooltip') return false;
            if (!this.props.onWindowClick) return false;
            if (prevProps.open === this.props.open) return false;
            this.props.open ? this._setClickEvent() : this._unsetClickEvent();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            // console.info('flyout - componentWillUnmount');
            this._unsetClickEvent();
        }
    }, {
        key: 'render',
        value: function render() {
            // console.info('flyout - render');
            if (!this.props.open) return null;
            return _react2.default.createElement(_Flyout2.default, _extends({}, this.props, { mediaQueries: this.mediaQueries }));
        }
    }, {
        key: '_setClickEvent',
        value: function _setClickEvent() {
            var _this2 = this;

            // console.info('flyout - _setClickEvent');
            setTimeout(function () {
                window.addEventListener('click', _this2._handleClick);
            }, 0);
        }
    }, {
        key: '_unsetClickEvent',
        value: function _unsetClickEvent() {
            // console.info('flyout - _unsetClickEvent');
            window.removeEventListener('click', this._handleClick);
        }
    }, {
        key: '_handleClick',
        value: function _handleClick(e) {
            // console.log('flyout - _handleClick');
            var dom = _reactDom2.default.findDOMNode(this);

            // check if click was outside or inside the flyout
            if (dom) {
                if (dom.contains(e.target)) {
                    if (this._closest(e.target, 'tag', 'a')) this.props.onWindowClick();
                } else {
                    this.props.onWindowClick();
                }
            }
        }
    }, {
        key: '_closest',
        value: function _closest(el, findBy, findValue) {
            if (!el) return false;

            var value = void 0;

            if (el.tagName.toLowerCase() === 'body') return null;

            if (findBy === 'class') value = el.className;
            if (findBy === 'id') value = el.id;
            if (findBy === 'tag') value = el.tagName.toLowerCase();

            if (value === findValue) return el; // found
            return this._closest(el.parentNode, findBy, findValue); // not found, recurse
        }
    }]);

    return FlyoutWrapper;
}(_react2.default.Component);

FlyoutWrapper.propTypes = {
    id: _react2.default.PropTypes.string.isRequired,
    open: _react2.default.PropTypes.bool.isRequired,
    options: _react2.default.PropTypes.object
};

FlyoutWrapper.defaultProps = {
    id: null,
    open: false,
    options: {}
};

exports.default = FlyoutWrapper;
