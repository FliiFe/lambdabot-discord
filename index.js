const Discord = require('discord.js')
const client = new Discord.Client()
const { spawn } = require('promisify-child-process')
const fs = require('fs')
const touch = require('touch')
touch('./.token')

client.on('ready', () => console.log(`Logged in as ${client.user.tag}!`))

client.on('message', async m => {
    // console.log(m.content)
    if (m.content.startsWith(':t ')) {
        const expr = m.content.slice(3)
        m.channel.send(`Input: \`\`\`haskell\n${expr}\`\`\` Type: \`\`\`haskell\n${await typeOfExpr(expr)}\`\`\``)
    }
    if (m.content.startsWith('hs> ')) {
        const expr = m.content.slice(4)
        m.channel.send(`Input: \`\`\`haskell\n${expr}\`\`\` Output: \`\`\`haskell\n${await evalExpr(expr)}\`\`\``)
    }
    if(m.content.startsWith(':hoogle ')) {
        const expr = m.content.slice(8)
        m.channel.send(`Results:\`\`\`haskell\n${await hoogle(expr)}\n\`\`\``)
    }
})

async function runMueval(expr, args) {
    console.log(expr, args)
    const { stdout, code } = await spawn('mueval', args.concat(['-e', expr]), { encoding: 'utf8' }).catch(e => e)
    return {stdout, code}
}

async function typeOfExpr(expr) {
    const {stdout: out, code} = await runMueval(expr, ['-Ti'])
    return code ? out : out.slice(expr.length + 1)
}

async function evalExpr(expr) {
    const {stdout: out} = await runMueval(expr, ['-t', '10'])
    return out
}

async function hoogle(expr) {
    console.log('hoogling', expr)
    const {stdout} = await spawn('hoogle', ['--', expr], {encoding: 'utf8'}).catch(e => e)
    return stdout.replace(/^--.*$/mg, '')
}

client.login(fs.readFileSync('./.token', 'utf8') || process.env.DISCORD_TOKEN)
