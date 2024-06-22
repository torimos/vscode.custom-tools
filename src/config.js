const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function get_config_path() {
    const workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const configFilePath = path.join(workspacePath, '.vscode', 'custom-tools.json');
    if (fs.existsSync(configFilePath))
    {
        return configFilePath;
    }
    return;
}

function load_config(path) {
    if (fs.existsSync(path)) {
        const configFileContent = fs.readFileSync(path, 'utf8');
        try {
            return JSON.parse(configFileContent);
        } catch (error) {
        }
    }
    return;
}

function watch_config(callback) {
    let config_path = get_config_path();
    fs.unwatchFile(config_path);
    fs.watch(config_path, (eventType, path) => {
        if (config_path.endsWith(path) && eventType === 'change') {
            let cfg = load_config(config_path);
            if (cfg)
                callback(cfg);
        }
    });
    callback(load_config(config_path))
}


module.exports = {
    watch: watch_config
}