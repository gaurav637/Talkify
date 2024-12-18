const Sib = require("sib-api-v3-sdk");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

module.exports = () => {
    const client = Sib.ApiClient.instance;
    
    // Set the API key from environment variables
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.MAIL_API_KEY;

    // Get the transactional email API instance
    const tranEmailApi = new Sib.TransactionalEmailsApi();

    return tranEmailApi; // Make sure you return the correct API instance
};
