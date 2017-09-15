const fs = require('fs')
  ,commander = require('commander')
      .usage('[options] <globs ...>')
      .option('--source [source]', 'Source path')
      .option('--target [target]', 'Target file')
      .parse(process.argv)
  ,source = commander.source
  ,target = commander.target
  ,{readdir,read,save} = require(__dirname+'/utils')
  ,sLine = '.event.icon-name {  background-image: url(\'data:image/png;base64,file\'); }\n'
let contents = ''
readdir(source)
  .then(files=>{
    /*Promise.all(files.map(file=>read(sSrc+file).then(contents=>{file,contents})))
      .then(files=>{
        console.log('files[0]',files); // todo: remove log
      })*/
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