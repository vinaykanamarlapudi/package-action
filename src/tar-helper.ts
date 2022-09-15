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

    await exec.exec(`touch ${tempDir}/archive.tar.gz`)
    const pathArray: string[] = path.trim().split(/\s+/)
    if (!isValidPath(pathArray)) {
      throw new Error(
        'Invalid path. Please ensure the path input has a valid path defined and separated by a space if you want multiple files/folders to be packaged.'
      )
    }
    const repoNwo: string = process.env.GITHUB_REPOSITORY || '';
    const repoParse = repoNwo.split('/')
    const repoName: string = repoParse[1]

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(`${tempDir}/${repoName}`);
    }

    pathArray.forEach(async(filePath) => {
      console.log(filePath)
      await fs.promises.cp(`${filePath}`,`${tempDir}/${repoName}`, {recursive: true})
      // await exec.exec(`cp -r ${filePath} ${tempDir}/${repoName}`)
    })
    
    // mkdir repo_name 
    // cp <contents of path> repo_name
    // tar -czf folder.tar.gz repo_name
    // tar -czf folder.tar.gz . <Wrong thing>

    const actionFileWithExtension = fs.existsSync('action.yml') ? 'action.yml' : 'action.yaml'
    if(!isActionYamlPresentInPathSrc(pathArray)){
      await fs.promises.copyFile(`${actionFileWithExtension}`,`${tempDir}/${repoName}`)
      // await exec.exec(`cp ${actionFileWithExtension} ${tempDir}/${repoName}`)
    }
    const traverse = `cd ${tempDir}`
    // const traverse = `cd -`
    await exec.exec(traverse)
    const cmd = `tar -czf archive.tar.gz ${repoName}`

    await exec.exec(cmd)
    core.info(`Tar ball created.`)
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
