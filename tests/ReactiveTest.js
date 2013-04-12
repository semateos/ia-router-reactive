(function (Tinytest, Deps, Reactive) {
    "use strict";

    function createReactiveSource(initialValue) {
        var source = initialValue,
            dependencies = new Deps.Dependency();

        return {
            get: function () {
                dependencies.depend();
                return source;
            },
            set: function (value) {
                source = value;
                dependencies.changed();
            }
        };
    }

    Tinytest.add('ia-router-reactive - match initial source', function (test) {
        var routerMock = {
                doesMatch: function () {
                    return true;
                },
                match: function () {
                    return {matched: true};
                }
            },
            reactive = new Reactive(routerMock, createReactiveSource().get);
        test.equal(reactive.match(), {matched: true});
    });

    Tinytest.add('ia-router-reactive - match is reactive', function (test) {
        var source = createReactiveSource(),
            routerMock = {
                doesMatch: function (source) {
                    return ('url2' === source);
                },
                match: function (source) {
                    return {matched: ('url2' === source)};
                }
            },
            reactive = new Reactive(routerMock, source.get),
            reCalculated = false;
        Deps.autorun(function () {
            if (reactive.match() !== undefined) {
                reCalculated = true;
            }
        });

        source.set('url2');
        Meteor.flush();
        test.isTrue(reCalculated);
    });

    Tinytest.add('ia-router-reactive - match undefined if no matching route', function (test) {
        var source = createReactiveSource(),
            routerMock = {
                doesMatch: function (source) {
                    return false;
                },
                match: function (source) {
                    return;
                }
            },
            reactive = new Reactive(routerMock, source.get);
        test.equal(reactive.match(), undefined);
    });

    Tinytest.add('ia-router-reactive - not reactive after calling stop', function (test) {
        var source = createReactiveSource(),
            calls = 0,
            routerMock = {
                doesMatch: function (source) {
                    return true;
                },
                match: function (source) {
                    calls++;
                    return;
                }
            },
            reactive = new Reactive(routerMock, source.get);

        reactive.stop();
        source.set('new');
        Meteor.flush();
        test.equal(calls, 1);
    });

    Tinytest.add('ia-router-reactive - invalidate triggers re-computation', function (test) {
        var source = createReactiveSource(),
            calls = 0,
            routerMock = {
                doesMatch: function (source) {
                    return true;
                },
                match: function (source) {
                    calls++;
                    return;
                }
            },
            reactive = new Reactive(routerMock, source.get);

        reactive.invalidate();
        Meteor.flush();
        test.equal(calls, 2);
    });

    Tinytest.add('ia-router-reactive - getRouter returns router of construction', function (test) {
        var routerMock = {
                doesMatch: function (source) {},
                match: function (source) {}
            },
            source = createReactiveSource(),
            reactive = new Reactive(routerMock, source.get);

        test.equal(reactive.getRouter(), routerMock);
    });

    Tinytest.add('ia-router-reactive - add route delegates to construction router', function (test) {
        var routeMock = {
                doesMatch: function (source) {},
                match: function (source) {}
            },
            routerListMock = {
                addRoute: function (route) { test.equal(route, routeMock) },
                doesMatch: function (source) {},
                match: function (source) {}
            },
            source = createReactiveSource(),
            reactive = new Reactive(routerListMock, source.get);

        reactive.addRoute(routeMock);
    });

    Tinytest.add('ia-router-reactive -- addRoute triggers re-computation', function (test) {
        var source = createReactiveSource(),
            calls = 0,
            routerMock = {
                doesMatch: function (source) {
                    return true;
                },
                match: function (source) {
                    calls++;
                    return;
                }
            },
            reactive = new Reactive({
                doesMatch: function (source) {
                    return true;
                },
                match: function (source) {
                    calls++;
                    return;
                }
            }, source.get);

        reactive.addRoute(routerMock);
        Meteor.flush();
        test.equal(calls, 2);
    });
} (Tinytest, Deps, InnoAccel.Router.Reactive));
