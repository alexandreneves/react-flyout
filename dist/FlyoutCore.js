'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FlyoutCore = function (_React$Component) {
    _inherits(FlyoutCore, _React$Component);

    function FlyoutCore(props) {
        _classCallCheck(this, FlyoutCore);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FlyoutCore).call(this, props));

        _this.body = document.querySelector('body');
        _this.mutation = null;
        _this.mediaQueries = _this._getMediaQueries();
        _this.classes = {
            trigger: 'flyout__trigger--active',
            body: 'has-flyout--fixed'
        };

        // binds
        _this._sizeHandler = _this._sizeHandler.bind(_this);
        return _this;
    }

    _createClass(FlyoutCore, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            // events
            this._resizeEventAdd();

            // classes
            this._triggerClassSet();

            // scroll position
            this._scrollPositionSave();

            // flyout body
            this._setMaxHeight();
            this._setPosition();

            // toggle mutation observer
            this._mutationObserve();

            // size
            this._sizeHandler();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            // events
            this._resizeEventRemove();

            // classes
            this._triggerClassUnset();
            this._bodyClassUnset();

            // scrollposition
            this._scrollPositionLoad();

            // toggle mutation observer
            this._mutationDisconnect();
        }
    }, {
        key: 'render',
        value: function render() {
            var flyout = null;
            var classes = 'flyout';

            // classes
            classes += this.props.HOCProps.options.type ? ' flyout--' + this.props.HOCProps.options.type : ' flyout--dropdown';
            classes += this.props.HOCProps.options.theme ? ' flyout--' + this.props.HOCProps.options.theme : ' flyout--light';
            if (this.props.HOCProps.options.dropdownIconsLeft) classes += ' flyout--dropdown-has-icons-left';
            if (this.props.HOCProps.options.dropdownIconsRight) classes += ' flyout--dropdown-has-icons-right';
            classes += ' ' + this.props.HOCProps.id;

            return _react2.default.createElement(
                'div',
                { id: this.props.HOCProps.id, className: classes },
                _react2.default.createElement(
                    'div',
                    { className: 'flyout__wrapper' },
                    this.props.HOCProps.children
                )
            );
        }
    }, {
        key: '_setPosition',
        value: function _setPosition(alignment) {
            // console.info('flyout - _setPosition');

            var dom = _reactDom2.default.findDOMNode(this);
            var parent = dom.parentNode;
            var alignments = [];

            if (typeof alignment === 'undefined') alignment = this._getAlignment();

            alignments[0] = {
                'top': 0,
                'right': parent.offsetWidth + 'px',
                'bottom': parent.offsetHeight + 'px',
                'left': 0
            };

            alignments[1] = {
                'top': 0,
                'right': 0,
                'bottom': 0,
                'left': 0
            };

            if (alignment[0] === 'top') {
                console.error('flyout - alignment not supported yet');
            } else if (alignment[0] === 'right') {
                dom.style.left = alignments[0]['right'];
            } else if (alignment[0] === 'bottom') {
                dom.style.top = alignments[0]['bottom'];
            } else if (alignment[0] === 'left') {
                console.error('flyout - alignment not supported yet');
            }

            if (alignment[1] === 'top') {
                console.error('flyout - alignment not supported yet');
            } else if (alignment[1] === 'right') {
                dom.style.left = alignments[1]['right'];
            } else if (alignment[1] === 'bottom') {
                dom.style.top = alignments[1]['top'];
            } else if (alignment[1] === 'left') {
                dom.style.right = alignments[1]['left'];
            }

            this._verifyPosition();
        }
    }, {
        key: '_verifyPosition',
        value: function _verifyPosition() {
            if (!this.props.HOCProps.options.fixed) return false;
            // console.info('flyout - _verifyPosition');

            // if a flyout as a parent with position fixed
            // the only way to show all the information is to contain the flyout inside the window
            // to achieve this we need:
            // 1 - make sure the flyout's contained in the window
            // 2 - if not, determine the best alignment
            // 3 - inside scroll will take care of the rest

            var windowHeight = window.innerHeight;

            var trigger = this._getTrigger();
            var triggerHeight = parseInt(trigger.offsetHeight);
            var triggerOffsetTop = parseInt(this._getOffset(trigger)['top']);

            var flyout = document.querySelector('#' + this.props.HOCProps.id);
            var flyoutContent = document.querySelector('#' + this.props.HOCProps.id + '> div'); // todo: fix me
            var flyoutHeight = parseInt(flyout.offsetHeight);
            var flyoutOffsetTop = parseInt(this._getOffset(flyout)['top']);
            var flyoutMinHeight = parseInt(flyout.style.minHeight) | 0;
            var flyoutMaxHeight = parseInt(flyout.style.maxHeight) | 0;

            var alignment = this._getAlignment();

            var moreSpaceAbove = triggerOffsetTop + triggerHeight / 2 > windowHeight / 2;
            var getMaxHeightOffsetPosition = moreSpaceAbove ? 'top' : 'bottom';

            var newFlyoutMaxHeight = void 0;

            // first we'll check if we need more space
            if (flyoutHeight + flyoutOffsetTop + this._getMaxHeightOffset(getMaxHeightOffsetPosition) > windowHeight) {
                // console.info('flyout - vertically out of bounds');

                // now we'll verify the best vertical alignment
                // by finding out the optimal position, top or bottom

                if (moreSpaceAbove) {
                    // more space above
                    // console.info('flyout - we have more space above, overriding position and max-height');

                    // re-align to trigger
                    flyout.style.bottom = triggerHeight;
                    flyout.style.top = 'initial';

                    // let's check the max-height possible
                    newFlyoutMaxHeight = triggerOffsetTop + triggerHeight - this._getMaxHeightOffset(getMaxHeightOffsetPosition);
                    flyoutContent.style.maxHeight = newFlyoutMaxHeight + 'px';

                    // let's add a class for possible customizations when forced position is applied
                    if (alignment[0] === 'bottom' || alignment[1] === 'bottom') this._classAdd(flyout, 'flyout--forced-top');
                } else {
                    // more space bellow
                    // console.info('flyout - we have more space bellow, overriding position and max-height');

                    // check the max-height possible
                    var _newFlyoutMaxHeight = windowHeight - flyoutOffsetTop - this._getMaxHeightOffset(getMaxHeightOffsetPosition);

                    // verify it against a possible setted max-height
                    if (flyoutMaxHeight !== 0 && _newFlyoutMaxHeight >= flyoutMaxHeight) return false;

                    // removing min-height for extreme cases
                    if (_newFlyoutMaxHeight < flyoutMinHeight) flyout.style.minHeight = 0;

                    // set new max-height
                    flyoutContent.style.maxHeight = _newFlyoutMaxHeight + 'px';

                    // let's add a class for possible customizations when forced position is applied
                    if (alignment[0] === 'top' || alignment[1] === 'top') this._classAdd(flyout, 'flyout--forced-bottom');
                }
            }
        }
    }, {
        key: '_setMaxHeight',
        value: function _setMaxHeight() {
            // console.info('flyout - _setMaxHeight');

            var windowHeight = window.innerHeight;
            var flyoutContent = document.querySelector('#' + this.props.HOCProps.id + ' > div');

            var maxHeight = parseInt(windowHeight / 1.20);

            flyoutContent.style.maxHeight = maxHeight;
        }
    }, {
        key: '_mutationObserve',
        value: function _mutationObserve() {
            var _this2 = this;

            // console.info('flyout - _mutationObserve');

            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
            var flyout = document.querySelector('#' + this.props.HOCProps.id);

            this.mutation = new MutationObserver(function (mutations) {
                _this2._mutationObserved();
            });

            this.mutation.observe(flyout, {
                childList: true,
                subtree: true
            });
        }
    }, {
        key: '_mutationObserved',
        value: function _mutationObserved() {
            // console.info('flyout - _mutationObserved');
            this._verifyPosition();
        }
    }, {
        key: '_mutationDisconnect',
        value: function _mutationDisconnect() {
            // console.info('flyout - _mutationDisconnect');
            if (this.mutation) this.mutation.disconnect();
        }
    }, {
        key: '_sizeHandler',
        value: function _sizeHandler() {
            if (!this.props.HOCProps.options.mobile) return false;
            // console.info('flyout - _sizeHandler');

            var flyout = document.querySelector('#' + this.props.HOCProps.id);
            var width = window.innerWidth;

            if (window.innerWidth < this.mediaQueries.mediumUp) {
                this._classAdd(flyout, 'flyout--fixed');
                this._bodyClassSet();
            } else {
                this._classRemove(flyout, 'flyout--fixed');
                this._bodyClassUnset();
            }
        }
    }, {
        key: '_resizeEventAdd',
        value: function _resizeEventAdd() {
            var _this3 = this;

            if (!this.props.HOCProps.options.mobile) return false;
            setTimeout(function () {
                // console.info('flyout - _resizeEventAdd');
                window.addEventListener('resize', _this3._sizeHandler);
            }, 0);
        }
    }, {
        key: '_resizeEventRemove',
        value: function _resizeEventRemove() {
            if (!this.props.HOCProps.options.mobile) return false;
            // console.info('flyout - _resizeEventRemove');
            window.removeEventListener('resize', this._sizeHandler);
        }
    }, {
        key: '_triggerClassSet',
        value: function _triggerClassSet() {
            // console.info('flyout - _triggerClassSet');
            this._classAdd(this._getTrigger(), this.classes.trigger);
        }
    }, {
        key: '_triggerClassUnset',
        value: function _triggerClassUnset() {
            // console.info('flyout - _triggetClassUnset');
            this._classRemove(this._getTrigger(), this.classes.trigger);
        }
    }, {
        key: '_bodyClassSet',
        value: function _bodyClassSet() {
            // console.info('flyout - _bodyClassSet');
            this._classAdd(this.body, this.classes.body);
        }
    }, {
        key: '_bodyClassUnset',
        value: function _bodyClassUnset() {
            // console.info('flyout - _bodyClassUnset');
            this._classRemove(this.body, this.classes.body);
        }
    }, {
        key: '_scrollPositionSave',
        value: function _scrollPositionSave() {
            // console.info('flyout - _saveScrollPosition');
            // triggers active class must be use since the open event of the new flyouts
            // runs before the close event of the previous flyout
            if (document.querySelectorAll('.' + this.classes.trigger).length) {
                this.body.setAttribute('data-flyoutBodyScrollPosition', window.pageYOffset);
            }
        }
    }, {
        key: '_scrollPositionLoad',
        value: function _scrollPositionLoad() {
            var _this4 = this;

            // console.info('flyout - _loadScrollPosition');
            if (this.body.classList && !this.body.classList.contains('has-flyout--fixed')) return false;
            setTimeout(function () {
                window.scrollTo(window.pageYOffset, _this4.body.getAttribute('data-flyoutbodyscrollposition'));
            }, 0);
        }
    }, {
        key: '_getAlignment',
        value: function _getAlignment() {
            // console.info('flyout - _getAlignment');
            var alignment = this.props.HOCProps.options.align.split(' ');
            return [alignment[0], alignment[1]];
        }
    }, {
        key: '_getMaxHeightOffset',
        value: function _getMaxHeightOffset(position) {
            // console.info('flyout - _getMaxHeightOffset:', position);
            return position === 'top' ? 60 : 25;
        }
    }, {
        key: '_getTrigger',
        value: function _getTrigger() {
            // console.info('flyout - _getTrigger);
            var triggers = document.querySelectorAll('[data-flyout-id]');
            var triggersLength = triggers.length;

            for (var i = 0; i < triggersLength; i++) {
                if (triggers[i].getAttribute('data-flyout-id') === this.props.HOCProps.id) {
                    return triggers[i];
                }
            }

            return null;
        }
    }, {
        key: '_getMediaQueries',
        value: function _getMediaQueries() {
            // console.info('flyout - _getMediaQueries');
            var mediaQueries = {};
            var mqs = this.props.mediaQueries;

            mediaQueries.breakpointSmall = mqs && mqs.breakpointSmall ? mqs.breakpointSmall : 640;
            mediaQueries.breakpointMedium = mqs && mqs.breakpointMedium ? mqs.breakpointMedium : 1024;
            mediaQueries.breakpointLarge = mqs && mqs.breakpointLarge ? mqs.breakpointLarge : 1920;
            mediaQueries.mediumUp = mqs && mqs.mediumUp ? mqs.mediumUp : 641;
            mediaQueries.largeUp = mqs && mqs.largeUp ? mqs.largeUp : 1025;

            return mediaQueries;
        }
    }, {
        key: '_getOffset',
        value: function _getOffset(el) {
            // console.info('flyout - _getOffset');
            var rect = el.getBoundingClientRect();

            return {
                top: rect.top,
                left: rect.left
            };
        }
    }, {
        key: '_classAdd',
        value: function _classAdd(el, elClass) {
            // console.info('flyout - _classAdd');
            el.classList.add(elClass);
        }
    }, {
        key: '_classRemove',
        value: function _classRemove(el, elClass) {
            // console.info('flyout - _classRemove');
            el.classList.remove(elClass);
        }
    }]);

    return FlyoutCore;
}(_react2.default.Component);

;

exports.default = FlyoutCore;
