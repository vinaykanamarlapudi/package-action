import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as fs from 'fs'
import * as github from '@actions/github'

// Creates a tar.gzip of the inputs specified in path input or the entire contents
export async function createTarBall(path: string): Promise<boolean> {
  try {
    const tempDir = '/tmp'
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir)
    }

    const pathArray: string[] = path.trim().split(/\s+/)
    if (!isValidPath(pathArray)) {
      throw new Error(
        'Invalid path. Please ensure the path input has a valid path defined and separated by a space if you want multiple files/folders to be packaged.'
      )
    }
    const repoNwo: string = process.env.GITHUB_REPOSITORY || '';
    const repoParse = repoNwo.split('/')
    const repoName: string = repoParse[1]

    if (!fs.existsSync(`${tempDir}/${repoName}`)) {
      fs.mkdirSync(`${tempDir}/${repoName}`);
    }

    // pathArray.forEach(async(filePath) => {
    //   await exec.exec(`cp -r ${filePath} ${tempDir}/${repoName}`)
    // })
    for await (const filePath of pathArray) {
      await exec.exec(`cp -r ${filePath} ${tempDir}/${repoName}`)
    }

    const actionFileWithExtension = fs.existsSync('action.yml') ? 'action.yml' : 'action.yaml'
    if(!isActionYamlPresentInPathSrc(pathArray) && fs.existsSync(actionFileWithExtension) && !fs.existsSync(`${tempDir}/${repoName}/${actionFileWithExtension}`)){
      await exec.exec(`cp ${actionFileWithExtension} ${tempDir}/${repoName}`)
    }

    const cmd = `tar -czf ${tempDir}/archive.tar.gz -C ${tempDir} ${repoName}`

    await exec.exec(cmd)
    core.info(`Tar ball created.`)
    
    await exec.exec(`rm -rf ${tempDir}/${repoName}`)
    return true
  } catch (error) {
  
    let errorMessage = `Creation of tarball failed! `
    if (error instanceof Error && error.message)
      errorMessage += `${error.message}`
    core.setFailed(errorMessage)
    return false
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
