ia-router-reactive
==================
Reactive *client-side only* router version for [ia-router-core](https://github.com/InnoAccel/ia-router-core).

`Take a router and a reactive data source and rematch as soon as the source changes`.

# Usage

```
    InnoAccel.Router.Reactive(router, source);
```
 Where `router` is the non-reactive router of `ia-router-core` and `source` is a reactive source function to match (e.g. [Meteor.Location](https://github.com/tmeasday/meteor-location/)).

# Example
```
    var myRouter = new InnoAccel.Router.Segment(':action');

    var reactiveRouter = new InnoAccel.Router.Reactive(myRouter, Meteor.Location.getPath);
    Deps.autorun(function () {
        console.log(reactiveRouter.match());
    });
```

If no route matches, `match` returns `undefined`.

# API
The source code is fully annotated in yuidoc style.
