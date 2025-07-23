module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer', // analyse des types de commits (feat, fix, etc.)
    '@semantic-release/release-notes-generator', // génération du changelog
    '@semantic-release/changelog', // met à jour CHANGELOG.md
    '@semantic-release/npm', // met à jour package.json
    '@semantic-release/git', // commit les fichiers modifiés (package.json, changelog, etc.)
  ],
};