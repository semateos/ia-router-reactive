(function (Router, Deps) {
    "use strict";

    /**
     * Container to make a router reactive to a given reactive input (e.g. the url)
     *
     * @class Reactive
     * @namespace Router
     * @param {Object} router The router to make reactive
     * @param {Function} input The reactive input source
     * @constructor
     */
    Router.Reactive = function (router, input) {
        /**
         * this-pointer
         *
         * @property self
         * @private
         * @type {Router.Reactive}
         */
        var self = this,

        /**
         * The current RouteMatch object
         *
         * @property currentRouteMatch
         * @private
         * @type {Router.RouteMatch}
         */
            currentRouteMatch,

        /**
         * Dependency tracker for the current route match
         *
         * @property currentRouteMatchDependencies
         * @private
         * @type {Deps.Dependency}
         */
            currentRouteMatchDependencies = new Deps.Dependency(),

        /**
         * The computation of the currentRouteMatch
         *
         * @property computation
         * @private
         * @type {Deps.Computation}
         */
            computation = Deps.autorun(function () {
                var target = input(),
                    match;
                if (router.doesMatch(target)) {
                    match = router.match(target);
                    if (match !== currentRouteMatch) {
                        currentRouteMatch = match;
                        currentRouteMatchDependencies.changed();
                    }
                } else {
                    currentRouteMatch = undefined;
                    currentRouteMatchDependencies.changed();
                }
            });

        self.getRouter = function () {
            return router;
        };

        self.addRoute = function (route) {
            router.addRoute(route);
            computation.invalidate();
        };

        /**
         * Get the current route match or undefined if no route is matching
         *
         * This function is reactive.
         *
         * @method match
         * @returns {Router.RouteMatch|undefined}
         */
        self.match = function () {
            currentRouteMatchDependencies.depend();
            return currentRouteMatch;
        };

        /**
         * Trigger a recalculation of the matching
         *
         * @method rematch
         */
        self.invalidate = function () {
            computation.invalidate();
        };

        /**
         * Stop this router from recalculating
         *
         * @method stop
         */
        self.stop = function () {
            computation.stop();
        };
    };
}(InnoAccel.Router, Deps));
