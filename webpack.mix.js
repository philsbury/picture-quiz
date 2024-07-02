const mix = require('laravel-mix');
const tailwindcss = require('tailwindcss');
require('laravel-mix-handlebars');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

mix
    .js('./src/js/main.js', './docroot/dist')
    .sass('./src/scss/main.scss', './docroot/dist')
    .copyDirectory('./src/img', './docroot/dist/img')
    .copyDirectory('./src/data', './docroot/dist/data')
    .handlebars('./src/pages', './docroot')
    .options({
        processCssUrls: false,
        postCss: [
            tailwindcss('./tailwind.config.js'),
            // require('postcss-discard-comments')({
            //     removeAll: true
            // })
        ],
    });

mix.webpackConfig(() => {
    return {
        plugins: [
            new BrowserSyncPlugin({
                host: 'localhost',
                port: 3008,
                watch: true,
                server: { baseDir: ['docroot'], directory: true },
                browser: "google chrome",
            })
        ]
    };
});

if (!mix.inProduction()) {
    mix.sourceMaps(true, 'source-map');
} else {
    mix.options({
        terser: {
            terserOptions: {
                compress: {
                    drop_console: true,
                }
            }
        }
    });
}