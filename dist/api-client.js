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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishOciArtifact = exports.getApiBaseUrl = void 0;
const core = __importStar(require("@actions/core"));
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
//returns the API Base Url
function getApiBaseUrl() {
    const githubApiUrl = 'https://api.github.com';
    return githubApiUrl;
}
exports.getApiBaseUrl = getApiBaseUrl;
// Publish the Action Artifact to GHCR by calling the post API
function publishOciArtifact(repository, semver) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const TOKEN = core.getInput('token');
            core.setSecret(TOKEN);
            const path = core.getInput('path');
            const publishPackageEndpoint = `${getApiBaseUrl()}/repos/${repository}/actions/package`;
            core.info(`Creating GHCR package for release with semver:${semver} with path:"${path}"`);
            const tempDir = './tmp';
            const fileStream = fs.createReadStream(`${tempDir}/archive.tar.gz`);
            const response = yield axios_1.default.post(publishPackageEndpoint, fileStream, {
                headers: {
                    Accept: 'application/vnd.github.v3+json',
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-type': 'application/octet-stream',
                    tag: `${semver}`
                }
            });
            core.info(`Created GHCR package for semver(${semver}) with package URL ${response.data.package_url}`);
            core.setOutput('package-url', `${response.data.package_url}`);
        }
        catch (error) {
            errorResponseHandling(error, semver);
        }
    });
}
exports.publishOciArtifact = publishOciArtifact;
// Respond with the appropriate error message based on response
function errorResponseHandling(error, semver) {
    if (error.response) {
        let errorMessage = `Failed to create package (status: ${error.response.status}) with semver ${semver}. `;
        if (error.response.status === 400) {
            if (error.message) {
                errorMessage += `\nResponded with: "${error.message}"`;
            }
        }
        else if (error.response.status === 403) {
            errorMessage += `Ensure GITHUB_TOKEN has permission "packages: write". `;
        }
        else if (error.response.status === 404) {
            errorMessage += `Ensure GitHub Actions have been enabled. `;
            if (error.message) {
                errorMessage += `\nResponded with: "${error.message}"`;
            }
        }
        else if (error.response.status >= 500) {
            errorMessage += `Server error, is githubstatus.com reporting a GHCR outage? Please re-run the release at a later time. `;
            if (error.message) {
                errorMessage += `\nResponded with: "${error.message}"`;
            }
        }
        core.setFailed(errorMessage);
    }
    else {
        core.setFailed(`An unexpected error occured with error:\n${error}`);
    }
}
