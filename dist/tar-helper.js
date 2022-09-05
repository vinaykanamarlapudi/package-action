"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.isActionYamlPresentInPathSrc = exports.isValidPath = exports.createTarBall = void 0;
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const fs = __importStar(require("fs"));
// Creates a tar.gzip of the inputs specified in path input or the entire contents
function createTarBall(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tempDir = './tmp';
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir);
            }
            yield exec.exec(`touch ${tempDir}/archive.tar.gz`);
            const pathArray = path.trim().split(/\s+/);
            if (!isValidPath(pathArray)) {
                throw new Error('Invalid path. Please ensure the path input has a valid path defined and separated by a space if you want multiple files/folders to be packaged.');
            }
            const actionFileWithExtension = fs.existsSync('action.yml')
                ? 'action.yml'
                : 'action.yaml';
            const cmd = isActionYamlPresentInPathSrc(pathArray)
                ? `tar --exclude=${tempDir}/archive.tar.gz -czf ${tempDir}/archive.tar.gz ${path}`
                : `tar --exclude=${tempDir}/archive.tar.gz -czf ${tempDir}/archive.tar.gz ${path} ${actionFileWithExtension}`;
            yield exec.exec(cmd);
            core.info(`Tar ball created.`);
        }
        catch (error) {
            let errorMessage = `Creation of tarball failed! `;
            if (error instanceof Error && error.message)
                errorMessage += `${error.message}`;
            core.setFailed(errorMessage);
        }
    });
}
exports.createTarBall = createTarBall;
// Boolean function that returns whether the path given in path input is valid or not
function isValidPath(pathArray) {
    // Returns true only if every path is a valid path
    return pathArray.every(filePath => {
        return fs.existsSync(filePath);
    });
}
exports.isValidPath = isValidPath;
// Boolean function that determines whether action.y(a)ml is present in the path input or not
function isActionYamlPresentInPathSrc(pathArray) {
    if (pathArray.includes('action.yml') || pathArray.includes('action.yaml'))
        return true;
    // Transform the paths array to remove the traling '/' if it is present in the path input
    pathArray = pathArray.map(e => {
        if (e.endsWith('/'))
            return e.slice(0, -1);
        return e;
    });
    // Returns true as soon as action.y(a)ml is found in any of the paths in the provided path input
    return pathArray.some(filePath => {
        return (fs.existsSync(`${filePath}/action.yml`) ||
            fs.existsSync(`${filePath}/action.yaml`));
    });
}
exports.isActionYamlPresentInPathSrc = isActionYamlPresentInPathSrc;
