#!/usr/bin/env node
const inquirer = require('inquirer')
const chalk = require('chalk')
const util = require('util')
const download = util.promisify(require('download-git-repo'))
const figlet = util.promisify(require('figlet'))
const ora = require('ora')
const { program } = require('commander')
const clear = require('clear')
const { version } = require('./package.json')
const templates = {
  '基于Vue3+Pinia的小程序项目': {
    url: 'github:ChuTingzj/uni-shop'
  },
  '基于Vue3+TS+Pinia的头条项目': {
    url: 'github:ChuTingzj/vue-headline'
  },
  '基于React+TS+react-redux的后台管理项目': {
    url: 'github:ChuTingzj/react-back-stage-management'
  },
  '基于Vue3+TS的项目预设': {
    url: 'github:ChuTingzj/vue-ts'
  }
}
program.version(version)
program
  .command('init')
  .description('init project')
  .action(async () => {
    clear()
    const data = await figlet('Welcome ChuTing-Cli')
    console.log(chalk.bold.green(data))
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'template',
          message: '请选择其中一个项目模板:',
          choices: [
            '基于Vue3+Pinia的小程序项目',
            '基于Vue3+TS+Pinia的头条项目',
            '基于React+TS+react-redux的后台管理项目',
            '基于Vue3+TS的项目预设'
          ]
        }
      ])
      .then(async answers => {
        console.log('您选择了:', answers.template)
        let url = templates[answers.template.split(' ')[0]].url
        let proName = url.split('/')[1]
        const process = ora(`🚀正在下载...${answers.template}`)
        process.start()
        await download(url, `ChuTingzj/${proName}`, { clone: true }).catch(err => {
          console.log(chalk.bold.redBright(err))
        })
        process.succeed()
        console.log(chalk.bold.green('✔下载成功,请在当前目录下的ChuTingzj目录中查看您的项目'))
      })
  })
program.parse(process.argv)
