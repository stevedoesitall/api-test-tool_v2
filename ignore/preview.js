//Initializing preview API
const data_post = (data) => { 

    console.log("Preview API running...", data);

    const data_parse = JSON.parse(data);
    const email = data_parse.email;
    const template = data_parse.template;
    const api_key = data_parse.api_key;
    const api_secret = data_parse.api_secret;

    const sailthru = require("sailthru-client").createSailthruClient(api_key, api_secret);
    const fs = require("fs");

    sailthru.apiGet("preview", {
        template: template,
        email: email
    }, 
        function(err,response) {
            if (err) {
                console.log(err);
            }
            else if (response) {
                const html = response.content_html;
                fs.writeFileSync("./file_sync/template.html", html, function (err) {
                    if (err) throw err;
                    console.log("Saved!");
                });
            }
        }
    );   
}

module.exports = {
    data_post
};
