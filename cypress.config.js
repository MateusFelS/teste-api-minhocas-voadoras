require('dotenv').config();

module.exports = {
    e2e: {
        setupNodeEvents(on, config) {
            config.env.BASE_URL = process.env.BASE_URL;
            config.env.MANAGEMENT_TOKEN = process.env.MANAGEMENT_TOKEN;
            config.env.INVALID_TOKEN = process.env.INVALID_TOKEN;
            return config;
        }
    }
};
