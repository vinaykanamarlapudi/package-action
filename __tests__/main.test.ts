import * as core from '@actions/core';
import axios from 'axios';
jest.mock('axios');
describe('create and publish', () => { //describe
  beforeAll(() => { //beforeAll
    process.env.GITHUB_REPOSITORY = 'monalisa/is-awesome'
    process.env.GITHUB_TOKEN = 'gha-token'
    process.env.GITHUB_ACTOR = 'monalisa'
    
    let inputs = {
      'semver': '1.0.1',
      'token': process.env.GITHUB_TOKEN,
      'workdir': '.'
    } as any;

    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      return inputs[name]
    })

    jest.spyOn(core, 'setOutput').mockImplementation(param => { //core, jest and param has any type
      return param
    })

    jest.spyOn(core, 'setFailed').mockImplementation(param => { //core, jest and param has any type
      return param
    })
    // Mock error/warning/info/debug
    jest.spyOn(core, 'error').mockImplementation(jest.fn())
    jest.spyOn(core, 'warning').mockImplementation(jest.fn())
    jest.spyOn(core, 'info').mockImplementation(jest.fn())
    jest.spyOn(core, 'debug').mockImplementation(jest.fn())
  })

    it('can successfully create a package', async () => { //it
    //     process.env.GITHUB_SHA = 'valid-build-version'
    //     const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiNjllMWIxOC1jOGFiLTRhZGQtOGYxOC03MzVlMzVjZGJhZjAiLCJzdWIiOiJyZXBvOnBhcGVyLXNwYS9taW55aTplbnZpcm9ubWVudDpQcm9kdWN0aW9uIiwiYXVkIjoiaHR0cHM6Ly9naXRodWIuY29tL3BhcGVyLXNwYSIsInJlZiI6InJlZnMvaGVhZHMvbWFpbiIsInNoYSI6ImEyODU1MWJmODdiZDk3NTFiMzdiMmM0YjM3M2MxZjU3NjFmYWM2MjYiLCJyZXBvc2l0b3J5IjoicGFwZXItc3BhL21pbnlpIiwicmVwb3NpdG9yeV9vd25lciI6InBhcGVyLXNwYSIsInJ1bl9pZCI6IjE1NDY0NTkzNjQiLCJydW5fbnVtYmVyIjoiMzQiLCJydW5fYXR0ZW1wdCI6IjIiLCJhY3RvciI6IllpTXlzdHkiLCJ3b3JrZmxvdyI6IkNJIiwiaGVhZF9yZWYiOiIiLCJiYXNlX3JlZiI6IiIsImV2ZW50X25hbWUiOiJwdXNoIiwicmVmX3R5cGUiOiJicmFuY2giLCJlbnZpcm9ubWVudCI6IlByb2R1Y3Rpb24iLCJqb2Jfd29ya2Zsb3dfcmVmIjoicGFwZXItc3BhL21pbnlpLy5naXRodWIvd29ya2Zsb3dzL2JsYW5rLnltbEByZWZzL2hlYWRzL21haW4iLCJpc3MiOiJodHRwczovL3Rva2VuLmFjdGlvbnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tIiwibmJmIjoxNjM4ODI4MDI4LCJleHAiOjE2Mzg4Mjg5MjgsImlhdCI6MTYzODgyODYyOH0.1wyupfxu1HGoTyIqatYg0hIxy2-0bMO-yVlmLSMuu2w'
    //     const scope = nock(`http://my-url`)
    //       .get('/_apis/pipelines/workflows/123/artifacts?api-version=6.0-preview')
    //       .reply(200, { value: [ {url: 'https://another-artifact.com', name: 'another-artifact'}, { url: 'https://fake-artifact.com', name: 'github-pages' }] })

    //     core.getIDToken = jest.fn().mockResolvedValue(fakeJwt)
        axios.post = jest.fn().mockResolvedValue({ //Property 'post' does not exist on type 'typeof import("/workspaces/actions/runner/_layout/_work/typescript-action/typescript-action/node_modules/axios/index")'.
            status: 201,
            data: {
                package: "https://ghcr.io/monalisa/is-awesome:1.0.1"
            }
        })

        expect(axios.post).toBeCalledWith(
            'http://api.github.localhost/repos/monalisa/is-awesome/actions/packages'
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
        )

        expect(core.setFailed).not.toHaveBeenCalled()
        expect(core.info).toHaveBeenCalledWith(
        'Created GHCR package for semver(1.0.1) with package URL https://ghcr.io/monalisa/is-awesome:1.0.1'
        )

        // scope.done()

        })


    // Create the package
//     const deployment = new Deployment()
//     await deployment.create(fakeJwt)

    it('Reports errors with failed package', async () => {
        //     process.env.GITHUB_SHA = 'invalid-build-version'
        //     const scope = nock(`http://my-url`)
        //       .get('/_apis/pipelines/workflows/123/artifacts?api-version=6.0-preview')
        //       .reply(200, { value: [{ url: 'https://invalid-artifact.com', name: 'github-pages' }] })
        
            axios.post = jest.fn().mockRejectedValue({
            status: 400
            })
        
            // Create the deployment
        //     const deployment = new Deployment()
            try {
        //       deployment.create()
            console.log("Do something");
            } catch (err) {
        
            expect(axios.post).toBeCalledWith(
                'http://api.github.localhost/repos/monalisa/is-awesome/actions/packages'
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
            )
        
        //       expect(core.info).toHaveBeenLastCalledWith(
        //         'Failed to create deployment for invalid-build-version.'
        //       )
            expect(core.setFailed).toHaveBeenCalledWith({ status: 400 })
        
            //   scope.done()
            }
    })
})
