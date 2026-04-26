const fs = require('fs-extra')
const os = require('os')
const path = require('path')

const {
    javaExecFromRoot,
    validateSelectedJvm
} = require('helios-core/java')

function getSupportedJavaRange(effectiveJavaOptions) {
    if(effectiveJavaOptions.suggestedMajor === 21 && effectiveJavaOptions.supported.startsWith('>=21')) {
        return '21.x'
    }

    return effectiveJavaOptions.supported
}

async function findMiseJvmInstallation(effectiveJavaOptions) {
    const javaRootDirs = getMiseJavaInstallDirs()
    const supportedRange = getSupportedJavaRange(effectiveJavaOptions)

    for(const javaRootDir of javaRootDirs) {
        if(!await fs.pathExists(javaRootDir)) {
            continue
        }

        const entries = await fs.readdir(javaRootDir)
        const candidates = entries
            .map(entry => path.join(javaRootDir, entry))
            .filter(candidate => fs.pathExistsSync(javaExecFromRoot(candidate)))

        for(const candidate of candidates) {
            const details = await validateSelectedJvm(candidate, supportedRange)
            if(details != null) {
                return details
            }
        }
    }

    return null
}

function getMiseJavaInstallDirs() {
    const dirs = []

    if(process.env.MISE_DATA_DIR != null) {
        dirs.push(path.join(process.env.MISE_DATA_DIR, 'installs', 'java'))
    }

    if(process.env.XDG_DATA_HOME != null) {
        dirs.push(path.join(process.env.XDG_DATA_HOME, 'mise', 'installs', 'java'))
    }

    dirs.push(path.join(os.homedir(), '.local', 'share', 'mise', 'installs', 'java'))

    return [...new Set(dirs)]
}

module.exports = {
    findMiseJvmInstallation,
    getSupportedJavaRange
}
