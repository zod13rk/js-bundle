let F = require('fs');
let P = require('path');
const { count } = require('console');

const moduler1 = `const __req = function (path) {
		const mem = {};
		const modules = {\n`
const moduler2 = `};\nreturn mem[path] || (mem[path] = modules[path]());\n}\n`;
const f1 = `function (){\nconst __exp={};\n`;
const f2 = `\nreturn __exp;\n}`;
const regex_require = /require\(.(.*).\)/g;
const regex_exports = /exports/g;
const regex_dir = /[^\.](\.)(?!\.)/;

function bundle(entryFile, outFile = "bundle.js", done) {
	setModule(entryFile, modules => {
		let result = moduler1 + Object.keys(modules).map(k => `"${k}":${modules[k]}`).join(',')
			+ moduler2 + `\nconst ${P.basename(outFile, '.js')} = module.exports=__req("${entryFile}")`;
		F.writeFile(outFile, result, ()=>done());
	})
}
function setModule(path, done, mem = {}, counter={val:1}) {
	const dir = P.dirname(path);
	F.readFile(path, (er, buf) => {
		if (er) throw er;
		mem[path] = f1 + buf.toString().replace(regex_require, (m, g) => {
			let p = resPath(dir, g);
			if(mem[p] === undefined){
				counter.val++;
				mem[p] = true;
				setModule(p, done, mem, counter);
			} 
			return `__req(\`${p}\`)`;
		}).replace(regex_exports, '__exp') + f2;
		counter.val--;
		counter.val === 0 && done(mem);
	});
}
exports.bundle = bundle;
function resPath(dir, f) {
	let path = P.resolve(dir, f);
	P.extname(path) === '' && (path += '.js');
	return path;
}