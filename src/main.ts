import * as core from '@actions/core'
// import * as exec from '@actions/exec'
import axios from 'axios'
import { stringify } from 'querystring'
import {wait} from './wait'

async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')
    core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())

    
    const repoInput: string = process!.env!.GITHUB_REPOSITORY || "Hello";
    // const repoDetails = repoInput!.split("/");
    const semver: string = core.getInput('semver');

    await publishOciArtifact(repoInput, semver);

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function createTarBall(workdir: string): Promise<void> {
  try {
    console.log("Insert logic to create Tarball");
  } catch (error) {
    if (error instanceof Error) core.setFailed(`Oops! Creation of tarball failed!`)
  }
}

async function publishOciArtifact(repoInput: string, semver: string): Promise<void> {
  try {
    const TOKEN: string = core.getInput('token');
    core.setSecret(TOKEN);
    const workdir: string = core.getInput('workdir');
//     const publishPackageEndpoint: string = `http://localhost:3000/repos/${repoInput}/actions/package/${semver}`;
    const publishPackageEndpoint: string = `https://api.github.com/repos/${repoInput}/releases`
//     const payload = {
//       tarball: await createTarBall(workdir)
//     }
    const repoDetails = repoInput.split("/");
    const payload = {
      owner: repoDetails[0],
      repo: repoDetails[1],
      tag_name: 'v1.0.0',
      target_commitish: 'master',
      name: 'v1.0.0',
      body: 'Description of the release',
      draft: false,
      prerelease: false,
      generate_release_notes: false
    }
    core.info(`Creating GHCR package with payload:\n${JSON.stringify(payload, null, '\t')}`)
    const response = await axios.post(publishPackageEndpoint, payload, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${TOKEN}`,
        'Content-type': 'application/json'
      }
    });
    if (response && response.data) {
      core.info(JSON.stringify(response.data))
    }
  } catch (error) {
    // if (error instanceof Error) core.setFailed(`Oops! Action package push to GHCR failed!`)
    

        // output raw error in debug mode.
        core.debug(JSON.stringify(error))

        // build customized error message based on server response
        if (error instanceof Error) {
          core.info(`Printing error:\n${JSON.stringify(error, null, '\t')}`)
          core.info(error.stack || "Hey")
          let errorMessage: string = `Failed to create Package (status: ) with release version ${semver}. `
          // if(error.response){
          //  let errorMessage: string = `Failed to create Package (status: ${error.response.status}) with release version ${semver}. `
          // if (error.response.status == 400) {
          //   let message = ""
          //   if (error.response.data && error.response.data.message) {
          //     message = error.response.data.message
          //   } else {
          //     message = error.response.data
          //   }
          //   errorMessage += `Responded with: ${message}`
          // }
          // else if (error.response.status == 403) {
          //   errorMessage += `Ensure GITHUB_TOKEN has permission "pages: write".`
          // } else if (error.response.status == 404) {
          //   errorMessage += `Ensure GitHub Pages has been enabled.`
          // }
          // else if (error.response.status >= 500) {
          //   errorMessage += `Server error, is githubstatus.com reporting a Pages outage? Please re-run the deployment at a later time.`
          // }
          throw errorMessage
        } else {
          throw error
        }
  }
}

run()
