//Initializing event API
const data_post = (data) => { 

    console.log("Blast API running...", data);

    const data_parse = JSON.parse(data);
    const api_key = data_parse.api_key;
    const api_secret = data_parse.api_secret;
    const vars = {};
        vars.author = data_parse.author;
        vars.url = data_parse.url;
        vars.description = data_parse.description;
        vars.title = data_parse.title;
    const timestamp = new Date().getTime();

    //Sailthru variables
    const sailthru = require("sailthru-client").createSailthruClient(api_key, api_secret);

    sailthru.apiPost("blast", {
        name: "Breaking Alert " + timestamp,
        list: "Breaking Alerts",
        copy_template: "Breaking Alert",
        schedule_time: "now",
        vars: vars
    },
        function(err,response) {
            if (err) {
                console.log(err);
            }
            else if (response) {
                console.log(response);
            }
        }
    );
}

module.exports = {
    data_post
};