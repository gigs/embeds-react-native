const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')
const { generate } = require('@storybook/react-native/scripts/generate')
const escape = require('escape-string-regexp')
const exclusionList = require('metro-config/src/defaults/exclusionList')
const pak = require('../package.json')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '..')
const modules = Object.keys({ ...pak.peerDependencies })

generate({
  configPath: path.resolve(__dirname, './.ondevice'),
})

const config = getDefaultConfig(__dirname)

console.log('yes!')

config.transformer.unstable_allowRequireContext = true
config.watchFolders = [...config.watchFolders, './.storybook', workspaceRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]
config.resolver.blacklistRE = exclusionList(
  modules.map(
    (m) =>
      new RegExp(
        `^${escape(path.join(workspaceRoot, 'node_modules', m))}\\/.*$`
      )
  )
)
config.resolver.extraNodeModules = modules.reduce((acc, name) => {
  acc[name] = path.join(__dirname, 'node_modules', name)
  return acc
}, {})

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const defaultResolveResult = context.resolveRequest(
    context,
    moduleName,
    platform
  )

  return defaultResolveResult
}

module.exports = config
