#!/usr/bin/env node
const inquirer = require('inquirer')
const chalk = require('chalk')
const util = require('util')
const download = util.promisify(require('download-git-repo'))
const figlet = util.promisify(require('figlet'))
const ora = require('ora')
const {program} = require('commander')
const clear = require('clear')
const {version} = require('./package.json')
const templates = {
    '基于pnpm+pnpm-workspace的monorepo预设': {
        url: 'github:ChuTingzj/monorepo-presets#master'
    },
    '基于pnpm+turborepo的monorepo预设':{
        url:'github:ChuTingzj/turborepo-presets#master'
    },
    '基于Vue3+TS的项目预设': {
        url: 'github:ChuTingzj/vue-ts#master'
    },
    '基于webpack+TS的项目预设': {
        url: 'github:ChuTingzj/webpack-ts-presets#main'
    },
    '基于create-t3-app生成的nextjs预设':{
        url: 'https://github.com/ChuTingzj/next-trpc-presets#origin'
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
                    choices: Object.keys(templates)
                }
            ])
            .then(async answers => {
                console.log('您选择了:', answers.template)
                let url = templates[answers.template.split(' ')[0]].url
                let proName = url.split('/')[1]
                const process = ora(`🚀正在下载...${answers.template}`)
                process.start()
                await download(url, `ChuTingzj/${proName}`, {clone: true}).catch(err => {
                    console.log(chalk.bold.redBright(err))
                })
                process.succeed()
                console.log(chalk.bold.green('✔下载成功,请在当前目录下的ChuTingzj目录中查看您的项目'))
            })
    })
program
    .command('ls')
    .description('check all templates')
    .action(() => {
        const arr = Object.keys(templates)
        arr.forEach(item => {
            console.log(chalk.bold.whiteBright(item))
        })
    })
program.parse(process.argv)
