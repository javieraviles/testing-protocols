const { spawnSync } = require('child_process');
function exec(serviceName, command, cwd){
console.log(`Installing dependencies for [${serviceName}]`);
console.log(`Folder: ${cwd} Command: ${command}`);
spawnSync(command, [], { cwd, shell: true, stdio: 'inherit' });
}
exec('externalservice', 'mvn install', './externalservice');
exec('server','npm install', './server');
exec('worker','mvn install', './worker');