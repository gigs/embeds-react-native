const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')
const escape = require('escape-string-regexp')
const exclusionList = require('metro-config/src/defaults/exclusionList')
const pak = require('../package.json')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '..')
const modules = Object.keys({ ...pak.peerDependencies })

const config = getDefaultConfig(projectRoot)

config.watchFolders = [workspaceRoot]
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

// Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
// config.resolver.disableHierarchicalLookup = true;

module.exports = config
