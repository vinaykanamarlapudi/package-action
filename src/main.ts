import * as core from '@actions/core'
import * as exec from '@actions/exec'
import axios from 'axios'
import {wait} from './wait'

async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')
    core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())

    
    const repoInput: string = process.env.GITHUB_REPOSITORY;
    const repoDetails: string[] = repoInput.split("/");
    const repositoryOwner: string = repoDetails[0];
    const repositoryName: string = repoDetails[1];
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
    const publishPackageEndpoint: string = `http://localhost:3000/repos/${repoInput}/actions/package/${semver}`;
    const payload = {
      tarball: await createTarBall(workdir)
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
