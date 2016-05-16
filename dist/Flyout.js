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

var Flyout = function (_React$Component) {
    _inherits(Flyout, _React$Component);

    function Flyout(props) {
        _classCallCheck(this, Flyout);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Flyout).call(this, props));

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

    _createClass(Flyout, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            // console.info('flyout - componentDidMount');
            this._resizeEventAdd();
            this._triggerClassSet();
            this._scrollPositionSave();
            this._setMaxHeight();
            this._setAlignment();
            this._sizeHandler();
            this._mutationObserve();
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            // console.info('flyout - componentDidUpdate');
            this._setAlignment();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            // console.info('flyout - componentWillUnmount');
            this._resizeEventRemove();
            this._triggerClassUnset();
            this._bodyClassUnset();
            this._scrollPositionLoad();
            this._mutationDisconnect();
        }
    }, {
        key: 'render',
        value: function render() {
            // console.info('flyout - render');
            var classes = this._getClasses();
            var arrow = this.props.options.type === 'tooltip' ? _react2.default.createElement('span', { className: 'flyout__arrow' }) : null;

            return _react2.default.createElement(
                'div',
                { id: this.props.id, className: classes },
                _react2.default.createElement(
                    'div',
                    { className: 'flyout__wrapper' },
                    this.props.children
                ),
                arrow
            );
        }
    }, {
        key: '_setAlignment',
        value: function _setAlignment(alignment) {
            // console.info('flyout - _setAlignment');

            var dom = _reactDom2.default.findDOMNode(this);
            var parent = dom.parentNode;
            var margin = this._getMargin();
            var alignments = [];

            if (typeof alignment === 'undefined') alignment = this._getAlignment();

            alignments[0] = {
                'top': -dom.offsetHeight - margin + 'px',
                'right': parent.offsetWidth + margin + 'px',
                'bottom': parent.offsetHeight + margin + 'px',
                'left': -dom.offsetWidth - margin + 'px'
            };

            alignments[1] = {
                'top': -dom.offsetHeight + parent.offsetHeight + 'px',
                'right': 0,
                'bottom': 0,
                'left': 0
            };

            // reset
            dom.style.top = '';
            dom.style.right = '';
            dom.style.bottom = '';
            dom.style.left = '';

            if (alignment[0] === 'top') {
                dom.style.top = alignments[0]['top'];
            } else if (alignment[0] === 'right') {
                dom.style.left = alignments[0]['right'];
            } else if (alignment[0] === 'bottom') {
                dom.style.top = alignments[0]['bottom'];
            } else if (alignment[0] === 'left') {
                dom.style.left = alignments[0]['left'];
            }

            if (alignment[1] === 'top') {
                dom.style.top = alignments[1]['top'];
            } else if (alignment[1] === 'right') {
                dom.style.left = alignments[1]['right'];
            } else if (alignment[1] === 'bottom') {
                dom.style.top = alignments[1]['bottom'];
            } else if (alignment[1] === 'left') {
                dom.style.right = alignments[1]['left'];
            }

            // arrow
            if (this.props.options.type === 'tooltip') {
                var arrow = document.querySelector('#' + this.props.id + ' .flyout__arrow');
                var arrowBorderWidth = parseInt(window.getComputedStyle(arrow, null).getPropertyValue('border-top-width'));
                var arrowAlignment = void 0;

                arrow.style.top = 'auto';
                arrow.style.right = 'auto';
                arrow.style.bottom = 'auto';
                arrow.style.left = 'auto';

                var arrowAlignmentTB = parent.offsetWidth / 2 - arrowBorderWidth + 'px';
                if (alignment[0] === 'top' && alignment[1] === 'right') arrowAlignment = { top: '100%', left: arrowAlignmentTB };
                if (alignment[0] === 'top' && alignment[1] === 'left') arrowAlignment = { top: '100%', right: arrowAlignmentTB };
                if (alignment[0] === 'bottom' && alignment[1] === 'right') arrowAlignment = { bottom: '100%', left: arrowAlignmentTB };
                if (alignment[0] === 'bottom' && alignment[1] === 'left') arrowAlignment = { bottom: '100%', right: arrowAlignmentTB };

                var arrowAlignmentRL = parent.offsetHeight / 2 - arrowBorderWidth + 'px';
                if (alignment[0] === 'right' && alignment[1] === 'top') arrowAlignment = { right: '100%', bottom: arrowAlignmentRL };
                if (alignment[0] === 'right' && alignment[1] === 'bottom') arrowAlignment = { right: '100%', top: arrowAlignmentRL };
                if (alignment[0] === 'left' && alignment[1] === 'top') arrowAlignment = { left: '100%', bottom: arrowAlignmentRL };
                if (alignment[0] === 'left' && alignment[1] === 'bottom') arrowAlignment = { left: '100%', top: arrowAlignmentRL };

                for (var k in arrowAlignment) {
                    arrow.style[k] = arrowAlignment[k];
                }
            }

            // VERIFY IF FIXED PARENT
            this._verifyPosition();
        }
    }, {
        key: '_verifyPosition',
        value: function _verifyPosition() {
            if (!this.props.options.fixed) return false;
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

            var flyout = document.querySelector('#' + this.props.id);
            var flyoutContent = document.querySelector('#' + this.props.id + '> div'); // todo: fix me
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
                    if (alignment[0] === 'bottom' || alignment[1] === 'bottom') flyout.classList.add('flyout--forced-top');
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
                    if (alignment[0] === 'top' || alignment[1] === 'top') flyout.classList.add('flyout--forced-bottom');
                }
            }
        }
    }, {
        key: '_setMaxHeight',
        value: function _setMaxHeight() {
            // console.info('flyout - _setMaxHeight');
            var windowHeight = window.innerHeight;
            var flyoutContent = document.querySelector('#' + this.props.id + ' > div');
            var maxHeight = parseInt(windowHeight / 1.20);

            flyoutContent.style.maxHeight = maxHeight;
        }
    }, {
        key: '_mutationObserve',
        value: function _mutationObserve() {
            var _this2 = this;

            // console.info('flyout - _mutationObserve');
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
            var flyout = document.querySelector('#' + this.props.id);

            this.mutation = new MutationObserver(function (mutations) {
                _this2._mutationObserved();
            });

            this.mutation.observe(flyout, {
                childList: true,
                subtree: true,
                attributes: true,
                characterData: true
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
            if (!this.props.options.mobile) return false;
            // console.info('flyout - _sizeHandler');

            var flyout = document.querySelector('#' + this.props.id);
            var width = window.innerWidth;

            if (window.innerWidth < this.mediaQueries.mediumUp) {
                flyout.classList.add('flyout--fixed');
                this._bodyClassSet();
            } else {
                flyout.classList.remove('flyout--fixed');
                this._bodyClassUnset();
            }
        }
    }, {
        key: '_resizeEventAdd',
        value: function _resizeEventAdd() {
            var _this3 = this;

            if (!this.props.options.mobile) return false;
            setTimeout(function () {
                // console.info('flyout - _resizeEventAdd');
                window.addEventListener('resize', _this3._sizeHandler);
            }, 0);
        }
    }, {
        key: '_resizeEventRemove',
        value: function _resizeEventRemove() {
            if (!this.props.options.mobile) return false;
            // console.info('flyout - _resizeEventRemove');
            window.removeEventListener('resize', this._sizeHandler);
        }
    }, {
        key: '_triggerClassSet',
        value: function _triggerClassSet() {
            // console.info('flyout - _triggerClassSet');
            this._getTrigger().classList.add(this.classes.trigger);
        }
    }, {
        key: '_triggerClassUnset',
        value: function _triggerClassUnset() {
            // console.info('flyout - _triggetClassUnset');
            this._getTrigger().classList.remove(this.classes.trigger);
        }
    }, {
        key: '_bodyClassSet',
        value: function _bodyClassSet() {
            // console.info('flyout - _bodyClassSet');
            this.body.classList.add(this.classes.body);
        }
    }, {
        key: '_bodyClassUnset',
        value: function _bodyClassUnset() {
            // console.info('flyout - _bodyClassUnset');
            this.body.classList.remove(this.classes.body);
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
            var defaults = this.props.options.type === 'tooltip' ? 'top right' : 'bottom right';
            var sep = ' ';
            var alignment = this.props.options.align;

            if (typeof alignment === 'undefined') {
                return defaults.split(sep);
            } else {
                alignment = this.props.options.align.split(sep);
                return alignment.length === 2 ? alignment : defaults.split(sep);
            }
        }
    }, {
        key: '_getMargin',
        value: function _getMargin() {
            var def = 1;
            var type = this.props.options.type;
            var margins = {
                tooltip: 6,
                menu: 0
            };
            return typeof margins[type] !== 'undefined' ? margins[type] : def;
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
                if (triggers[i].getAttribute('data-flyout-id') === this.props.id) {
                    return triggers[i];
                }
            }

            return null;
        }
    }, {
        key: '_getMediaQueries',
        value: function _getMediaQueries() {
            // console.info('flyout - _getMediaQueries');
            var mqs = this.props.mediaQueries;
            var mediaQueries = {};

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
        key: '_getClasses',
        value: function _getClasses() {
            var classes = [];

            classes.push(this.props.id);
            classes.push('flyout');
            classes.push(this.props.options.type ? 'flyout--' + this.props.options.type : 'flyout--dropdown');
            classes.push('flyout--' + this._getAlignment().join('-'));

            if (this.props.options.dropdownIconsLeft) classes.push('flyout--dropdown-has-icons-left');
            if (this.props.options.dropdownIconsRight) classes.push('flyout--dropdown-has-icons-right');
            if (this.props.options.type !== 'tooltip') classes.push(this.props.options.theme ? 'flyout--' + this.props.options.theme : 'flyout--light');

            return classes.join(' ');
        }
    }]);

    return Flyout;
}(_react2.default.Component);

;

exports.default = Flyout;
