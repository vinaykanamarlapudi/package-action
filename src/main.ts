import * as core from '@actions/core'
import {publishOciArtifact} from './api-client'
import * as tarHelper from './tar-helper'

async function run(): Promise<void> {
  try {
    const repository: string = process.env.GITHUB_REPOSITORY || ''
    if (repository === '') {
      core.setFailed(`Could not find Repository!`)
    }
    const semver: string = core.getInput('semver')
    const workdir: string = core.getInput('workdir')

    await tarHelper.createTarBall(workdir)
    await publishOciArtifact(repository, semver)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
