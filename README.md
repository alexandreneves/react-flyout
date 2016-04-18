# REACT FLYOUT

Flyout React Component

+ easy to use
+ pragmatic and predictable behaviours
+ pre-defined styles: dropdown (default), tooltip, topbar menu
+ pre-defined themes: light (default) and dark
+ pre-defined styles for beautiful dropdown menu (<ul>)
+ customizable



## TABLE OF CONTENTS

+ [installation](#installation)
+ [example](#example)
+ [how it works](#how-it-works)
+ [usage](#usage)
+ [customization](#customization)



## INSTALLATION

```sh
$ npm i @aneves/react-modal
```



## EXAMPLE

Checkout [github.io/alexandreneves](http://alexandreneves.github.io/) for a Redux example.




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

**FlyoutWrapper** is optional, you can import **Flyout** directly and deal with its renderization by yourself.



## CUSTOMIZATION

#### Props

You can pass various options as an object in the Flyout props `<Flyout options={{}}>`

+ **align**: (string)
    *   `bottom left`: the Flyout will be aligned to the bottom of the trigger and will grow from right (of the trigger) to the left
    *   `right bottom`: the Flyout will be aligned to the right of the trigger and will grow from top (of the trigger) to bottom
    *   ...
+ **type**: (string) `dropdown` (default) / `menu` / `tooltip`
+ **theme**: (string) `light` (default) / `dark`
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

@import "react-flyout/flyout";

// define your styles

(...)
```
