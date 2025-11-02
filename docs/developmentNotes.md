# Development and Deployment Notes

## Table of Contents
1. [Introduction](#introduction)
2. [Development Notes](#development-notes)
    - [Setup](#setup)
    - [Coding Guidelines](#coding-guidelines)
    - [Known Issues](#known-issues)
3. [Publishing Notes](#publishing-notes)
    - [Build Process](#build-process)
    - [Publishing Steps](#publishing-steps)
    - [Post-Publishing Checklist](#post-publishing-checklist)
4. [References](#references)

---

## Introduction
This document provides guidelines and notes for the development and publishing of the extension. It is intended for developers and contributors to ensure a smooth workflow and consistent practices.

---

## Development Notes

### Setup
- Prerequisites
- Installation steps

### Coding Guidelines
- Code style
- Best practices

### Known Issues
- List of current issues

---

## Publishing Notes

### Build Process

#### Steps to build the project manually
to build the project, follow these steps:
1. run `npm install:all` to install all dependencies.
2. run `npm run build:all` to compile the TypeScript code.
3. ensure all tests pass with `npm test`.
4. package the extension using `npm run package`.
5. verify the package in the root directory.


### Publishing steps

### Publishing without GitHub Actions
Avoid manually publishing the extension. Instead, use the automated GitHub Actions workflow for consistency and reliability.

### Publishing with GitHub Actions
Merge the development branch into the main branch to trigger the GitHub Actions workflow. This will automatically build and publish the extension.

The workflow will:

1. Build the project.
2. Run tests.
3. Package the extension.
4. Publish the extension to the github release.
5. Upload the package to the Visual Studio Marketplace.

Before merging, ensure your azure token is not expired.

### Post-Publishing Checklist
- Verify the extension is available in the Visual Studio Marketplace.
- Check the GitHub release for the latest version.
- Update the documentation if necessary.

---

## References
- Links to additional resources or documentation