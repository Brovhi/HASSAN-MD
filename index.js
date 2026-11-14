const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const CFonts = require('cfonts');
const package = require('./package.json');

// 🎨 STARTUP BANNER (Terminal mein dikhega)
CFonts.say('HaSSaN BrOvHi MD', {
    colors: ['#ff33cc', '#f2aa4c'],
    font: 'block',
    align: 'center'
});

CFonts.say(`By HaSSaN BrOvHi`, {
    colors: ['#ff33cc'],
    font: 'console',
    align: 'center'
});

var isRunning = false;

function start(script) {
    if (isRunning) return;
    isRunning = true;

    let args = [path.join(__dirname, script), ...process.argv.slice(2)];

    // Terminal mein command show karein
    CFonts.say([process.argv[0], ...args].join(' '), {
        colors: ['#f2aa4c'],
        font: 'console',
        align: 'center'
    });

    // main.js ko run karein
    let p = spawn(process.argv[0], args, {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc']
    });

    // Agar bot crash ho jaye toh auto-restart
    p.on('exit', (code) => {
        isRunning = false;
        console.log('Exited with code:', code);
        if (code === 0) return;

        fs.watchFile(args[0], () => {
            fs.unwatchFile(args[0]);
            start(script);
        });
    });

    // Bot ke messages handle karein (uptime, reset, etc.)
    p.on('message', (msg) => {
        if (msg === 'reset') {
            p.kill();
            isRunning = false;
            start(script);
        } else if (msg === 'uptime') {
            p.send(process.uptime());
        }
    });
}

// Bot ko main.js se start karein
start('main.js');
