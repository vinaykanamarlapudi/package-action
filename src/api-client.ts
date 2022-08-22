import * as core from '@actions/core'
import * as tarHelper from './tar-helper'
import axios from 'axios'
import { stringify } from 'querystring'

function getApiBaseUrl(): string {
  return 'http://api.github.localhost'
}

export async function publishOciArtifact(repository: string, semver: string): Promise<void> {
  try {
    const TOKEN: string = core.getInput('token');
    core.setSecret(TOKEN);
    const workdir: string = core.getInput('workdir');
    const publishPackageEndpoint: string = `${getApiBaseUrl()}/repos/${repository}/actions/package`
    const tarball = tarHelper.createTarBall(workdir);
 
    core.info(`Creating GHCR package for release with semver:${semver} with workdir:"${workdir}"`);
    await axios.post(publishPackageEndpoint
//       , payload,
//       {
//         headers: {
//          Accept: 'application/vnd.github.v3+json',
//          Authorization: `Bearer ${TOKEN}`,
//         'Content-type': 'application/octet-stream'
//          }
//       }
     )
    .then(response => {
      core.info(`Created GHCR package for semver(${semver}) with package URL ${response.data.package}`);
      core.setOutput('package-url', `https://ghcr.io/${repository}:${semver}`);     
    })
    .catch(error => {
      if (error.response) {
        let errorMessage = `Failed to create package (status: ${error.response.status}) with semver ${semver}. `
        if (error.response.status == 400) {
          let message = ""
          if (error.response.data && error.response.data.message) {
            message = error.response.data.message
          } else {
            message = error.response.data
          }
          errorMessage += `Responded with: ${message}`
        }
        else if (error.response.status == 403) {
          errorMessage += `Ensure GITHUB_TOKEN has permission "packages: write".`
        } 
        else if (error.response.status == 404) {
          errorMessage += `Ensure GitHub Actions have been enabled.`
        }
        else if (error.response.status >= 500) {
          errorMessage += `Server error, is githubstatus.com reporting a GHCR outage? Please re-run the release at a later time.`
        }
        core.setFailed(errorMessage);
      } else {
        throw error
      }
    });
  } catch (error) {
      core.setFailed(`Oops! An unexpected error occured with error:\n${JSON.stringify(error)}`);
  }
}
