import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {wait} from './wait'

async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')
    core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())

    const TOKEN: string = core.getInput('token');
    core.setSecret(TOKEN);
    const repoInput: string = core.getInput('repository');
    const repoDetails: string[] = repoInput.split("/");
    const repositoryOwner: string = repoDetails[0];
    const repositoryName: string = repoDetails[1];
    const semver: string = core.getInput('semver');

    await publishOciArtifact(repoDetails, semver);

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function publishOciArtifact(repoDetails: string[], semver: string): Promise<void> {
  try {
    
  } catch (error) {
    if (error instanceof Error) core.setFailed(`Oops! Action package push to GHCR failed!`)
  }
}

run()
