'use strict';
var CoffeeScript =  require('coffee-script-redux');
var through      =  require('through');
var convert      =  require('convert-source-map');

function compile(file, data) {
    var parsed = CoffeeScript.parse(data, {
        optimise: false
      , raw: true 
      , inputSource: file
    });

    var ast = CoffeeScript.compile(parsed)
      , sourceMap = CoffeeScript.sourceMap(ast, file, { compact: false })
      , js = CoffeeScript.js(ast);

    // funny that toJSON actually returns an Object ;)
    var obj = sourceMap.toJSON();
    // also 'file' is not a version 3 property, but source is
    obj.source = file;
    delete obj.file;
    var comment = convert
        .fromObject(obj)
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
