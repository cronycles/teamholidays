var exec = require('child_process').exec;
exec('npm run run:server', {windowsHide: true});
exec('npm run run:local-sshlegacy', {windowsHide: true});