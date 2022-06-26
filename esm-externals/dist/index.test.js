"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const esbuild_1 = require("esbuild");
const test_support_1 = require("test-support");
const _1 = __importStar(require("."));
require('debug').enable(require('../package.json').name);
test('works', () => __awaiter(void 0, void 0, void 0, function* () {
    const { unlink, paths: [ENTRY], } = yield test_support_1.writeFiles({
        'entry.ts': `import {x} from './utils';`,
        'utils.ts': `import mod from 'mod'; export const x = mod('x');`,
        'node_modules/mod/index.js': 'export default () => {}',
    });
    // const outfile = randomOutputFile()
    const res = yield esbuild_1.build({
        entryPoints: [ENTRY],
        write: false,
        format: 'esm',
        target: 'es2017',
        bundle: true,
        plugins: [_1.default({ externals: ['mod'] })],
    });
    unlink();
}));
test('works with both import and require', () => __awaiter(void 0, void 0, void 0, function* () {
    const { unlink, paths: [ENTRY, OUTPUT], } = yield test_support_1.writeFiles({
        'entry.ts': `import {x} from './utils'; const {z} = require('mod'); z(x || '', 'ciao')`,
        'output.js': ``,
        'utils.ts': `import * as mod from 'mod'; import {z} from 'mod'; z('hello'); export const x = mod.z('x'); console.log('z', z,); console.log('namespace', {...mod});`,
        'node_modules/mod/index.esm.js': 'export const z = console.log',
        'node_modules/mod/index.cjs.js': 'exports.z = console.log',
        'node_modules/mod/package.json': '{ "name": "mod", "version": "0.0.0", "main": "index.cjs.js", "module": "index.esm.js" }',
    });
    const res = yield esbuild_1.build({
        entryPoints: [ENTRY],
        // write: false,
        outfile: OUTPUT,
        format: 'esm',
        minify: false,
        bundle: true,
        plugins: [_1.default({ externals: ['mod'] })],
    });
    console.log(OUTPUT);
    // console.log(fs.readFileSync(OUTPUT).toString())
    const outfile = test_support_1.randomOutputFile();
    const res2 = yield esbuild_1.build({
        entryPoints: [OUTPUT],
        outfile,
        format: 'cjs',
        bundle: true,
    });
    const out = child_process_1.execSync(`node ${outfile}`, { stdio: 'pipe' });
    console.log(out.toString());
    console.log(outfile);
    // unlink()
}));
describe('makeFilter', () => {
    const filter = _1.makeFilter(['react']);
    const positiveCases = ['react', 'react/', 'react/dist', 'react/dist/index'];
    for (let t of positiveCases) {
        test(t, () => {
            expect(filter.test(t)).toBe(true);
        });
    }
    const falseCases = ['reactx', 'reactx/', 'react-dom'];
    for (let t of falseCases) {
        test(t, () => {
            expect(filter.test(t)).toBe(false);
        });
    }
});
//# sourceMappingURL=index.test.js.map