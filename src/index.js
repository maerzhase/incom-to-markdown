import fs from "fs"
import path from "path"
import {mdToPdf} from "md-to-pdf"
import chalk from "chalk"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const IMPORT_PATH = path.join(__dirname, "in")

function getDirectories(filePath) {
  return fs
    .readdirSync(filePath, { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .map((dir) => dir.name)
}

function findJsonFile(filePath) {
  const files = fs
    .readdirSync(filePath, { withFileTypes: true })
    .filter((dir) => dir.isFile())
    .filter((file) => path.extname(file.name) === ".json")?.[0].name
  return files
}

function parsePost(post) {
  const { title, text, media } = post
  let md = ""
  if (title && title !== "") {
    md += `## ${title} \n`
  }
  if (text && text !== "") {
    md += `${text}`
  }
  if (media && media.length > 0) {
    media.map((file) => {
      const { filename, preview, type } = file
      if (type === "file") {
        const splittedPreview = preview.split("/")
        const id = splittedPreview[splittedPreview.length - 1]
        const actualFile = encodeURIComponent(`${id}-${filename}`)
        md += `![${filename}](${actualFile})\n`
      } else {
        md += `[LINK TO: ${filename}](${filename})\n`
      }
    })
  }
  return `${md}\n`
}

async function main() {
  console.log(chalk.inverse("              "))
  console.log(chalk.inverse(" Incom to pdf "))
  console.log(chalk.inverse("              \n"))
  console.log("Reading projects from folder:")
  console.log(chalk.dim(IMPORT_PATH))
  const inDirectories = getDirectories(IMPORT_PATH)
  console.log("Found " + chalk.bold(inDirectories.length) + " Project(s)")
  console.log()
  inDirectories.forEach(async (inDir, index) => {
    const projectPath = path.join(IMPORT_PATH, inDir)
    const jsonFile = findJsonFile(projectPath)
    console.log("Start pdf generation of project " + chalk.bold(`${index + 1}`) + `/${inDirectories.length}`)
    const jsonPath = path.join(projectPath, jsonFile)
    console.log(chalk.dim(jsonPath))
    console.log()
    const rawJson = fs.readFileSync(jsonPath)
    const parsedJson = JSON.parse(rawJson).response
    console.log("Parsing markdown from json file")
    const postsMarkdown = parsedJson.posts
      .map((post) => parsePost(post))
      .join(`\n`)
    const markdown = `# ${parsedJson.title}\n\n Authors: ${parsedJson.authors
      .map((a) => a.name)
      .join(", ")}\n\n Supervisors: ${parsedJson.supervisors
      .map((a) => a.name)
      .join(", ")}\n\n Timeframe: ${parsedJson.timeframe.info} | ${new Date(
      parsedJson.timeframe.start * 1000
    ).toLocaleDateString()} - ${new Date(
      parsedJson.timeframe.end * 1000
    ).toLocaleDateString()}\n\n${postsMarkdown}
    `
    console.log(chalk.green.bold("✓ Markdown successfully parsed! Starting pdf generation."))
    const outDir = path.join(__dirname, "out", `${inDir}.pdf`)
    await mdToPdf(
      { content: markdown,  },
      {
        dest: outDir,
        css: `img { max-width: 66%; }`, 
        basedir: path.join(IMPORT_PATH, inDir, "media"),
      }
    )
    console.log(chalk.green.bold("✓ PDF-File generated"))
    console.log(chalk.dim(outDir))
    console.log()
  })
}

main()
