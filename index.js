'use strict';
var CoffeeScript =  require('coffee-script-redux');
var through      =  require('through');
var convert      =  require('convert-source-map');

function toProperSourcemap(sourcemap, file) {
    // funny that toJSON actually returns an Object ;)
    var obj = sourcemap.toJSON();
    // also 'file' is not a version 3 property, but source is
    obj.source = file;
    delete obj.file;
    return obj;
}

function compile(file, data) {
    var parsed = CoffeeScript.parse(data, {
        optimise: false
      , raw: true 
      , inputSource: file
    });

    var ast = CoffeeScript.compile(parsed)
      , sourcemap = CoffeeScript.sourceMap(ast, file, { compact: false })
      , js = CoffeeScript.js(ast);

    var comment = convert
        .fromObject(toProperSourcemap(sourcemap, file))
        .setProperty('sourcesContent', [ data ])
        .toComment();

    return js + '\n' + comment;
}

module.exports = function (file) {
    if (!/\.coffee$/.test(file)) return through();
    
    var data = '';
    return through(write, end);
    
    function write (buf) { data += buf; }
    function end () {
        this.queue(compile(file, data));
        this.queue(null);
    }
};
