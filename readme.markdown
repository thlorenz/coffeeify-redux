# coffeeify-redux

browserify v2 plugin for coffee-script-redux

mix and match `.coffee` and `.js` files in the same project

if you prefer the original coffee-script compiler, please use the [original coffeeify](https://github.com/substack/coffeeify)

[![build status](https://secure.travis-ci.org/thlorenz/coffeeify-redux.png)](http://travis-ci.org/substack/coffeeify)

# example

given some files written in a mix of `js` and `coffee`:

foo.coffee:

``` coffee
console.log(require './bar.js')
```

bar.js:

``` js
module.exports = require('./baz.coffee')(5)
```

baz.coffee:

``` js
module.exports = (n) -> n * 111
```

install coffeeify into your app:

```
$ npm install coffeeify
```

when you compile your app, just pass `-t coffeeify` to browserify:

```
$ browserify -t coffeeify foo.coffee > bundle.js
$ node bundle.js
555
```

# install

With [npm](https://npmjs.org) do:

```
npm install coffeeify
```

# license

MIT
