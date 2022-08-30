import * as core from '@actions/core'
import * as exec from '@actions/exec'

export async function createTarBall(workdir: string): Promise<void> {
  try {
    await exec.exec(`touch archive.tar.gz`)
    await exec.exec(
      `tar --exclude=archive.tar.gz -czf archive.tar.gz ${workdir}`
    )
    core.info(`Tar ball created.`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(`Creation of tarball failed!`)
  }
}
