const Discord = require('discord.js')
const client = new Discord.Client()
const { spawn } = require('promisify-child-process')

client.on('ready', () => console.log(`Logged in as ${client.user.tag}!`))

client.on('message', async m => {
    console.log(m.content)
    if (m.content.startsWith(':t ')) {
        const expr = m.content.slice(3)
        m.channel.send(`Input: \`\`\`haskell\n${expr}\`\`\` Type: \`\`\`haskell\n${await typeOfExpr(expr)}\`\`\``)
    }
    if (m.content.startsWith('hs> ')) {
        const expr = m.content.slice(4)
        m.channel.send(`Input: \`\`\`haskell\n${expr}\`\`\` Output: \`\`\`haskell\n${await evalExpr(expr)}\`\`\``)
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

client.login(process.env.DISCORD_TOKEN)