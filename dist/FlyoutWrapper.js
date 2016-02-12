'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _FlyoutCore = require('./FlyoutCore');

var _FlyoutCore2 = _interopRequireDefault(_FlyoutCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FlyoutWrapper = function (_React$Component) {
    _inherits(FlyoutWrapper, _React$Component);

    function FlyoutWrapper(props) {
        _classCallCheck(this, FlyoutWrapper);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FlyoutWrapper).call(this, props));

        _this.state = {
            open: false
        };

        // pre-binding
        _this._handleClick = _this._handleClick.bind(_this);
        return _this;
    }

    _createClass(FlyoutWrapper, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            if (this.state.open) {
                this._setClickEvent();
            } else {
                this._unsetClickEvent();
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this._unsetClickEvent();
        }
    }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
            if (this.state.open !== nextState.open) return true;
            return false;
        }
    }, {
        key: 'render',
        value: function render() {
            if (!this.state.open) return null;
            return _react2.default.createElement(_FlyoutCore2.default, { HOCProps: this.props, mediaQueries: this.mediaQueries });
        }
    }, {
        key: '_setClickEvent',
        value: function _setClickEvent() {
            var _this2 = this;

            // console.info('Flyout - _setClickEvent');
            setTimeout(function () {
                window.addEventListener('click', _this2._handleClick);
            }, 0);
        }
    }, {
        key: '_unsetClickEvent',
        value: function _unsetClickEvent() {
            // console.info('Flyout - _unsetClickEvent');
            window.removeEventListener('click', this._handleClick);
        }
    }, {
        key: '_handleClick',
        value: function _handleClick(e) {
            // console.log('Flyout - _handleClick');
            var dom = _reactDom2.default.findDOMNode(this);

            // check if click was outside or inside the flyout
            if (dom.contains(e.target)) {
                // to-do: bubbling check
                if (e.target.tagName.toLowerCase() === 'a') this.close();
            } else {
                this.close();
            }
        }
    }, {
        key: 'open',
        value: function open() {
            this.setState({ open: true });
        }
    }, {
        key: 'close',
        value: function close() {
            this.setState({ open: false });
        }
    }]);

    return FlyoutWrapper;
}(_react2.default.Component);

FlyoutWrapper.propTypes = {
    id: _react2.default.PropTypes.string.isRequired,
    options: _react2.default.PropTypes.object
};

FlyoutWrapper.defaultProps = {
    id: null,
    options: null
};

exports.default = FlyoutWrapper;
