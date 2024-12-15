module.exports = {
  branches: [
    {
      name: 'main',
      channel: 'latest',
    },
    {
      name: 'develop',
      prerelease: 'alpha',
      channel: 'canary',
    },
  ],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        "preset": "angular",
        "releaseRules": [
          { "type": "config", "release": "patch" },
        ]
      }
    ],
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        changelogTitle: "# Release notes",
        changelogFile: "docs/CHANGELOG.md",
      },
    ],
    [
			'@semantic-release/npm',
			{
				npmPublish: false,
			},
		],
    [
        "semantic-release-vsce",
        {
          packageVsix: true,
          publish: false
        }
    ],
    [
      "@semantic-release/github",
      {
        assets: [
          { path: "./*.vsix" },
        ],
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: ["docs/CHANGELOG.md", "package.json"],
      },
    ],
  ],
};
