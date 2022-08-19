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
const core = __importStar(require("@actions/core"));
const axios = __importStar(require("axios"));
const jest = __importStar(require("jest"));
describe('create and publish', () => {
    beforeAll(() => {
        process.env.GITHUB_REPOSITORY = 'monalisa/is-awesome';
        process.env.GITHUB_TOKEN = 'gha-token';
        process.env.GITHUB_ACTOR = 'monalisa';
        jest.spyOn(core, 'getInput').mockImplementation(param => {
            switch (param) {
                case 'semver':
                    return '1.0.1';
                case 'token':
                    return process.env.GITHUB_TOKEN;
                case 'workdir':
                    return '.';
            }
        });
        jest.spyOn(core, 'setOutput').mockImplementation(param => {
            return param;
        });
        jest.spyOn(core, 'setFailed').mockImplementation(param => {
            return param;
        });
        // Mock error/warning/info/debug
        jest.spyOn(core, 'error').mockImplementation(jest.fn());
        jest.spyOn(core, 'warning').mockImplementation(jest.fn());
        jest.spyOn(core, 'info').mockImplementation(jest.fn());
        jest.spyOn(core, 'debug').mockImplementation(jest.fn());
    });
    it('can successfully create a package', () => __awaiter(void 0, void 0, void 0, function* () {
        //     process.env.GITHUB_SHA = 'valid-build-version'
        //     const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiNjllMWIxOC1jOGFiLTRhZGQtOGYxOC03MzVlMzVjZGJhZjAiLCJzdWIiOiJyZXBvOnBhcGVyLXNwYS9taW55aTplbnZpcm9ubWVudDpQcm9kdWN0aW9uIiwiYXVkIjoiaHR0cHM6Ly9naXRodWIuY29tL3BhcGVyLXNwYSIsInJlZiI6InJlZnMvaGVhZHMvbWFpbiIsInNoYSI6ImEyODU1MWJmODdiZDk3NTFiMzdiMmM0YjM3M2MxZjU3NjFmYWM2MjYiLCJyZXBvc2l0b3J5IjoicGFwZXItc3BhL21pbnlpIiwicmVwb3NpdG9yeV9vd25lciI6InBhcGVyLXNwYSIsInJ1bl9pZCI6IjE1NDY0NTkzNjQiLCJydW5fbnVtYmVyIjoiMzQiLCJydW5fYXR0ZW1wdCI6IjIiLCJhY3RvciI6IllpTXlzdHkiLCJ3b3JrZmxvdyI6IkNJIiwiaGVhZF9yZWYiOiIiLCJiYXNlX3JlZiI6IiIsImV2ZW50X25hbWUiOiJwdXNoIiwicmVmX3R5cGUiOiJicmFuY2giLCJlbnZpcm9ubWVudCI6IlByb2R1Y3Rpb24iLCJqb2Jfd29ya2Zsb3dfcmVmIjoicGFwZXItc3BhL21pbnlpLy5naXRodWIvd29ya2Zsb3dzL2JsYW5rLnltbEByZWZzL2hlYWRzL21haW4iLCJpc3MiOiJodHRwczovL3Rva2VuLmFjdGlvbnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tIiwibmJmIjoxNjM4ODI4MDI4LCJleHAiOjE2Mzg4Mjg5MjgsImlhdCI6MTYzODgyODYyOH0.1wyupfxu1HGoTyIqatYg0hIxy2-0bMO-yVlmLSMuu2w'
        //     const scope = nock(`http://my-url`)
        //       .get('/_apis/pipelines/workflows/123/artifacts?api-version=6.0-preview')
        //       .reply(200, { value: [ {url: 'https://another-artifact.com', name: 'another-artifact'}, { url: 'https://fake-artifact.com', name: 'github-pages' }] })
        //     core.getIDToken = jest.fn().mockResolvedValue(fakeJwt)
        axios.post = jest.fn().mockResolvedValue({
            status: 201,
            data: {
                package: "https://ghcr.io/monalisa/is-awesome:1.0.1"
            }
        });
        expect(axios.post).toBeCalledWith('http://api.github.localhost/repos/monalisa/is-awesome/actions/packages'
        //       ,{
        //         artifact_url: 'https://fake-artifact.com&%24expand=SignedContent',
        //         pages_build_version: 'valid-build-version',
        //         oidc_token: fakeJwt
        //       },
        //       {
        //         headers: {
        //           Accept: 'application/octet-stream',
        //           Authorization: `Bearer gha-token`,
        //           'Content-type': 'application/json'
        //         }
        //       }
        );
        expect(core.setFailed).not.toHaveBeenCalled();
        expect(core.info).toHaveBeenCalledWith('Created GHCR package for semver(1.0.1) with package URL https://ghcr.io/monalisa/is-awesome:1.0.1');
        // scope.done()
    }));
    // Create the package
    //     const deployment = new Deployment()
    //     await deployment.create(fakeJwt)
    it('Reports errors with failed package', () => __awaiter(void 0, void 0, void 0, function* () {
        //     process.env.GITHUB_SHA = 'invalid-build-version'
        //     const scope = nock(`http://my-url`)
        //       .get('/_apis/pipelines/workflows/123/artifacts?api-version=6.0-preview')
        //       .reply(200, { value: [{ url: 'https://invalid-artifact.com', name: 'github-pages' }] })
        axios.post = jest.fn().mockRejectedValue({
            status: 400
        });
        // Create the deployment
        //     const deployment = new Deployment()
        try {
            //       deployment.create()
            console.log("Do something");
        }
        catch (err) {
            expect(axios.post).toBeCalledWith('http://api.github.localhost/repos/monalisa/is-awesome/actions/packages'
            //         ,{
            //           artifact_url: 'https://invalid-artifact.com&%24expand=SignedContent',
            //           pages_build_version: 'invalid-build-version'
            //         },
            //         {
            //           headers: {
            //             Accept: 'application/vnd.github.v3+json',
            //             Authorization: 'Bearer ',
            //             'Content-type': 'application/octet-stream'
            //           }
            //         }
            );
            //       expect(core.info).toHaveBeenLastCalledWith(
            //         'Failed to create deployment for invalid-build-version.'
            //       )
            expect(core.setFailed).toHaveBeenCalledWith({ status: 400 });
            //   scope.done()
        }
    }));
});
