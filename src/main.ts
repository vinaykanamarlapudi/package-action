import * as core from '@actions/core'
import {publishOciArtifact} from './api-client'

async function run(): Promise<void> {
  try {
    const repository: string = process!.env!.GITHUB_REPOSITORY || " ";
    if (repository === " "){
      core.setFailed(`Oops! Could not found Repository!`);
    }
    const semver: string = core.getInput('semver');

    await publishOciArtifact(repository, semver);

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
