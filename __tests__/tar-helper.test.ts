import * as core from '@actions/core'
import * as fs from 'fs'
import {createTarBall, isActionYamlPresentInPathSrc, isValidPath} from '../src/tar-helper'

describe('Tar create', () => {
  beforeAll(() => {
    jest.spyOn(core, 'setFailed').mockImplementation(param => {
      return param
    })
    // Mock error/warning/info/debug
    jest.spyOn(core, 'error').mockImplementation(jest.fn())
    jest.spyOn(core, 'warning').mockImplementation(jest.fn())
    jest.spyOn(core, 'info').mockImplementation(jest.fn())
    jest.spyOn(core, 'debug').mockImplementation(jest.fn())
  })

  it('has successfully created a tar.gzip with default path input', async () => {
    let inputs = {
      path: '.'
    } as any

    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      return inputs[name]
    })
    const path = core.getInput('path')
    fs.existsSync('./archive.tar.gz') == false
    await createTarBall(path)
    fs.existsSync('./archive.tar.gz') == true
    expect(core.setFailed).not.toHaveBeenCalled()
    expect(core.info).toHaveBeenCalledWith('Tar ball created.')
  }, 35000)

  it('has successfully created a tar.gzip with custom path input', async () => {
    let inputs = {
      path: 'dist/ action.yml'
    } as any

    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      return inputs[name]
    })
    const path = core.getInput('path')
    fs.existsSync('./archive.tar.gz') == false
    await createTarBall(path)
    fs.existsSync('./archive.tar.gz') == true
    expect(core.setFailed).not.toHaveBeenCalled()
    expect(core.info).toHaveBeenCalledWith('Tar ball created.')
  }, 30000)

  it('has not created a tar.gzip with default path input', () => {
    const path = '.'
    fs.existsSync('./archive.tar.gz') == false
    expect(core.setFailed).not.toHaveBeenCalled()
    expect(core.info).not.toHaveBeenCalled()
  })

  it('has not created a tar.gzip with custom path input', () => {
    const path = 'dist/ action.yml'
    fs.existsSync('./archive.tar.gz') == false
    expect(core.setFailed).not.toHaveBeenCalled()
    expect(core.info).not.toHaveBeenCalled()
  })

  it('throws Error with invalid path input', async() => {
    let inputs = {
      path: 'disty/ action.yaml'
    } as any

    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      return inputs[name]
    })
    const path = core.getInput('path')
  
    await createTarBall(path)
    
    expect(core.setFailed).toHaveBeenCalledWith(
      'Creation of tarball failed! Invalid path. Please ensure the path input has a valid path defined and separated by a space if you want multiple files/folders to be packaged.'
    )
    expect(core.info).not.toHaveBeenCalled()
  }, 30000)
})

describe('Tar creation path isValidPath', () => {
  it('is a valid custom pathname', () => {
    const path = ['dist/', 'action.yml']
    expect(isValidPath(path)).toBeTruthy();
  })
  it('is a valid custom pathname', () => {
    const path = ['.']
    expect(isValidPath(path)).toBeTruthy();
  })
  it('is an invalid custom pathname', () => { 
    const path = ['distyy']
    expect(isValidPath(path)).toBeFalsy();
  })
})

describe('isActionYamlPresentInPathSrc returns', () => {
  it('true if action yml is present in src', () => {
    const path = ['dist', 'action.yml']
    expect(isActionYamlPresentInPathSrc(path)).toBeTruthy();
  })
  it('true if action yml is present in src', () => {
    const path = ['.']
    expect(isActionYamlPresentInPathSrc(path)).toBeTruthy();
  })
  it('false if action yml is not present in src', () => {
    const path = ['src']
    expect(isActionYamlPresentInPathSrc(path)).toBeFalsy();
  })
})
