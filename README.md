# Incom to pdf

This project consumes incom projects exported via the incom export feature and generated pdf files from it.

## Getting started

- `npm install` will install all dependencies of the project

## Prerequisite

- Create a `in` folder in the `src` folder that contains all the projects that should be converted to pdf, e.g.: `src/in/Incom project_3215`
- Create a `out` folder in the `src` folder. This folder will be used to save all the generated pdf files

> Note: `in` and `out` folder are both on `.gitignore` to not polute the repository with all the content that is being generated.

## How to use

- `npm start` will start the pdf generation

The script will read all folders within the `src/in` folder. Each folder is expected to contain exactly __1__ `.json`-file and __1__ `media`-folder. The terminal will show you information about the progress of the script.
