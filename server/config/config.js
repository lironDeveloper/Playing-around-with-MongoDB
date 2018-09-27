var env = process.env.NODE_ENV || 'development';

if(env === 'development' || env === 'test') {

    // We will use a configuration file that wont be in the repository
    // For the env variables like port, API keys, mongodb uri
    // And more important and secret stuff
    var config = require('./config.json');

    // Grabing the proper properties according the env
    var envConfig = config[env];

    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}