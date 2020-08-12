const { bundle } = require('../src/bundle');
const F = require('fs');
const P = require('path');
const { assert } = require('console');

F.unlink(P.join(__dirname, './c_bundled.js'), (e) => {
    // if(e) console.log(e);
    bundle(P.join(__dirname,'./c.js'), P.join(__dirname, './c_bundled.js'), () => {
        assert(require('./c_bundled.js').resultA === 7);
        assert(require('./c_bundled.js').resultB === 30);
    });
});