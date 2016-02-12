import React from 'react';
import ReactDOM from 'react-dom';
import FlyoutWrapper from '../../src/FlyoutWrapper';

ReactDOM.render(
    <div className="has-flyout">
        <i className="fa fa-bars" data-flyout-id="flyout-example" onClick={this.open}></i>
        <FlyoutWrapper id="flyout-example" options={{align: 'bottom right', mobile: true, theme: 'dark'}}>
            hello
        </FlyoutWrapper>
    </div>,
    document.getElementById('example')
);
