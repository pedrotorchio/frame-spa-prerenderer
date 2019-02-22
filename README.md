# Frame Spa Prerenderer

Simple renderer to be used with webpack prerender-spa-plugin, based on Puppeteer Renderer.
The idea is to block every request for new components so it will only prerender the initial frame. Everything in the initial bundles (defined in the acceptExceptions parameter) will be rendered. Whatever you do synchronously, without code splitting or any external requests will be included.

It's in ES6

```
npm i frame-spa-prerenderer --save-dev
```

## Example with VueJs
### vue.config.js

```javascript

const path = require('path')
const PrerenderSPAPlugin = require('prerender-spa-plugin') // PLUGIN
const BlockAllRequestsRenderer = require('frame-spa-prerenderer') // THIS RENDERER CLASS

module.exports = {
    
    chainWebpack: config => {
        config.plugins.delete('preload')
        config
            .plugin('html')
            .tap(args => {
                args[0].minify = true
                return args
        })
    },
    configureWebpack: {
        plugins: [
            new PrerenderSPAPlugin({
                // Required - The path to the webpack-outputted app to prerender.
                staticDir: path.join(__dirname, 'dist'),
                // Required - Routes to render.
                routes: [ '/' ],
                minify: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: false,
                    decodeEntities: true,
                    keepClosingSlash: true,
                    sortAttributes: true
                },
                // DEFINE FILES TO BE INITIALLY INCLUDED (INITIAL BUNDLES)
                // EVERYTHING ELSE WILL BE BLOCKED
                // CAN BE DEFINED BOTH IN REGEX AND PLAIN STRING
                renderer: new BlockAllRequestsRenderer({ 
                    acceptExceptions: [
                        /\/js\/app(.*).js/,
                        /\/js\/chunk-vendors(.*).js/
                    ]
                })
            })
        ]
    }
}
```

