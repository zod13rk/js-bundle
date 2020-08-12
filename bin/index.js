#!/usr/bin/env node

const {bundle} = require('../src/bundle');

let entry = process.argv[2];
let output = process.argv[3];

console.log('bundling...');
bundle(entry, output, ()=> {
    console.log('...finished');
});