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
    console.log(`Tar.create added`);
    console.log(tarStream);
    exec.exec(`touch archive.tar.gz`);
    exec.exec(`tar --exclude=archive.tar.gz -czf archive.tar.gz ${workdir}`);
    console.log("Tar cmd done");
    console.log("Exec executing for ls down");
    exec.exec('ls');
    exec.exec('tar -tf archive.tar.gz');
    core.info(`Just before this contents into archive.tar.gz`);
    core.info(`Tar ball created.`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(`Oops! Creation of tarball failed!`)
  }
}
