import * as core from '@actions/core';
import axios from 'axios';
import {publishOciArtifact} from '../src/api-client'
jest.mock('axios');

describe('create and publish', () => { 
  beforeAll(() => { 
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

  it('can successfully create a package', async () => { 
      axios.post = jest.fn().mockResolvedValue({ 
        status: 201,
        data: {
            package: "https://ghcr.io/monalisa/is-awesome:1.0.1"
        }
      })
    
      await publishOciArtifact("monalisa/is-awesome", "1.0.1");

      expect(axios.post).toBeCalledWith(
          'http://api.github.localhost/repos/monalisa/is-awesome/actions/package'
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
  })

  it('Reports errors with failed package', async () => {
    axios.post = jest.fn().mockRejectedValue({
      status: 400
    })
         
    try {
      await publishOciArtifact("monalisa/is-awesome", "1.0.1");
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
    }
  })
})
