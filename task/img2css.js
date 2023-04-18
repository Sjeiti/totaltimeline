const fs = require('fs')
const commander = require('commander')
// import { Command } from 'commander';

const program = new commander.Command()
  .usage('[options] <globs ...>')
  .option('--source [source]', 'Source path')
  .option('--target [target]', 'Target file')
  .parse(process.argv)

const options = program.opts()
const source = options.source
const target = options.target

const {readdir, save} = require('./utils')
const sLine = '.event.icon-name {  background-image: url(\'data:image/png;base64,file\'); }\n'
let contents = ''


readdir(source)
  .then(files=>(console.log(files),files))
  .then(files=>{
    files.forEach(file=>{
      if (!fs.lstatSync(source+file).isDirectory()) {
        contents += sLine
          .replace('name',file.match(/^[^\.]+/).pop())
          .replace('file',fs.readFileSync(source+file).toString('base64'))
          .replace('png',file.match(/[^\.]+$/).pop())
        ;
      }
    })
  })
  .then(()=>{
    save(target,contents)
  })
