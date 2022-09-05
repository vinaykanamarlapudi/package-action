import * as core from '@actions/core'
import * as fs from 'fs' 
function removeTarArchive(){
    const path = './tmp/archive.tar.gz'
    try {
        fs.unlinkSync(path)
        core.info(`Archive cleanup done!`)
    } catch(err) {
        console.log(err)
    }
}
removeTarArchive()