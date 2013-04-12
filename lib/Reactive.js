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
         * Do the actual matching
         *
         * @method doMatch
         * @private
         */
            doMatch = function () {
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
            },

        /**
         * Start the  reactive computation.
         *
         * @method startComputation
         * @private
         */
            startComputation = function () {
                Deps.nonreactive(function () {
                    computation = Deps.autorun(doMatch);
                });
            },

        /**
         * The computation of the currentRouteMatch
         *
         * @property computation
         * @private
         * @type {Deps.Computation}
         */
            computation;

        /**
         * Get the underlying router of this reactive router
         *
         * @method getRouter
         * @returns {InnoAccel.Router.Regex}
         */
        self.getRouter = function () {
            return router;
        };

        /**
         * Add a router to the underlying router
         *
         * @method addRoute
         * @param {InnoAccel.Router.Regex} route
         */
        self.addRoute = function (route) {
            router.addRoute(route);
            if (undefined !== computation) {
                computation.invalidate();
            }
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
            if (undefined === computation) {
                startComputation();
            }
            return currentRouteMatch;
        };

        /**
         * Trigger a recalculation of the matching
         *
         * @method rematch
         */
        self.invalidate = function () {
            if (undefined === computation) {
                startComputation();
                return;
            }
            computation.invalidate();
        };

        /**
         * Stop this router from recalculating
         *
         * @method stop
         */
        self.stop = function () {
            if (undefined == computation) {
                return;
            }
            computation.stop();
        };
    };
}(InnoAccel.Router, Deps));
