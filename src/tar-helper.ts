import * as core from '@actions/core'
import * as exec from '@actions/exec'
import tar from 'tar';

export async function createTarBall(workdir: string): Promise<void> {
  try {
    const tarStream = tar.c(
      {
        gzip: true
      },
      ['./']
   );
    console.log(`Tar.create added`);
    console.log(tarStream);
    await exec.exec(`touch archive.tar.gz`);
    await exec.exec(`tar --exclude=archive.tar.gz -czf archive.tar.gz ${workdir}`);
    console.log("Tar cmd done");
    console.log("Exec executing for ls down");
    exec.exec('ls');
    exec.exec('cd archive.tar.gz');
    core.info(`Next is ls into archive.tar.gz`);
    exec.exec('ls');
  } catch (error) {
    if (error instanceof Error) core.setFailed(`Oops! Creation of tarball failed!`)
  }
}
