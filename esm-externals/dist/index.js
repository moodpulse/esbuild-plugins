"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFilter = exports.EsmExternalsPlugin = void 0;
const escape_string_regexp_1 = __importDefault(require("escape-string-regexp"));
const NAME = 'esm-externals';
const NAMESPACE = NAME;
function EsmExternalsPlugin({ externals }) {
    return {
        name: NAME,
        setup(build) {
            const filter = makeFilter(externals);
            build.onResolve({ filter: /.*/, namespace: NAMESPACE }, (args) => {
                return {
                    path: args.path,
                    external: true,
                };
            });
            build.onResolve({ filter }, (args) => {
                return {
                    path: args.path,
                    namespace: NAMESPACE,
                };
            });
            build.onLoad({ filter: /.*/, namespace: NAMESPACE }, (args) => {
                return {
                    contents: `export * as default from ${JSON.stringify(args.path)}; export * from ${JSON.stringify(args.path)};`,
                };
            });
        },
    };
}
exports.EsmExternalsPlugin = EsmExternalsPlugin;
exports.default = EsmExternalsPlugin;
function makeFilter(externals) {
    return new RegExp('^(' + externals.map(escape_string_regexp_1.default).join('|') + ')(\\/.*)?$');
}
exports.makeFilter = makeFilter;
//# sourceMappingURL=index.js.map