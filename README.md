# REACT FLYOUT

Flyout React Component

+ easy to use
+ pragmatic and predictable behaviours
+ pre-defined types: dropdown, tooltip, topbar menu
+ pre-defined themes: light and dark
+ pre-defined styles for beautiful dropdown menus
+ customizable



## TABLE OF CONTENTS

+ [example](#example)
+ [installation](#installation)
+ [how it works](#how-it-works)
+ [usage](#usage)
+ [customization](#customization)



## EXAMPLE

[Checkout the example](https://alexandreneves.github.io/react-flyout) (Redux).
If requested I can provide an Alt example.



## INSTALLATION

```sh
$ npm i @aneves/react-modal
```



## HOW IT WORKS

react-flyout is composed by 3 files
+ **Flyout**
    + stateless component
    + handles everything related to how the flyout looks and behaves when opened
+ **FlyoutWrapper**
    + stateless component
    + renders the Flyout when prop.open === true
    + executes prop.onWindowClick when a window click event gets fired
+ **flyout.css**
    + well... you know... CSS


### Why not dumb?

The problem with these kind of componentes (dropdowns, modals, ...) is the need to handle window/body clicks in order to close. Why is this a problem? The lack of state (in this case) and the immutability of the props make it "impossible" to close itself.

That's why I provide the **FlyoutWrapper** which adds and removes the window click eventListener when needed and accepts a method through the props that gets executed by the handler. This method can in turn close the flyout by updating the props sent to the wrapper.

Keep in mind that the **FlyoutWrapper** is optional, you can import the **Flyout** directly and deal with its renderization by yourself.



## USAGE

The usage will depend on your projects architecture but will be something along these lines:


```html
<div className="has-flyout">
    <button data-flyout-id="flyout-example"
            onClick={e => {dispatch(flyoutToggle('flyout-example'))}}>FlyoutToggle</button>
    <Flyout id="flyout-example" options={{align: 'top right'}}>
        (...)
    </Flyout>
</div>
```



## CUSTOMIZATION

#### Props

You can pass various options as an object in the Flyout props `<Flyout options={{}}>`

+ **align**: (string)
    *   `bottom right`: (default)
    *   `top right`: (default for tooltips)
    *   example: `bottom right` will align the flyout to the bottom of the trigger and expand from left to right
+ **type**: (string) `dropdown` (default) / `menu` / `tooltip`
+ **theme**: (string) `light` (default) / `dark` (default for tooltips)
+ **fixed**: (bool) set as `true` if the Flyout is contained withing a fixed element
+ **mobile**: (bool) when `true` the Flyout will open full width/height bellow the medium media query
+ **dropdownIconsLeft**: set as `true` if `type: dropdown` to style (left) icons on dropdown lists
+ **dropdownIconsRight**: set as `true` if `type: dropdown` to style (right) icons on dropdown lists

#### Media Queries

Media Queries follow Foundation conventions and currently only the mediumUp value is used (when `option.mobile = true`).
You can however set your own mediaQueries by passing prop.mediaQueries to the **Flyout**.
If you're using the **FlyoutWrapper** set your mediaQueries there to avoid setting the same prop for every Flyout.

```javascript
this.mediaQueries = {
    breakpointSmall: 640,
    breakpointMedium: 1024,
    breakpointLarge: 1920,
    mediumUp: 641,
    largeUp: 1025
};
```

#### Styles

Styles are available as SCSS and use the BEM naming convention.
Customization:

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

@import '~react-flyout/dist/flyout';

// define your styles

(...)
```
