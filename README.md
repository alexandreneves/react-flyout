# REACT FLYOUT

React Component to integrate Flyouts into your project.

+ easy to use
+ pragmatic and predictable behaviours
+ pre-defined styles for menu and dropdowns
+ pre-defined light (default) and dark themes
+ pre-defined styles for beautiful dropdown lists
+ customizable



## TABLE OF CONTENTS

+ [installation](#installation)
+ [how it works](#how-it-works)
+ [usage](#usage)
+ [customization](#customization)
+ [example](#example)



## INSTALLATION

```sh
$ npm install react-flyout
```



## HOW IT WORKS

react-flyout is composed by 3 files
+ **Core**
    + stateless component of the flyout itself
    + handles everything related to how the flyout looks and behaves when opened
+ **Wrapper**
    + handles state
    + exposes the open/close methods
+ **Styles**
    + well... you know... styles.



## USAGE

Import/Extend the FlyoutWrapper to access the open/close methods. **I recommend extending it by creating your own Flyout component** unless all of your Flyouts and respective triggers are contained in the same components in which case importing the FlyoutWrapper and calling the available methods when needed will suffice. If you happen to need to render a Flyout and its respective trigger from different components you'll be better served creating your own Flyout component and extending it with the FlyoutWrapper. In this component you'll then listen to the dispached events to open or close the Flyout.

```javascript
import FlyoutWrapper from '';
class Flyout extends FlyoutWrapper {
    // use this.open to open the flyout
    // use this.close to close the flyout
    // deal with these your using your own event system :)
}
```

See the [example](#example) section for a use case.



## CUSTOMIZATION

#### Props

You can pass various options as an object in the Flyout props `<Flyout options={{}}>`

+ **align**: (string)
    *   `bottom left`: the Flyout will be aligned to the bottom of the trigger and will grow from right (of the trigger) to the left
    *   `right bottom`: the Flyout will be aligned to the right of the trigger and will grow from top (of the trigger) to bottom
    *   ...
+ **type**: (string) `dropdown` (default) / `menu`
+ **theme**: (string) `light` (default) / `dark`
+ **fixed**: (bool) set as `true` if the Flyout is contained withing a fixed element
+ **mobile**: (bool) when `true` the Flyout will open full width/height bellow the medium media query
+ **dropdownIconsLeft**: set as `true` if `type: dropdown` to style (left) icons on dropdown lists
+ **dropdownIconsRight**: set as `true` if `type: dropdown` to style (right) icons on dropdown lists

#### Media Queries

Media Queries are only customizable if you use the extend FlyoutWrapper method. You'll then need to set a `this.mediaQueries` object on your Flyout Component.

```javascript
this.mediaQueries = {
    breakpointSmall: 640,
    breakpointMedium: 1024,
    breakpointLarge: 1920,
    mediumUp: 641,
    largeUp: 1025
};
```

Media Queries follow Foundation conventions and currently only the mediumUp value is used (when `option.mobile = true`).

#### Styles

Styles are available as SCSS and use the BEM naming convention. Everything was kept simple and basic except the `type: dropdown` which as pre-defined styles for (menu) lists.

Customization can be made by creating your own file:

```css
// override default variables

$f_z_index_flyout: (...);
$f_z_index_flyout--dropdown: (...);

$f_font_size_big: (...);
$f_font_size_small: (...);

$f_color_light: (...);
$f_color_dark: (...);
$f_color_border: (...);

$f_border_radius: (...);

// import original styles

@import "react-flyout/flyout";

// define your styles

(...)
```




## EXAMPLE

Bellow you'll find a use case on a React+[Alt](https://github.com/goatslacker/alt) project.

#### Flyout Component

Extends FlyoutWrapper and uses [Alt's ActionListeners](https://github.com/altjs/utils/blob/master/src/ActionListeners.js) to listen to the open/close events without the need of a store.

```javascript
'use strict';

import React from '';
import ActionListeners from '';
import {Constants} from '';

import FlyoutWrapper from '';

class Flyout extends FlyoutWrapper {
    constructor(props) {
        super();
    }

    // componentWillMount() {
    //     // CUSTOM MEDIA QUERIES
    //     this.mediaQueries = {
    //         breakpointSmall: 1,
    //         breakpointMedium: 2,
    //         breakpointLarge: 3,
    //         mediumUp: 4,
    //         largeUp: 5
    //     };
    // }

    componentWillUnmount() {
        // REMOVE LISTENERS
        let listeners = new ActionListeners(this.context.flux);
        listeners.removeActionListener(this.listenToOpen);
        listeners.removeActionListener(this.listenToClose);
    }

    componentDidMount() {
        // ADD LISTENERS

        let actions = this.context.flux.getActions(Constants.actions.flyout);
        let listeners = new ActionListeners(this.context.flux);

        this.listenToOpen = listeners.addActionListener(actions.OPEN_FLYOUT, (obj) => {
            if (this.props.id !== obj.id) {
                if (this.state.open) {
                    // console.info('flyout - listened to open for another flyout, closing:', obj.id);
                    this.close();
                }
            } else {
                if (!this.state.open) {
                    // console.info('flyout - listened to open for this flyout, opening:', obj.id);
                    this.open();
                }
            }
        });

        this.listenToClose = listeners.addActionListener(actions.CLOSE_FLYOUT, (obj) => {
            if (this.props.id !== obj.id) return false;
            // console.info('flyout - listened to close', obj.id);
            if (this.state.open) this.close();
        });
    }
};

Flyout.contextTypes = {
    flux: React.PropTypes.object.isRequired
};

export default Flyout;
```

#### Flyout Actions

```javascript
'use strict';

class FlyoutActions {
    constructor() {
        this.generateActions(
            'openFlyout',
            'closeFlyout'
        );
    }
}
export default FlyoutActions;
```

#### Flyout Mixin

Mixin to import in the component that contains the Flyout trigger. Contains methods to make the action calls that will dispatch the open/close events which will be caught by the Flyout component above.

```javascript
'use strict';

import React from '';
import {Constants} from '';

export const FlyoutsMixin = {
    contextTypes: {
        flux: React.PropTypes.object.isRequired
    },

    flyoutOpen(id) {
        let obj = {};
        obj.id = id;

        this.context.flux.getActions(Constants.actions.flyout).openFlyout(obj);
    },

    flyoutClose(id) {
        let obj = {};
        obj.id = id;

        this.context.flux.getActions(Constants.actions.flyout).closeFlyout(obj);
    }
};
```

#### Render (dropdown)

In this example you can see a dropdown Flyout.
Take a closer look at the first `<li>` with both left and right icons.

```javascript
import Flyout from '';
import {FlyoutsMixin} from '';

(...)

render() {
    return (
        <div className="has-flyout">
            <button data-flyout-id="flyout-foobar" onClick={this.flyoutOpen.bind(this, 'flyout-foobar')}>TOGGLE</button>
            <Flyout id="flyout-foobar" options={{align: 'bottom left', type: 'dropdown', dropdownIconsLeft: true, dropdownIconsRight: true}}>
                <ul>
                    <li>
                        <a href="#">
                            <i class="fa fa-sort-alpha-asc"></i>
                            Order By 0
                            <i class="fa fa-check check"></i>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i class="fa fa-sort-alpha-desc"></i>
                            Order By 1
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i class="fa fa-clock-o"></i>
                            Order By 2
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i class="fa fa-clock-o"></i>
                            Order By 3
                        </a>
                    </li>
                </ul>
            </Flyout>
        </div>
    );
}
```

#### Render (topbar menu)

This example showcases a hamburguer menu that opens a Flyout when clicked.
If the topbar that contains the hamburguer is fixed `options.fixed = true` is necessary.


```javascript
import Flyout from '';
import {FlyoutsMixin} from '';

(...)

render() {
    return (
        <div className="has-flyout">
            <i className="fa fa-bars" data-flyout-id="flyout-foobar" onClick={this.flyoutOpen.bind(this, 'flyout-foobar')}></i>
            <Flyout id="flyout-foobar" options={{align: 'bottom right', mobile: true, theme: 'dark', fixed: true}}>
                content
            </Flyout>
        </div>
    );
}
```
