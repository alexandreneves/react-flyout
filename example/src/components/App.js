import React from 'react';

import {connect} from 'react-redux';
import {flyoutToggle, flyoutOptions} from '../actions';

import Flyout from '../containers/Flyout';

require("../../css/stylesheet.css");

let App = ({dispatch}) => {
    const flyoutOptions1 = {
        type: 'dropdown',
        dropdownIconsLeft: true,
        dropdownIconsRight: true
    };

    const flyoutOptions2 = {
        theme: 'dark'
    };

    const flyoutOptions3 = {
        type: 'tooltip'
    };

    const flyoutOps = function(opts, e) {
        e.stopPropagation();
        dispatch(flyoutOptions(opts));
    };

    return (
        <div>
            <div className="examples">
                <h3>Examples</h3>
                <div className="has-flyout">
                    <button type="button" className="button-primary" data-flyout-id="flyout-foobar1" onClick={e => {dispatch(flyoutToggle('flyout-foobar1'))}}>with list</button>
                    <Flyout id="flyout-foobar1" options={flyoutOptions1}>
                        <ul>
                            <li><a href="#"><i className="fa fa-rocket" />Most recent</a></li>
                            <li><a href="#"><i className="fa fa-bullseye" />Most relevant<i className="fa fa-check" /></a></li>
                            <li><a href="#"><i className="fa fa-sort-alpha-asc" />Alphabetically</a></li>
                            <li><a href="#"><i className="fa fa-sort-alpha-desc" />Alphabetically</a></li>
                        </ul>
                    </Flyout>
                </div>
                <div className="has-flyout">
                    <button type="button" className="button-primary" data-flyout-id="flyout-foobar2" onClick={e => {dispatch(flyoutToggle('flyout-foobar2'))}}>with text & button</button>
                    <Flyout id="flyout-foobar2" options={flyoutOptions2}>
                        <p>Lorizzle ipsizzle dolizzle sit fo shizzle, fo shizzle mah nizzle fo rizzle...</p>
                        <button type="button" className="button-primary">Shizzle!</button>
                    </Flyout>
                </div>
                <div className="has-flyout">
                    <button type="button" className="button-primary" data-flyout-id="flyout-foobar3"
                        onMouseOver={e => {dispatch(flyoutToggle('flyout-foobar3'))}}
                        onMouseLeave={e => {dispatch(flyoutToggle('flyout-foobar3'))}}
                        >tooltip</button>
                    <Flyout id="flyout-foobar3" options={flyoutOptions3}>
                        <p>Lorizzle you son of a bizzle dolizzle pimpin' crunk, pot away yippiyo. Nullizzle fo shizzle!</p>
                    </Flyout>
                </div>
            </div>
            <div>
                <h3>Alignment and Theme</h3>
                <p>Open a Flyout and change these configs to see it in action.<br />For the <b>tooltip example</b> change the configs first then hover the button.</p>

                <div className="alignto">
                    <div>
                        <div></div>
                        <div className="alignto__clickable alignto__clickable--topleft" onClick={flyoutOps.bind(this, {align: 'top left'})}><i className="fa fa-arrow-up" /></div>
                        <div className="alignto__clickable alignto__clickable--topright" onClick={flyoutOps.bind(this, {align: 'top right'})}><i className="fa fa-arrow-up" /></div>
                        <div></div>
                    </div>
                    <div>
                        <div className="alignto__clickable alignto__clickable--lefttop" onClick={flyoutOps.bind(this, {align: 'left top'})}><i className="fa fa-arrow-left" /></div>
                        <div></div>
                        <div></div>
                        <div className="alignto__clickable alignto__clickable--righttop" onClick={flyoutOps.bind(this, {align: 'right top'})}><i className="fa fa-arrow-right" /></div>
                    </div>
                    <div>
                        <div className="alignto__clickable alignto__clickable--leftbottom" onClick={flyoutOps.bind(this, {align: 'left bottom'})}><i className="fa fa-arrow-left" /></div>
                        <div></div>
                        <div></div>
                        <div className="alignto__clickable alignto__clickable--rightbottom" onClick={flyoutOps.bind(this, {align: 'right bottom'})}><i className="fa fa-arrow-right" /></div>
                    </div>
                    <div>
                        <div></div>
                        <div className="alignto__clickable alignto__clickable--bottomleft" onClick={flyoutOps.bind(this, {align: 'bottom left'})}><i className="fa fa-arrow-down" /></div>
                        <div className="alignto__clickable alignto__clickable--bottomright" onClick={flyoutOps.bind(this, {align: 'bottom right'})}><i className="fa fa-arrow-down" /></div>
                        <div></div>
                    </div>
                </div>
                <div>
                    <button type="button" onClick={flyoutOps.bind(this, {theme: 'dark'})}>theme: dark</button>
                    <button type="button" onClick={flyoutOps.bind(this, {theme: 'light'})}>theme: light</button>
                </div>
            </div>
        </div>
    );
};

App = connect()(App);

export default App;
