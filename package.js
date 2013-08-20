Package.describe({
    summary: 'Reactive client-side router adapter for ia-router-core'
});

Package.on_use(function (api, where) {
    api.use(['ia', 'ia-router-core', 'deps'], 'client');

    api.add_files('lib/Reactive.js', 'client');
});

Package.on_test(function (api) {
    api.use(['ia-router-reactive', 'deps', 'tinytest']);

    api.add_files('tests/ReactiveTest.js', 'client');
});
