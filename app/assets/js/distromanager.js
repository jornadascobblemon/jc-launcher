const { DistributionAPI } = require('helios-core/common')

const ConfigManager = require('./configmanager')

// Old WesterosCraft url.
// exports.REMOTE_DISTRO_URL = 'http://mc.westeroscraft.com/WesterosCraftLauncher/distribution.json'
exports.REMOTE_DISTRO_URL = 'https://jornadascobblemon.wstr.fr/distribution.json'

const api = new DistributionAPI(
    ConfigManager.getLauncherDirectory(),
    null, // Injected forcefully by the preloader.
    null, // Injected forcefully by the preloader.
    exports.REMOTE_DISTRO_URL,
    false
)

const pullRemote = api.pullRemote.bind(api)
api.pullRemote = async () => {
    return await Promise.race([
        pullRemote(),
        new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    data: null,
                    responseStatus: 'TIMEOUT'
                })
            }, 5000)
        })
    ])
}

exports.DistroAPI = api
