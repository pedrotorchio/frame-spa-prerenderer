const PrerenderSPAPlugin = require('prerender-spa-plugin')
const PuppeteerRenderer = PrerenderSPAPlugin.PuppeteerRenderer

module.exports = class BlockAllRequestsRenderer extends PuppeteerRenderer {
    constructor(options) {
        super(options)
        this.acceptExceptions = options.acceptExceptions
    }
    urlIsException(url) {
        const isException = this.acceptExceptions.some(exp => (
            (exp instanceof RegExp && exp.test(url)) ||
            (typeof exp == 'string' && exp == url)
        ))

        return isException
    }
    // async renderRoutes (routes, Prerenderer) {
    //     console.log('');
    //     super.renderRoutes(routes, Prerenderer);
    // }
    async handleRequestInterception (page, baseURL) {
        await page.setRequestInterception(true)
        
        page.on('request', req => {
            const clean = str => { 
                str = str.trim()
                
                if (str.substring(str.length - 1) === '/')
                    str = str.substring(0, str.length - 1);
                
                return str;
            }
            const url = clean(req.url()),
                  base = clean(baseURL)
            let outcome = 'ALLOWED'

            if (base === url) {
                
                req.continue()
            } else if (this.urlIsException(url)) {
                
                req.continue()

            } else {
                outcome = 'prevented'
                req.abort()
            }

            console.log(`Intercepting request to ${url} ..... ${outcome}`)
                
        })
    }
}