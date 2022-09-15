import * as core from '@actions/core'
import axios from 'axios'
import * as exec from '@actions/exec'
import * as fs from 'fs'
import {blob} from 'stream/consumers'

//returns the API Base Url
export function getApiBaseUrl(): string {
  const githubApiUrl = 'https://api.github.com'
  return githubApiUrl
}

// Publish the Action Artifact to GHCR by calling the post API
export async function publishOciArtifact(
  repository: string,
  semver: string
): Promise<void> {
  try {
    const TOKEN: string = core.getInput('token')
    core.setSecret(TOKEN)
    const path: string = core.getInput('path')
    const publishPackageEndpoint = `${getApiBaseUrl()}/repos/${repository}/actions/package`

    core.info(
      `Creating GHCR package for release with semver:${semver} with path:"${path}"`
    )
    const tempDir = '/tmp'
    const byteData = fs.readFileSync(`${tempDir}/archive.tar.gz`, 'binary')
    // const fileBinary = fs.readFileSync

    // const response = await axios.post(publishPackageEndpoint, byteData, {
    //   headers: {
    //     Accept: 'application/vnd.github.v3+json',
    //     Authorization: `Bearer ${TOKEN}`,
    //     'Content-type': 'application/octet-stream',
    //     tag: `${semver}`
    //   }
    // })

    const response = await exec.getExecOutput(`curl --request POST \
          --url ${publishPackageEndpoint} \
          --header 'authorization: Bearer ${TOKEN}' \
          --header 'content-type: application/octet-stream' \
          --header 'tag: ${semver}' \
          --data-binary "@/tmp/archive.tar.gz" \
          --fail`)

    core.info(
      `Created GHCR package for semver(${semver}) with package URL ${response.stdout}`
    )
    core.setOutput('package-url', `${response.stdout}`)
  } catch (error) {
    errorResponseHandling(error, semver)
  }
}

// Respond with the appropriate error message based on response
function errorResponseHandling(error: any, semver: string): void {
  if (error.response) {
    let errorMessage = `Failed to create package (status: ${error.response.status}) with semver ${semver}. `
    if (error.response.status === 400) {
      if (error.message) {
        errorMessage += `\nResponded with: "${error.message}"`
      }
    } else if (error.response.status === 403) {
      errorMessage += `Ensure GITHUB_TOKEN has permission "packages: write". `
    } else if (error.response.status === 404) {
      errorMessage += `Ensure GitHub Actions have been enabled. `
      if (error.message) {
        errorMessage += `\nResponded with: "${error.message}"`
      }
    } else if (error.response.status >= 500) {
      errorMessage += `Server error, is githubstatus.com reporting a GHCR outage? Please re-run the release at a later time. `
      if (error.message) {
        errorMessage += `\nResponded with: "${error.message}"`
      }
    }
    core.setFailed(errorMessage)
  } else {
    core.setFailed(
      `An unexpected error occured with error:\n${JSON.stringify(error)}`
    )
  }
}
