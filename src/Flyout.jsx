'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

class Flyout extends React.Component {
    constructor(props) {
        super(props);

        this.body = document.querySelector('body');
        this.mutation = null;
        this.mediaQueries = this._getMediaQueries();
        this.classes = {
            trigger: 'flyout__trigger--active',
            body: 'has-flyout--fixed'
        }

        // binds
        this._sizeHandler = this._sizeHandler.bind(this);
    }

    componentDidMount() {
        // console.info('flyout - componentDidMount');

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

    componentDidUpdate() {
        // console.info('flyout - componentDidUpdate');
        this._setPosition();
    }

    componentWillUnmount() {
        // console.info('flyout - componentWillUnmount');

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

    render() {
        // console.info('flyout - render');

        let flyout = null;
        let classes = [];

        // classes
        classes.push('flyout');
        classes.push(this.props.options.type ? 'flyout--'+ this.props.options.type : 'flyout--dropdown');
        classes.push(this.props.options.theme ? 'flyout--'+ this.props.options.theme : 'flyout--light');
        if (this.props.options.dropdownIconsLeft) classes.push('flyout--dropdown-has-icons-left');
        if (this.props.options.dropdownIconsRight) classes.push('flyout--dropdown-has-icons-right');
        classes.push('flyout--'+ this._getAlignment().join('-'));
        classes.push(this.props.id);

        // flyout tooltip arrow
        const arrow = this.props.options.type === 'tooltip' ? <span className="flyout__arrow" /> : null;

        return (
            <div id={this.props.id} className={classes.join(' ')}>
                <div className="flyout__wrapper">
                    {this.props.children}
                </div>
                {arrow}
            </div>
        );
    }

    _setPosition(alignment) {
        // console.info('flyout - _setPosition');

        const dom = ReactDOM.findDOMNode(this);
        const parent = dom.parentNode;
        const margin = this.props.options.type !== 'tooltip' ? 1 : 6;
        let alignments = [];

        if (typeof alignment === 'undefined') alignment = this._getAlignment();

        alignments[0] = {
            'top': - dom.offsetHeight - margin + 'px',
            'right': parent.offsetWidth + margin + 'px',
            'bottom': parent.offsetHeight + margin + 'px',
            'left': - dom.offsetWidth - margin + 'px'
        }

        alignments[1] = {
            'top': - dom.offsetHeight + parent.offsetHeight + 'px',
            'right': 0,
            'bottom': 0,
            'left': 0
        }

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

        this._verifyPosition();
    }

    _verifyPosition() {
        if (!this.props.options.fixed) return false;
        // console.info('flyout - _verifyPosition');

        // if a flyout as a parent with position fixed
        // the only way to show all the information is to contain the flyout inside the window
        // to achieve this we need:
        // 1 - make sure the flyout's contained in the window
        // 2 - if not, determine the best alignment
        // 3 - inside scroll will take care of the rest

        let windowHeight = window.innerHeight;

        let trigger = this._getTrigger();
        let triggerHeight = parseInt(trigger.offsetHeight);
        let triggerOffsetTop = parseInt(this._getOffset(trigger)['top']);

        let flyout = document.querySelector('#'+ this.props.id);
        let flyoutContent = document.querySelector('#'+ this.props.id + '> div'); // todo: fix me
        let flyoutHeight = parseInt(flyout.offsetHeight);
        let flyoutOffsetTop = parseInt(this._getOffset(flyout)['top']);
        let flyoutMinHeight = parseInt(flyout.style.minHeight) | 0;
        let flyoutMaxHeight = parseInt(flyout.style.maxHeight) | 0;

        let alignment = this._getAlignment();

        let moreSpaceAbove = (triggerOffsetTop + (triggerHeight / 2) > (windowHeight / 2));
        let getMaxHeightOffsetPosition = moreSpaceAbove ? 'top' : 'bottom';

        let newFlyoutMaxHeight;

        // first we'll check if we need more space
        if (flyoutHeight + flyoutOffsetTop + this._getMaxHeightOffset(getMaxHeightOffsetPosition) > windowHeight) {
            // console.info('flyout - vertically out of bounds');

            // now we'll verify the best vertical alignment
            // by finding out the optimal position, top or bottom

            if (moreSpaceAbove) { // more space above
                // console.info('flyout - we have more space above, overriding position and max-height');

                // re-align to trigger
                flyout.style.bottom = triggerHeight;
                flyout.style.top = 'initial';

                // let's check the max-height possible
                newFlyoutMaxHeight = triggerOffsetTop + triggerHeight - this._getMaxHeightOffset(getMaxHeightOffsetPosition);
                flyoutContent.style.maxHeight = newFlyoutMaxHeight +'px';

                // let's add a class for possible customizations when forced position is applied
                if (alignment[0] === 'bottom' || alignment[1] === 'bottom') this._classAdd(flyout, 'flyout--forced-top');
            } else { // more space bellow
                // console.info('flyout - we have more space bellow, overriding position and max-height');

                // check the max-height possible
                let newFlyoutMaxHeight = windowHeight - (flyoutOffsetTop) - this._getMaxHeightOffset(getMaxHeightOffsetPosition);
                
                // verify it against a possible setted max-height
                if (flyoutMaxHeight !== 0 && newFlyoutMaxHeight >= flyoutMaxHeight) return false;

                // removing min-height for extreme cases
                if (newFlyoutMaxHeight < flyoutMinHeight) flyout.style.minHeight = 0;
                
                // set new max-height
                flyoutContent.style.maxHeight = newFlyoutMaxHeight +'px';

                // let's add a class for possible customizations when forced position is applied
                if (alignment[0] === 'top' || alignment[1] === 'top') this._classAdd(flyout, 'flyout--forced-bottom');
            }
        }
    }

    _setMaxHeight() {
        // console.info('flyout - _setMaxHeight');
        
        let windowHeight = window.innerHeight;
        let flyoutContent = document.querySelector('#'+ this.props.id +' > div');

        let maxHeight = parseInt(windowHeight / 1.20);

        flyoutContent.style.maxHeight = maxHeight;
    }

    _mutationObserve() {
        // console.info('flyout - _mutationObserve');

        let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        let flyout = document.querySelector('#'+ this.props.id);

        this.mutation = new MutationObserver((mutations) => {
            this._mutationObserved();
        });

        this.mutation.observe(flyout, {
            childList: true,
            subtree: true
        });
    }

    _mutationObserved() {
        // console.info('flyout - _mutationObserved');
        this._verifyPosition();
    }

    _mutationDisconnect() {
        // console.info('flyout - _mutationDisconnect');
        if (this.mutation) this.mutation.disconnect();
    }

    _sizeHandler() {
        if (!this.props.options.mobile) return false;
        // console.info('flyout - _sizeHandler');

        let flyout = document.querySelector('#'+ this.props.id);
        let width = window.innerWidth;


        if (window.innerWidth < this.mediaQueries.mediumUp) {
            this._classAdd(flyout, 'flyout--fixed');
            this._bodyClassSet();
        } else {
            this._classRemove(flyout, 'flyout--fixed');
            this._bodyClassUnset();
        }
    }

    _resizeEventAdd() {
        if (!this.props.options.mobile) return false;
        setTimeout(() => {
            // console.info('flyout - _resizeEventAdd');
            window.addEventListener('resize', this._sizeHandler);
        }, 0);
    }

    _resizeEventRemove() {
        if (!this.props.options.mobile) return false;
        // console.info('flyout - _resizeEventRemove');
        window.removeEventListener('resize', this._sizeHandler);
    }

    _triggerClassSet() {
        // console.info('flyout - _triggerClassSet');
        this._classAdd(this._getTrigger(), this.classes.trigger);
    }

    _triggerClassUnset() {
        // console.info('flyout - _triggetClassUnset');
        this._classRemove(this._getTrigger(), this.classes.trigger);
    }

    _bodyClassSet() {
        // console.info('flyout - _bodyClassSet');
        this._classAdd(this.body, this.classes.body);
    }

    _bodyClassUnset() {
        // console.info('flyout - _bodyClassUnset');
        this._classRemove(this.body, this.classes.body);
    }

    _scrollPositionSave() {
        // console.info('flyout - _saveScrollPosition');
        // triggers active class must be use since the open event of the new flyouts
        // runs before the close event of the previous flyout
        if (document.querySelectorAll('.'+ this.classes.trigger).length) {
            this.body.setAttribute('data-flyoutBodyScrollPosition', window.pageYOffset);
        }
    }
    
    _scrollPositionLoad() {
        // console.info('flyout - _loadScrollPosition');
        if (this.body.classList && !this.body.classList.contains('has-flyout--fixed')) return false;
        setTimeout(() => {
            window.scrollTo(window.pageYOffset, this.body.getAttribute('data-flyoutbodyscrollposition'));
        }, 0);
    }

    _getAlignment() {
        // console.info('flyout - _getAlignment');
        let alignment = this.props.options.align.split(' ');
        return [alignment[0], alignment[1]];
    }

    _getMaxHeightOffset(position) {
        // console.info('flyout - _getMaxHeightOffset:', position);
        return (position === 'top') ? 60 : 25;
    }

    _getTrigger() {
        // console.info('flyout - _getTrigger);
        let triggers = document.querySelectorAll('[data-flyout-id]');
        let triggersLength = triggers.length;

        for (let i = 0; i < triggersLength; i++) {
            if (triggers[i].getAttribute('data-flyout-id') === this.props.id) {
                return triggers[i];
            }
        }

        return null;
    }

    _getMediaQueries() {
        // console.info('flyout - _getMediaQueries');
        let mediaQueries = {};
        const mqs = this.props.mediaQueries;

        mediaQueries.breakpointSmall = mqs && mqs.breakpointSmall ? mqs.breakpointSmall : 640;
        mediaQueries.breakpointMedium = mqs && mqs.breakpointMedium ? mqs.breakpointMedium : 1024;
        mediaQueries.breakpointLarge = mqs && mqs.breakpointLarge ? mqs.breakpointLarge : 1920;
        mediaQueries.mediumUp = mqs && mqs.mediumUp ? mqs.mediumUp : 641;
        mediaQueries.largeUp = mqs && mqs.largeUp ? mqs.largeUp : 1025;

        return mediaQueries;
    }

    _getOffset(el) {
        // console.info('flyout - _getOffset');
        var rect = el.getBoundingClientRect();

        return {
            top: rect.top,
            left: rect.left
        };
    }

    _classAdd(el, elClass) {
        // console.info('flyout - _classAdd');
        el.classList.add(elClass);
    }

    _classRemove(el, elClass) {
        // console.info('flyout - _classRemove');
        el.classList.remove(elClass);
    }
};

export default Flyout;
