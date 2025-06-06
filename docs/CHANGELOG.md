# Release notes

## [0.8.3](https://github.com/gverduci/c64basicv2/compare/v0.8.2...v0.8.3) (2025-06-07)


### Bug Fixes

* [#12](https://github.com/gverduci/c64basicv2/issues/12) removed useEffect dependency that was blocking drawing ([#13](https://github.com/gverduci/c64basicv2/issues/13)) ([d1900e7](https://github.com/gverduci/c64basicv2/commit/d1900e74391ab38625d77c9eeab3fbd17e2a428d))
* [#14](https://github.com/gverduci/c64basicv2/issues/14) Ensure output path is handled when workspace folder is missing ([eda33fd](https://github.com/gverduci/c64basicv2/commit/eda33fdf601d9e1243ae772abfa43fa33c5ec896))
* add package-lock.json ([03dbb9f](https://github.com/gverduci/c64basicv2/commit/03dbb9f9ef31a67a8778be8ca77fdc06e9f0ad4b))
* add package-lock.json ([7d593bc](https://github.com/gverduci/c64basicv2/commit/7d593bcf8e36c5906a68536815b647f81b0280a9))
* update poke command from 's+' to 'v+' in TabOccurrenceGrid and enhance README with VIC view details ([21e3b0e](https://github.com/gverduci/c64basicv2/commit/21e3b0e4bce73c5ec1671aaff22c7aba7c84bffd))
* vsix file too big and without vic ([3bfed0b](https://github.com/gverduci/c64basicv2/commit/3bfed0b9964a840e5532b1a442b93a63cd5ac567))

## [0.8.3-alpha.5](https://github.com/gverduci/c64basicv2/compare/v0.8.3-alpha.4...v0.8.3-alpha.5) (2025-06-05)


### Bug Fixes

* [#14](https://github.com/gverduci/c64basicv2/issues/14) Ensure output path is handled when workspace folder is missing ([eda33fd](https://github.com/gverduci/c64basicv2/commit/eda33fdf601d9e1243ae772abfa43fa33c5ec896))

## [0.8.3-alpha.4](https://github.com/gverduci/c64basicv2/compare/v0.8.3-alpha.3...v0.8.3-alpha.4) (2024-12-18)


### Bug Fixes

* update poke command from 's+' to 'v+' in TabOccurrenceGrid and enhance README with VIC view details ([21e3b0e](https://github.com/gverduci/c64basicv2/commit/21e3b0e4bce73c5ec1671aaff22c7aba7c84bffd))

## [0.8.3-alpha.3](https://github.com/gverduci/c64basicv2/compare/v0.8.3-alpha.2...v0.8.3-alpha.3) (2024-12-18)


### Bug Fixes

* [#12](https://github.com/gverduci/c64basicv2/issues/12) removed useEffect dependency that was blocking drawing ([#13](https://github.com/gverduci/c64basicv2/issues/13)) ([d1900e7](https://github.com/gverduci/c64basicv2/commit/d1900e74391ab38625d77c9eeab3fbd17e2a428d))

## [0.8.3-alpha.2](https://github.com/gverduci/c64basicv2/compare/v0.8.3-alpha.1...v0.8.3-alpha.2) (2024-12-15)


### Bug Fixes

* add package-lock.json ([03dbb9f](https://github.com/gverduci/c64basicv2/commit/03dbb9f9ef31a67a8778be8ca77fdc06e9f0ad4b))
* add package-lock.json ([7d593bc](https://github.com/gverduci/c64basicv2/commit/7d593bcf8e36c5906a68536815b647f81b0280a9))
* vsix file too big and without vic ([3bfed0b](https://github.com/gverduci/c64basicv2/commit/3bfed0b9964a840e5532b1a442b93a63cd5ac567))

## [0.8.3-alpha.1](https://github.com/gverduci/c64basicv2/compare/v0.8.2...v0.8.3-alpha.1) (2024-12-15)

## [0.8.2](https://github.com/gverduci/c64basicv2/compare/v0.8.1...v0.8.2) (2024-12-15)

## 0.8.0 (14/12/2024)

- [VIC View] Added VIC view in the Primary Sidebar: registry, sprite/char editor

## 0.7.1 (25/06/2023)

- [SID View] Added SID view in the Primary Sidebar: registry, ADSR, notes
- [Character View] Added Character view on the Primary Sidebar: symbolic syntax, chr$ command

## 0.6.8 (01/05/2022)

- [Commands] other path fix (windows/linux path with spaces)

## 0.6.7 (01/05/2022)

- [Commands] fix #3 Windows (Path) support

## 0.6.5 (01/05/2022)

- [Diagnostics] fix

## 0.6.2 (01/05/2022)

- [Diagnostics] Added check line start with a number
- [Automatic Proofreader] Disabled by default
- [Automatic Proofreader] Added control character support

## 0.6.1 (24/04/2022)

- [Diagnostics] Added "enableDiagnostics" configuration property
- [Diagnostics] Fix [Issue #1](https://github.com/gverduci/c64basicv2/issues/1): check lines containing control character
- [Commands] Fix [Issue #2](https://github.com/gverduci/c64basicv2/issues/2): renamed "showDiagnostics" configuration property to "showCommandLogs"

## 0.6.0 (22/04/2022)

- [Diagnostics] Added diagnostic: line too long

## 0.5.1 (22/04/2022)

- [Decorator] Fix: inline Automatic Proofreader only with c64basicv2 files

## 0.5.0 (21/04/2022)

- [Decorator] Added inline Automatic Proofreader

## 0.4.1 (10/04/2022)

- [Commands] Fix "Convert" and "Convert and Run" commands (windows)

## 0.4.0 (10/04/2022)

- [Commands] Added "Convert" and "Convert and Run" commands
- [Keyboard Shortcuts] Added keyboard shortcuts for commands

## 0.3.5 (05/04/2022)

- [Syntax highlighting] Removed word boundary controls to support lines with keywords without separators. Ex: 350 ifx=1thenprintchr$(18);

## 0.3.0 (05/04/2022)

- other snippets synonyms
- Automatic Proofreader command (beta)

## 0.2.0 (03/04/2022)

- fix and enhancement

## 0.1.1 (02/04/2022)

- Initial release
