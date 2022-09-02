import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as fs from 'fs'

// Creates a tar.gzip of the inputs specified in path input or the entire contents
export async function createTarBall(path: string): Promise<void> {
  try {
    await exec.exec(`touch archive.tar.gz`)
    const pathArray: string[] = path.trim().split(/\s+/)
    if (!isValidPath(pathArray)) {
      throw new Error(
        'Invalid path. Please ensure the path input has a valid path defined and separated by a space if you want multiple files/folders to be packaged.'
      )
    }
    const actionFileWithExtension = fs.existsSync('action.yml')
      ? 'action.yml'
      : 'action.yaml'
    const cmd = isActionYamlPresentInPathSrc(pathArray)
      ? `tar --exclude=archive.tar.gz -czf archive.tar.gz ${path}`
      : `tar --exclude=archive.tar.gz -czf archive.tar.gz ${path} ${actionFileWithExtension}`
    await exec.exec(cmd)
    core.info(`Tar ball created.`)
  } catch (error) {
    let errorMessage = `Creation of tarball failed! `
    if (error instanceof Error && error.message)
      errorMessage += `${error.message}`
    core.setFailed(errorMessage)
  }
}

// Boolean function that returns whether the path given in path input is valid or not
export function isValidPath(pathArray: string[]): boolean {
  // Returns true only if every path is a valid path
  return pathArray.every(filePath => {
    return fs.existsSync(filePath)
  })
}

// Boolean function that determines whether action.y(a)ml is present in the path input or not
export function isActionYamlPresentInPathSrc(pathArray: string[]): boolean {
  if (pathArray.includes('action.yml') || pathArray.includes('action.yaml'))
    return true

  // Transform the paths array to remove the traling '/' if it is present in the path input
  pathArray = pathArray.map(e => {
    if (e.endsWith('/')) return e.slice(0, -1)
    return e
  })

  // Returns true as soon as action.y(a)ml is found in any of the paths in the provided path input
  return pathArray.some(filePath => {
    return (
      fs.existsSync(`${filePath}/action.yml`) ||
      fs.existsSync(`${filePath}/action.yaml`)
    )
  })
}
