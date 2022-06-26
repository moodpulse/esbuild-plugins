"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatEsbuildOutput = exports.randomOutputFile = exports.writeFiles = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
function writeFiles(graph) {
    return __awaiter(this, void 0, void 0, function* () {
        const dirname = uuid_1.v4().slice(0, 4);
        let base = path_1.default.resolve(os_1.default.tmpdir(), dirname);
        yield fs_extra_1.default.ensureDir(base);
        base = fs_extra_1.default.realpathSync(base);
        const promises = Object.keys(graph).map((name) => __awaiter(this, void 0, void 0, function* () {
            const p = path_1.default.resolve(base, name);
            yield fs_extra_1.default.createFile(p);
            const content = (graph[name] || '') + '\n';
            yield fs_extra_1.default.writeFile(p, content, { encoding: 'utf8' });
            return p;
        }));
        const paths = yield Promise.all(promises);
        function unlink() {
            paths.forEach((x) => {
                fs_extra_1.default.unlinkSync(x);
            });
        }
        return { unlink, paths, base };
    });
}
exports.writeFiles = writeFiles;
function randomOutputFile(extension = '.js') {
    const filename = uuid_1.v4().slice(0, 4) + extension;
    const outfile = path_1.default.resolve(os_1.default.tmpdir(), filename);
    return outfile;
}
exports.randomOutputFile = randomOutputFile;
function formatEsbuildOutput(res) {
    var _a;
    if (!((_a = res === null || res === void 0 ? void 0 : res.outputFiles) === null || _a === void 0 ? void 0 : _a.length)) {
        return 'No outputs!';
    }
    return res.outputFiles.map((x) => x.path + ':\n' + x.text).join(`\n---\n`);
}
exports.formatEsbuildOutput = formatEsbuildOutput;
//# sourceMappingURL=index.js.map