// typescript-eslint 8 needs the JS compiler API, which TypeScript 7 does not ship.
// Give the packages that peer on typescript their own TypeScript 6; tsc and vite use 7.
const TS6 = 'npm:typescript@^6.0.2'

function readPackage(pkg) {
  const peers = pkg.peerDependencies
  if (
    peers?.typescript &&
    (pkg.name === 'typescript-eslint' ||
      pkg.name === 'ts-api-utils' ||
      pkg.name.startsWith('@typescript-eslint/'))
  ) {
    delete peers.typescript
    pkg.dependencies = { ...pkg.dependencies, typescript: TS6 }
  }
  return pkg
}

module.exports = { hooks: { readPackage } }
