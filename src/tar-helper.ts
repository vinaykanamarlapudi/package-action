import * as core from '@actions/core'
import * as exec from '@actions/exec'
import tar from 'tar';

export function createTarBall(workdir: string): void {
  try {
    const tarStream = tar.c(
      {
        gzip: true
      },
      ['./']
   );
    exec.exec(`touch archive.tar.gz`);
    exec.exec(`tar --exclude=archive.tar.gz -czf archive.tar.gz ${workdir}`);
    core.info(`Tar ball created.`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(`Oops! Creation of tarball failed!`)
  }
}
