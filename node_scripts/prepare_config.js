yml = require('yaml-env-defaults');
FS = require("fs")
path= require("path")
// Read one yaml file synchronysly
const config = yml.readYamlEnvSync(path.resolve(__dirname, '../config/web_config.yml'));


FS.writeFileSync(path.resolve(__dirname, "../public/config/config.json"), JSON.stringify(config, null,1))
