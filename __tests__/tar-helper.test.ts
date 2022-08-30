import * as core from '@actions/core'
import * as fs from 'fs'
import * as tarHelper from '../src/tar-helper'

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

  it('has successfully created a tar.gzip with default workdir input', async () => {
    let inputs = {
      workdir: '.'
    } as any

    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      return inputs[name]
    })
    const workdir = core.getInput('workdir')
    fs.existsSync('./archive.tar.gz') == false
    await tarHelper.createTarBall(workdir)
    fs.existsSync('./archive.tar.gz') == true
    expect(core.setFailed).not.toHaveBeenCalled()
    expect(core.info).toHaveBeenCalledWith('Tar ball created.')
  }, 30000)

  it('has successfully created a tar.gzip with custom workdir input', async () => {
    let inputs = {
      workdir: 'dist/ action.yml'
    } as any

    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      return inputs[name]
    })
    const workdir = core.getInput('workdir')
    fs.existsSync('./archive.tar.gz') == false
    await tarHelper.createTarBall(workdir)
    fs.existsSync('./archive.tar.gz') == true
    expect(core.setFailed).not.toHaveBeenCalled()
    expect(core.info).toHaveBeenCalledWith('Tar ball created.')
  }, 30000)

  it('has not created a tar.gzip with default workdir input', () => {
    const workdir = '.'
    fs.existsSync('./archive.tar.gz') == false
    expect(core.setFailed).not.toHaveBeenCalled()
    expect(core.info).not.toHaveBeenCalled()
  })

  it('has not created a tar.gzip with custom workdir input', () => {
    const workdir = 'dist/ action.yml'
    fs.existsSync('./archive.tar.gz') == false
    expect(core.setFailed).not.toHaveBeenCalled()
    expect(core.info).not.toHaveBeenCalled()
  })
})
