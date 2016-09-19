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
        this._resizeEventAdd();
        this._triggerClassSet();
        this._scrollPositionSave();
        this._setMaxHeight();
        this._setAlignment();
        this._sizeHandler();
        this._mutationObserve();
    }

    componentDidUpdate() {
        // console.info('flyout - componentDidUpdate');
        this._setAlignment();
    }

    componentWillUnmount() {
        // console.info('flyout - componentWillUnmount');
        this._resizeEventRemove();
        this._triggerClassUnset();
        this._bodyClassUnset();
        this._scrollPositionLoad();
        this._mutationDisconnect();
    }

    render() {
        // console.info('flyout - render');
        const classes = this._getClasses();
        const arrow = this.props.options.type === 'tooltip' ? <span className="flyout__arrow" /> : null;

        return (
            <div id={this.props.id} className={classes}>
                <div className="flyout__wrapper">
                    {this.props.children}
                </div>
                {arrow}
            </div>
        );
    }

    _setAlignment(alignment) {
        // console.info('flyout - _setAlignment');

        const dom = ReactDOM.findDOMNode(this);
        const parent = dom.parentNode;
        const flyout = document.querySelector('#'+ this.props.id);
        const margin = this._getMargin();
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
        } else if (alignment[1] === 'middle') {
            if (['top', 'bottom'].indexOf(alignment[0]) +1) {
                dom.style.right = - (flyout.offsetWidth/2 - parent.offsetWidth/2) + 'px';
            } else {
                dom.style.top = - (flyout.offsetHeight/2 - parent.offsetHeight/2) + 'px';
            }
        }

        // arrow
        if (this.props.options.type === 'tooltip') {
            const arrow = document.querySelector(`#${this.props.id} .flyout__arrow`);
            const arrowBorderWidth = parseInt(window.getComputedStyle(arrow, null).getPropertyValue('border-top-width'));
            let arrowAlignment;

            arrow.style.top = 'auto';
            arrow.style.right = 'auto';
            arrow.style.bottom = 'auto';
            arrow.style.left = 'auto';

            if (alignment[1] === 'middle' && alignment[0] === 'top') arrowAlignment = {top: '100%', left: flyout.offsetWidth/2 - arrowBorderWidth + 'px'}
            if (alignment[1] === 'middle' && alignment[0] === 'bottom') arrowAlignment = {bottom: '100%', left: flyout.offsetWidth/2 - arrowBorderWidth + 'px'}
            if (alignment[1] === 'middle' && alignment[0] === 'right') arrowAlignment = {right: '100%', top: flyout.offsetHeight/2 - arrowBorderWidth + 'px'}
            if (alignment[1] === 'middle' && alignment[0] === 'left') arrowAlignment = {left: '100%', top: flyout.offsetHeight/2 - arrowBorderWidth + 'px'}

            const arrowAlignmentTB = parent.offsetWidth / 2 - arrowBorderWidth + 'px'
            if (alignment[0] === 'top' && alignment[1] === 'right') arrowAlignment = {top: '100%', left: arrowAlignmentTB}
            if (alignment[0] === 'top' && alignment[1] === 'left') arrowAlignment = {top: '100%', right: arrowAlignmentTB}
            if (alignment[0] === 'bottom' && alignment[1] === 'right') arrowAlignment = {bottom: '100%', left: arrowAlignmentTB}
            if (alignment[0] === 'bottom' && alignment[1] === 'left') arrowAlignment = {bottom: '100%', right: arrowAlignmentTB}

            const arrowAlignmentRL = parent.offsetHeight / 2 - arrowBorderWidth + 'px';
            if (alignment[0] === 'right' && alignment[1] === 'top') arrowAlignment = {right: '100%', bottom: arrowAlignmentRL}
            if (alignment[0] === 'right' && alignment[1] === 'bottom') arrowAlignment = {right: '100%', top: arrowAlignmentRL}
            if (alignment[0] === 'left' && alignment[1] === 'top') arrowAlignment = {left: '100%', bottom: arrowAlignmentRL}
            if (alignment[0] === 'left' && alignment[1] === 'bottom') arrowAlignment = {left: '100%', top: arrowAlignmentRL}

            for (let k in arrowAlignment) {
                arrow.style[k] = arrowAlignment[k];
            }
        }

        // VERIFY IF FIXED PARENT
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

        const windowHeight = window.innerHeight;

        const trigger = this._getTrigger();
        const triggerHeight = parseInt(trigger.offsetHeight);
        const triggerOffsetTop = parseInt(this._getOffset(trigger)['top']);

        const flyout = document.querySelector('#'+ this.props.id);
        const flyoutContent = document.querySelector('#'+ this.props.id + '> div'); // todo: fix me
        const flyoutHeight = parseInt(flyout.offsetHeight);
        const flyoutOffsetTop = parseInt(this._getOffset(flyout)['top']);
        const flyoutMinHeight = parseInt(flyout.style.minHeight) | 0;
        const flyoutMaxHeight = parseInt(flyout.style.maxHeight) | 0;

        const alignment = this._getAlignment();

        const moreSpaceAbove = (triggerOffsetTop + (triggerHeight / 2) > (windowHeight / 2));
        const getMaxHeightOffsetPosition = moreSpaceAbove ? 'top' : 'bottom';

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
                if (alignment[0] === 'bottom' || alignment[1] === 'bottom') flyout.classList.add('flyout--forced-top');
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
                if (alignment[0] === 'top' || alignment[1] === 'top') flyout.classList.add('flyout--forced-bottom');
            }
        }
    }

    _setMaxHeight() {
        // console.info('flyout - _setMaxHeight');
        const windowHeight = window.innerHeight;
        const flyoutContent = document.querySelector('#'+ this.props.id +' > div');
        const maxHeight = parseInt(windowHeight / 1.20);

        flyoutContent.style.maxHeight = maxHeight;
    }

    _mutationObserve() {
        // console.info('flyout - _mutationObserve');
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        const flyout = document.querySelector('#'+ this.props.id);

        this.mutation = new MutationObserver((mutations) => {
            this._mutationObserved();
        });

        this.mutation.observe(flyout, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
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

        const flyout = document.querySelector('#'+ this.props.id);
        const width = window.innerWidth;

        if (window.innerWidth < this.mediaQueries.mediumUp) {
            flyout.classList.add('flyout--fixed');
            this._bodyClassSet();
        } else {
            flyout.classList.remove('flyout--fixed');
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
        this._getTrigger().classList.add(this.classes.trigger);
    }

    _triggerClassUnset() {
        // console.info('flyout - _triggetClassUnset');
        this._getTrigger().classList.remove(this.classes.trigger);
    }

    _bodyClassSet() {
        // console.info('flyout - _bodyClassSet');
        this.body.classList.add(this.classes.body);
    }

    _bodyClassUnset() {
        // console.info('flyout - _bodyClassUnset');
        this.body.classList.remove(this.classes.body);
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
        const defaults = this.props.options.type === 'tooltip' ? 'top middle' : 'bottom right';
        const sep = ' ';
        let alignment = this.props.options.align;

        if (typeof alignment === 'undefined') {
            return defaults.split(sep);
        } else {
            alignment = this.props.options.align.split(sep);
            return alignment.length === 2 ? alignment : defaults.split(sep);
        }
    }

    _getMargin() {
        const def = 1;
        const type = this.props.options.type;
        const margins = {
            tooltip: 6,
            menu: 0
        }
        return typeof margins[type] !== 'undefined' ? margins[type] : def;
    }

    _getMaxHeightOffset(position) {
        // console.info('flyout - _getMaxHeightOffset:', position);
        return (position === 'top') ? 60 : 25;
    }

    _getTrigger() {
        // console.info('flyout - _getTrigger);
        const triggers = document.querySelectorAll('[data-flyout-id]');
        const triggersLength = triggers.length;

        for (let i = 0; i < triggersLength; i++) {
            if (triggers[i].getAttribute('data-flyout-id') === this.props.id) {
                return triggers[i];
            }
        }

        return null;
    }

    _getMediaQueries() {
        // console.info('flyout - _getMediaQueries');
        const mqs = this.props.mediaQueries;
        let mediaQueries = {};

        mediaQueries.breakpointSmall = mqs && mqs.breakpointSmall ? mqs.breakpointSmall : 640;
        mediaQueries.breakpointMedium = mqs && mqs.breakpointMedium ? mqs.breakpointMedium : 1024;
        mediaQueries.breakpointLarge = mqs && mqs.breakpointLarge ? mqs.breakpointLarge : 1920;
        mediaQueries.mediumUp = mqs && mqs.mediumUp ? mqs.mediumUp : 641;
        mediaQueries.largeUp = mqs && mqs.largeUp ? mqs.largeUp : 1025;

        return mediaQueries;
    }

    _getOffset(el) {
        // console.info('flyout - _getOffset');
        const rect = el.getBoundingClientRect();

        return {
            top: rect.top,
            left: rect.left
        };
    }

    _getClasses() {
        const classes = [];

        classes.push(this.props.id);
        classes.push('flyout');
        classes.push(this.props.options.type ? 'flyout--'+ this.props.options.type : 'flyout--dropdown');
        classes.push('flyout--'+ this._getAlignment().join('-'));

        if (this.props.options.dropdownIconsLeft) classes.push('flyout--dropdown-has-icons-left');
        if (this.props.options.dropdownIconsRight) classes.push('flyout--dropdown-has-icons-right');
        if (this.props.options.type !== 'tooltip') classes.push(this.props.options.theme ? 'flyout--'+ this.props.options.theme : 'flyout--light');

        return classes.join(' ');
    }
};

export default Flyout;
