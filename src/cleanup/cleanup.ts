
import * as fs from 'fs' 
function removeTarArchive(){
    const path = './tmp/archive.tar.gz'
    try {
        fs.unlinkSync(path)
        console.log(`Archive cleanup done!`)
    } catch(err) {
        console.log(err)
    }
}
removeTarArchive()