import * as fs from 'fs'
import * as core from '@actions/core'

export async function run(): Promise<void> {
  try {
    removeTarArchive()
  } catch (error) {
    const err = error as Error
    core.info(err.message)
  }
}
function removeTarArchive(): void {
  const path = './tmp/archive.tar.gz'
  try {
    fs.unlinkSync(path)
    console.log(`Archive cleanup done!`)
  } catch (err) {
    console.log(err)
  }
}
run()
