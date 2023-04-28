import archiver from 'archiver'
import autoprefixer from 'autoprefixer'
import * as dotenv from 'dotenv'
import esbuild from 'esbuild'
import postcssPlugin from 'esbuild-style-plugin'
import fs from 'fs-extra'
import process from 'node:process'
import tailwindcss from 'tailwindcss'
import watPlugin from 'esbuild-plugin-wat'

dotenv.config()

const outdir = 'build'
const packagesDir = 'packages'
const appName = 'Glarity-'

const isDev = process.env.NODE_ENV === 'dev'

let buildConfig = {
  entryPoints: [
    'src/content-script/index.tsx',
    'src/background/index.ts',
    'src/options/index.tsx',
    'src/popup/index.tsx',
  ],
  bundle: true,
  outdir: outdir,
  treeShaking: true,
  minify: true,
  drop: ['console', 'debugger'],
  legalComments: 'none',
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  jsxFactory: 'h',
  jsxFragment: 'Fragment',
  jsx: 'automatic',
  loader: {
    '.png': 'dataurl',
    '.svg': 'dataurl',
  },
  plugins: [
    postcssPlugin({
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
    }),
    watPlugin(),
  ],
  external: ['src/pdf/*'],
}

if (isDev) {
  buildConfig = { ...buildConfig, ...{ minify: false, drop: [] } }
}

async function deleteOldDir() {
  await fs.remove(outdir)
}

async function runEsbuild() {
  await esbuild.build(buildConfig)
}

async function zipFolder(dir) {
  const output = fs.createWriteStream(`${dir}.zip`)
  const archive = archiver('zip', {
    zlib: { level: 9 },
  })
  archive.pipe(output)
  archive.directory(dir, false)
  await archive.finalize()
}

async function copyFiles(entryPoints, targetDir) {
  await fs.ensureDir(targetDir)
  await Promise.all(
    entryPoints.map(async (entryPoint) => {
      await fs.copy(entryPoint.src, `${targetDir}/${entryPoint.dst}`)
    }),
  )
}

async function build() {
  await deleteOldDir()
  await runEsbuild()

  const commonFiles = [
    { src: 'build/content-script/index.js', dst: 'content-script.js' },
    { src: 'build/content-script/index.css', dst: 'content-script.css' },
    { src: 'build/background/index.js', dst: 'background.js' },
    { src: 'build/options/index.js', dst: 'options.js' },
    { src: 'build/options/index.css', dst: 'options.css' },
    { src: 'src/options/index.html', dst: 'options.html' },
    { src: 'build/popup/index.js', dst: 'popup.js' },
    { src: 'build/popup/index.css', dst: 'popup.css' },
    { src: 'src/popup/index.html', dst: 'popup.html' },
    { src: 'src/assets/img/logo-16.png', dst: 'logo-16.png' },
    { src: 'src/assets/img/logo-32.png', dst: 'logo-32.png' },
    { src: 'src/assets/img/logo-48.png', dst: 'logo-48.png' },
    { src: 'src/assets/img/logo-128.png', dst: 'logo-128.png' },
    { src: 'src/assets/img/logo.png', dst: 'logo.png' },
    { src: 'src/_locales', dst: '_locales' },
    { src: 'src/pdf', dst: 'pdf' },
  ]

  // chromium
  await copyFiles(
    [...commonFiles, { src: 'src/manifest.json', dst: 'manifest.json' }],
    `./${outdir}/chromium`,
  )

  await zipFolder(`./${outdir}/chromium`)
  await copyFiles(
    [
      {
        src: `${outdir}/chromium.zip`,
        dst: `${appName}chromium.zip`,
      },
    ],
    `./${packagesDir}`,
  )

  await copyFiles(
    [
      {
        src: `${outdir}/chromium`,
        dst: `./chromium`,
      },
    ],
    `./${packagesDir}`,
  )

  // firefox
  await copyFiles(
    [...commonFiles, { src: 'src/manifest.v2.json', dst: 'manifest.json' }],
    `./${outdir}/firefox`,
  )

  await zipFolder(`./${outdir}/firefox`)
  await copyFiles(
    [
      {
        src: `${outdir}/firefox.zip`,
        dst: `${appName}firefox.zip`,
      },
    ],
    `./${packagesDir}`,
  )

  console.log('Build success.')
}

build()
