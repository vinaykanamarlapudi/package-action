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
    const payload = {
      owner: 'OWNER',
      repo: 'REPO',
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
    if (error instanceof Error) core.setFailed(`Oops! Action package push to GHCR failed!`)
  }
}

run()
