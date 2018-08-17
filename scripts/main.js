import {get_id, get_class, qsa, parse, string, cl, headers, create_el} from "./squery.js";

document.addEventListener("DOMContentLoaded", function() {
    const user_lists = [];
    const non_master_lists = [];
    const master_lists = [];
    const master_lists_sorted = [];
    const send_templates = [];
    let all_lists = []

function clear_array() {
    user_lists.length = 0;
    non_master_lists.length = 0;
    master_lists.length = 0;
    master_lists_sorted.length = 0;
    send_templates.length = 0;
    all_lists.length = 0;
}

const get_data = ( function() {
    clear_array();
    fetch("/server", {
        method: "post",
        headers: headers,
        body: string({id : "lists", data : "{}"})
    })
    .then(
        function(response) {
            if (response.status != 200) {
                cl("Error: " + response.status);
                return;
            }
            response.json().then(
                function(resp_data) {
                const status = "active";
                const list_convention = "Master List ";
                const list_length = list_convention.length;    
                const data_lists = resp_data.lists;
                data_lists.forEach(list => {
                    if (list.vars && list.vars.status == status) {
                        user_lists.push({"name": list.name});
                    }
                });

                user_lists.sort(function(a, b) {
                    const text_a = a.name.toUpperCase();
                    const text_b = b.name.toUpperCase();
                    return (text_a < text_b) ? -1 : (text_a > text_b) ? 1 : 0;
                });

                user_lists.forEach(list => {
                    const list_name = list.name;
                    if (list_name.indexOf(list_convention) == -1) {
                        non_master_lists.push(list_name);
                    }
                    else {
                        const master_list = parseInt(list_name.substr(list_name.indexOf(list_convention)+list_length));
                        master_lists.push(master_list);
                    }
                });

                master_lists.sort(function(a, b) {
                    return a - b
                });

                master_lists.forEach(list_num => {
                    master_lists_sorted.push(`${list_convention} ${list_num}`);
                });
                

                all_lists = non_master_lists.concat(master_lists_sorted);

                const lists_list = get_id("user_lists");
                cl(all_lists);
                if (!lists_list.length > 0) {
                    all_lists.forEach(list => {
                        const option = create_el("option");
                        option.innerHTML = list;
                        get_id("user_lists").appendChild(option);
                    });
                }

                get_id("retr_lists").classList.add("recs_message");
                get_id("user_dropdown").classList.remove("dropdown");
            })
        })
        .catch(error => cl(error) );
    
        fetch("/server", {
            method: "post",
            headers: headers,
            body: string({id : "templates", data : "{}"})
        })
        .then(
            function(response) {
                if (response.status != 200) {
                    cl("Error: " + response.status);
                    return;
                }
                response.json().then(
                    function(resp_data) {
                    const label = "testers";
                    const all_templates = resp_data.templates;
                    all_templates.forEach(template => {
                        if (template.labels && template.labels.includes(label)) {
                            send_templates.push({"name": template.name});
                        }
                    });
    
                    send_templates.sort(function(a, b) {
                        const text_a = a.name.toUpperCase();
                        const text_b = b.name.toUpperCase();
                        return (text_a < text_b) ? -1 : (text_a > text_b) ? 1 : 0;
                    });
    
                    cl(send_templates);
    
                    const template_list =  get_id("send_templates");
                    if (!template_list.length > 0) {
                        send_templates.forEach(template => {
                            const option = create_el("option");
                            option.innerHTML = template.name;
                            get_id("send_templates").appendChild(option);
                        });
                    }
                })
            })
            .catch(error => cl(error) );
    get_id("retr_templates").classList.add("recs_message");
    get_id("send_dropdown").classList.remove("dropdown");

} () );


    const content_blocks = qsa(".content_block");

    content_blocks.forEach(content => {
        content.style.display = "none";
    }); 

    document.addEventListener("click", function get_content(event) {
        if (event.target.classList.contains("select_button")) {
            cl(event.target.id);
            const button = event.target;
            get_id("recs_list").innerHTML = "";
            content_blocks.forEach(content => {
                if (content.id == button.id + "_post") {
                    content.style.display = "";
                }
                else {
                    content.style.display = "none";
                }
            });
        }
    }, false);

    get_id("send_submit").addEventListener("click", function submit_form() {
        const id = "send";
            cl(id + ".js script initiated.");
        let email = get_id("send_email").value;
        const template = get_id("send_templates").value;
        const send_var = get_id("send_var").value;
        const send_val = get_id("send_val").value;
        const send_cc = get_id("send_cc").value;
        const send_bcc = get_id("send_bcc").value;
        const send_replyto = get_id("send_replyto").value;
        const send_behalfof = get_id("send_behalfof").value;
    
        if (email == "s") {
            email = "steve@sailthru.com";
        }
        
        if (email == "") {
            alert("Please enter an email address.");
            return false;
        }
        else if (email.indexOf("@") == -1) {
            alert(email + " is not a valid email address.");
            return false;
        }
    
        else if (template == "") {
            alert("Please select a template.");
            return false;
        }
    
        else {
            const data = {};
            data.email = email;
            data.template = template;
    
            if (send_var && send_val) {
                data.var_name = send_var;
                data.var_val = send_val;
            }
            if (send_var && !send_val) {
                alert("Please enter a value for " + send_var + ".");
                return false;
            }
            
            if (!send_var && send_val) {
                alert("Please enter a value for " + send_val + ".");
                return false;
            }
    
            if (send_cc.length > 0 && send_cc.indexOf("@") == -1) {
                alert(send_cc + " is not a valid email address for CC Email.");
                return false;
            }
            else if (send_cc.length > 0) {
                data.cc_val = send_cc;
            }
    
            if (send_bcc.length > 0 && send_bcc.indexOf("@") == -1) {
                alert(send_bcc + " is not a valid email address for BCC Email.");
                return false;
            }
            else if (send_bcc.length > 0) {
                data.bcc_val = send_bcc;
            }
    
            if (send_replyto.length > 0 && send_replyto.indexOf("@") == -1) {
                alert(send_replyto + " is not a valid email address for Reply-To Email.");
                return false;
            }
            else if (send_replyto.length > 0) {
                data.replyto_val = send_replyto;
            }
    
            if (send_behalfof.length > 0 && send_behalfof.indexOf("@") == -1) {
                alert(send_behalfof + " is not a valid email address for Behalf Of Email.");
                return false;
            }
            else if (send_behalfof.length > 0) {
                data.behalfof_val = send_behalfof;
            }
    
        const data_string = string(data);
    
        alert(email + " has been sent " + template);
    
        cl("Send API running...", data);
    
        fetch("/server", {
            method: "post",
            headers: headers,
            body: string({id : id, data : data_string})
        })
        .then(
            function(response) {
            if (response.status != 200) {
                cl("Error: " + response.status);
                return;
            }
            response.json().then(
                function(resp_data) {
                    cl(resp_data);
                })
            })
            .catch(error => cl(error) );
        }
    });

    get_id("user_submit").addEventListener("click", function submit_form() {
        
        const id = "user";
            cl(id + ".js script initiated.");
        const email = get_id("user_email").value;
        const list = get_id("user_lists").value;
        const user_var = get_id("user_var").value;
        const user_val = get_id("user_val").value;
        const user_status = get_id("user_status").value;
    
        const keys_length = get_class("user_keys");
        const keys = qsa(".user_keys");
    
        let locale = window.navigator.language;
            locale = locale.replace("-","_");

        if (email == "") {
            alert("Please enter an email address.");
            return false;
        }
        else if (email.indexOf("@") == -1) {
            alert(email + " is not a valid email address.");
            return false;
        }
    
        else if (list == "") {
            alert("Please enter a list.");
            return false;
        }
    
        else {
            alert(email + " has been added to " + list);
            const data = {};
            data.email = email;
            data.list = list;
            data.status = user_status;
            data.vars = {};
            data.vars.locale = locale;
    
            if (user_var && user_val) {
                data.vars[user_var] = user_val;
            }
            if (user_var && !user_val) {
                alert("Please enter a value for " + user_var + ".");
                return false;
            }
            if (!user_var && user_val) {
                alert("Please enter a value for " + user_val + ".");
                return false;
            }
    
            if (keys_length.length > 0) {
                data.keys = {};
                keys.forEach(key => {
                    if (key.value != "") {
                        if (key.name == "sms") {
                            let phone_code;
                                phone_code = "+" + key.value;
                            data.keys[key.name] = phone_code;
                        }
                        else {
                            data.keys[key.name] = key.value;
                        }
                    }
                }); 
            }
    
            const data_string = string(data);
            
            cl("User API running...", data);
            
            fetch("/server", {
                method: "post",
                headers: headers,
                body: string({id : id, data : data_string})
            })
            .then(
                function(response) {
                if (response.status != 200) {
                    cl("Error: " + response.status);
                    return;
                }
                response.json().then(
                    function(resp_data) {
                        cl(resp_data);
                    })
                })
                .catch(error => cl(error) );
            }
        });

    document.addEventListener("click", function submit_form(event) {
        if (event.target.classList.contains("purchase_submit")) {
            const id = "purchase";
                cl(id + ".js script initiated.");
            const email = get_id("purchase_email").value;
            const url = get_id("purchase_url").value;
            const title = get_id("purchase_title").value;
            const tags = get_id("purchase_tags").value;
            const image = get_id("purchase_image").value;
            const qty = get_id("purchase_qty").value;
            const price = get_id("purchase_price").value;
            const purchase_var = get_id("purchase_var").value;
            const purchase_val = get_id("purchase_val").value;
            const messageid = get_id("purchase_messageid").value;
            const ordervar = get_id("purchase_ordervar").value;
            const orderval = get_id("purchase_orderval").value;
        
            const adjustment_length = get_class("purchase_adjustments");
            const adjustments = qsa(".purchase_adjustments");
            cl("Adjustments length", adjustment_length);
        
            const tag_name = [];
            tag_name.push("academy-days");
        
            let incomplete;
            let returned;
            let cart_empty;
        
            if (event.target.id == "incomplete_purchase" || event.target.id == "clear_purchase") {
                incomplete = 1;
            }
            else {
                incomplete = 0;
            }
        
            if (event.target.id == "clear_purchase") {
                cart_empty = true;
            }
            else {
                cart_empty = false;
            }
        
            if (event.target.id == "return_purchase") {
                returned = true;
            }
            else {
                returned = false;
            }
        
            if (email == "") {
                alert("Please enter an email address.");
                return false;
            }
            else if (email.indexOf("@") == -1) {
                alert(email + " is not a valid email address.");
                return false;
            }
        
            if (!url && event.target.id != "clear_purchase") {
                alert("Please enter a URL.");
                return false;
            }
        
            if (!title && event.target.id != "clear_purchase") {
                alert("Please enter a title.");
                return false;
            }
        
            if (!qty > 0 && event.target.id != "clear_purchase") {
                alert("Please enter a quantity greater than 0.");
                return false;
            }
        
            if (!price > 0 && event.target.id != "clear_purchase") {
                alert("Please enter a price greater than 0.");
                return false;
            }
        
            else {
                const data = {};
                data.email = email;
                data.url = url;
                data.title = title;
                data.qty = qty;
                data.price = price;
                data.incomplete = incomplete;
                data.cart_empty = cart_empty;
                data.returned = returned;
        
                if (tags) {
                    data.tags = tags.split(",").concat(tag_name);
                }
                else {
                    data.tags = tag_name;
                }
        
                if (ordervar && orderval) {
                    data.ordervar = ordervar;
                    data.orderval = orderval;
                }
        
                if (messageid) {
                    data.messageid = messageid;
                }
        
                if (purchase_var && purchase_val) {
                    data.var_name = purchase_var;
                    data.var_val = purchase_val;
                }
        
                if (image) {
                    data.image = image;
                }
        
                if (purchase_var && !purchase_val && returned == false) {
                    alert("Please enter a value for Purchase Value.");
                    return false
                }
        
                if (!purchase_var && purchase_val && returned == false) {
                    alert("Please enter a value for Purchase Var.");
                    return false
                }
        
        
                if (ordervar && !orderval && returned == false) {
                    alert("Please enter a value for Order Value.");
                    return false
                }
        
                if (!ordervar && orderval && returned == false) {
                    alert("Please enter a value for Order Var.");
                    return false
                }
        
                if (adjustment_length.length > 0) {
                    data.adjustments = [];
                    adjustments.forEach(adjustment => {
                        if (adjustment.name == "tax" && !(adjustment.value > 0) && (adjustment.value != "") && returned == false) {
                            alert("Tax must be a positive number.");
                            return false;
                        }
                        else if (adjustment.name == "tax" && (adjustment.value != "")) {
                            data.adjustments.push({name: "tax", "price" : adjustment.value});
                        }
        
                        if (adjustment.name == "discount" && !(adjustment.value < 0) && (adjustment.value != "") && returned == false) {
                            alert("Discount must be a negative number.");
                            return false;
                        }
                        else if (adjustment.name == "discount" && (adjustment.value != "")) {
                            data.adjustments.push({name: "discount", "price" : adjustment.value});
                        }
                    }); 
                    cl("Adjustments", data.adjustments);
                }
        
        
                if (event.target.id == "incomplete_purchase") {
                    alert(title + " has been added to your cart!");
                }
                else if (event.target.id == "return_purchase") {
                    alert(title + " has been returned!");
                }
                else if (event.target.id == "clear_purchase") {
                    alert("Your cart has been emptied!");
                }
                else {
                    alert(title + " has been purchased!");
                }
        
                const data_string = string(data);
        
                cl("Purchase API running...", data);
                
                fetch("/server", {
                    method: "post",
                    headers: headers,
                    body: string({id : id, data : data_string})
                })
                .then(
                function(response) {
                if (response.status != 200) {
                    cl("Error: " + response.status);
                    return;
                }
                response.json().then(
                    function(resp_data) {
                        cl(resp_data);
                    })
                })
                .catch(error => cl(error) );
            }
        }
    }, false);
    
    get_id("event_submit").addEventListener("click",
    function submit_form() {

        const id = "event";
            cl(id + ".js script initiated.");
            get_id("event_submit").value;
        const email = get_id("event_email").value;
        const event = get_id("event_name").value;
        const event_var = get_id("event_var").value;
        const event_val = get_id("event_val").value;
    
        if (email == "") {
            alert("Please enter an email address.");
            return false;
        }
        else if (email.indexOf("@") == -1) {
            alert(email + " is not a valid email address.");
            return false;
        }
        if (!event) {
            alert("Please enter an event name.");
            return false;
        }
        else {
            const data = {};
            data.email = email;
            data.event = event;
    
            if (event_var && event_val) {
                data.var_name = event_var;
                data.var_val = event_val;
            }
            if (event_var && !event_val) {
                alert("Please enter a value for " + event_var + ".");
                return false;
            }
            if (!event_var && event_val) {
                alert("Please enter a value for " + event_val + ".");
                return false;
            }
        const data_string = string(data);
    
        alert(email + " has been triggered event: " + event);
    
        cl("Event API running...", data);
    
        fetch("/server", {
            method: "post",
            headers: headers,
            body: string({id : id, data : data_string})
        })
        .then(
            function(response) {
            if (response.status != 200) {
                cl("Error: " + response.status);
                return;
            }
            response.json().then(
                function(resp_data) {
                    cl(resp_data);
                })
            })
            .catch(error => cl(error) );
        }
    });

    document.addEventListener("click", function submit_form(event) {
        if (event.target.classList.contains("content_submit")) {
            const id = "content";
                cl(id + ".js script initiated.");
            const url = get_id("content_url").value;
            const title = get_id("content_title").value;
            const tags = get_id("content_tags").value;
            const image = get_id("content_image").value;
            const publish_date =get_id("content_date").value;
            const expire_date = get_id("content_expire").value;
            const price = get_id("content_price").value;
            const inventory = get_id("content_inventory").value;
            const site = get_id("content_site").value;
            const location = get_id("content_location").value;
            const author = get_id("content_author").value;
            const content_var = get_id("content_var").value;
            const content_val = get_id("content_val").value;
            const tag_name = [];
            tag_name.push("academy-days");
        
            if (!url) {
                alert("Please enter a URL.");
                return false;
            }
        
            if (event.target.id == "publish_submit" && !title) {
                alert("Please enter a title.");
                return false;
            }
        
            else {
                const data = {};
                data.url = url;
                data.title = title;
        
                if (content_var && content_val) {
                    data.var_name = content_var;
                    data.var_val = content_val;
                }
        
                if (image) {
                    data.image = image;
                }
        
                if (publish_date) {
                    data.publish_date = publish_date;
                }
        
                if (expire_date) {
                    data.expire_date = expire_date;
                }
        
                if (price) {
                    data.price = price;
                }

                if (inventory) {
                    data.inventory = inventory;
                }
        
                if (site) {
                    data.site = site;
                }
        
                if (author) {
                    data.author = author;
                }
        
                if (location) {
                    data.location = location.split(",");
                }
        
                if (event.target.id == "publish_submit" && content_var && !content_val) {
                    alert("Please enter a value for " + content_var + ".");
                    return false;
                }
        
                if (event.target.id == "publish_submit" && !content_var && content_val) {
                    alert("Please enter a value for " + content_val + ".");
                    return false;
                }
        
                if (event.target.id == "publish_submit")  {
                    alert(url + " has been published!");
                    data.content_type = "publish";
                }
                else if (event.target.id == "respider_submit") {
                    alert(url + " has been respidered!");
                    data.content_type = "respider";
                }
                else if (event.target.id == "delete_submit") {
                    alert(url + " has been deleted");
                    data.content_type = "delete";
                }
        
                if (tags) {
                    data.tags = tags.split(",").concat(tag_name);
                }
                else {
                    data.tags = tag_name;
                }
        
                const data_string = string(data);
        
                cl("Content API running...", data);
                
                fetch("/server", {
                    method: "post",
                    headers: headers,
                    body: string({id : id, data : data_string})
                })
                .then(
                function(response) {
                if (response.status != 200) {
                    cl("Error: " + response.status);
                    return;
                }
                response.json().then(
                    function(resp_data) {
                        cl(resp_data);
                    })
                })
                .catch(error => cl(error) );
            }
        }
    }, false);

    get_id("cart_submit").addEventListener("click", function submit_form() {
        const id = "cart";
            cl(id + ".js script initiated.");
        const base_url = "http://links.stevedoesitall.com/join/";
        const email = get_id("cart_email").value;
        const new_window = base_url + id;
    
        if (email == "") {
            alert("Please enter an email address.");
            return false
        }
        else if (email.indexOf("@") == -1) {
            alert(email + " is not a valid email address.");
            return false
        }
    
        else {
            const data = {};
            data.email = email;
    
            const data_string = string(data);
            
            cl("Cart Abandon running...", data);
            
            fetch("/server", {
                method: "post",
                headers: headers,
                body: string({id : id, data : data_string})
            })
            .then(
                function(response) {
                if (response.status != 200) {
                    cl("Error: " + response.status);
                    return;
                }
                response.json().then(
                    function(resp_data) {
                    cl(resp_data);
                    const user_cookie = resp_data.keys.cookie;
                    window.open(new_window + "?cookie=" + user_cookie, "_blank");
                    })
                })
                .catch(error => cl(error) );
            
            setTimeout(function() {
                alert(email + " has cart abandoned!");
            }, 2000);
        }
    });
    
    get_id("browse_submit").addEventListener("click", function submit_form() {
        const id = "browse";
            cl(id + ".js script initiated.");
        const base_url = "http://links.stevedoesitall.com/join/";
        const email = get_id("browse_email").value;
        const new_window = base_url + id;
    
        if (email == "") {
            alert("Please enter an email address.");
            return false;
        }
        else if (email.indexOf("@") == -1) {
            alert(email + " is not a valid email address.");
            return false;
        }
    
        else {
            alert(email + " has browse abandoned!");
            const data = {};
            data.email = email;
    
            const data_string = string(data);
            
            cl("Browse Abandon running...", data);
            
            fetch("/server", {
                method: "post",
                headers: headers,
                body: string({id : id, data : data_string})
            })
            .then(
                function(response) {
                if (response.status != 200) {
                    cl("Error: " + response.status);
                    return;
                }
                response.json().then(
                    function(resp_data) {
                    cl(resp_data);
                    const user_cookie = resp_data.keys.cookie;
                    window.open(new_window + "?cookie=" + user_cookie, "_blank");
                    })
                })
                .catch(error => cl(error) );
            }
        });

    get_id("recs_submit").addEventListener("click", function submit_form() {
        get_id("recs_list").innerHTML = "";
        get_id("retr_recs").classList.remove("recs_message");
        const id = "recs";
        const rec_user = get_id("rec_user").value;
        const algorithm = get_id("rec_dropdown").value;
    
        const data = {};
            data.email = rec_user + "@sailthru.com";
            data.algorithm = algorithm;

        const data_string = string(data);
                
        fetch("/server", {
            method: "post",
            headers: headers,
            body: string({id : id, data : data_string})
        })
        .then(
            function(response) {
            if (response.status != 200) {
                cl("Error: " + response.status);
                return;
            }
            response.json().then(
            function(resp_data) {
                let num;
                switch (algorithm) {
                    case "popular":
                        num = 0;
                        break;
                    case "interest":
                        num = 1;
                        break;
                    case "purchased":
                        num = 2;
                        break;
                    case "viewed":
                        num = 3;
                        break;
                    case "random":
                        num = 4;
                        break;
                    case "prediction":
                        num = 5;
                        break;
                    case "trending":
                        num = 6;
                        break;
                }
                cl("Retrieving " + algorithm + " recommendations...");
                const user_recs = resp_data.content_html;
                const parsed_content = parse(user_recs);
                get_id("retr_recs").classList.add("recs_message");
                if (parsed_content[num].length < 1) {
                    const p = create_el("p");
                    p.innerHTML = "No " + algorithm + " recommendations for this user.";
                    get_id("recs_list").appendChild(p);
                }
                else {
                    cl('hi')
                    parsed_content[num].forEach(content => {
                        get_id("recs_list").innerHTML += "<p><a href='" + content.url + "' target='_blank'>" + content.title + "</a></p><img class='rec_image' alt='Image unavailable...' src='" + content.image + "'>"
                    });
                }
            })
            .catch(error => cl(error) );
        });
    });

    get_id("blast_submit").addEventListener("click", function submit_form() {
        const id = "blast";
        const blast_url = get_id("blast_url").value;;
        const blast_author = get_id("blast_author").value;;
        const blast_title = get_id("blast_title").value;;
        const blast_desc = get_id("blast_desc").value;;
    
        if (blast_url == "") {
            alert("Please enter a URL.");
            return false;
        }
        else if (blast_author == "") {
            alert("Please enter an author name.");
            return false;
        }
        else if (blast_title == "") {
            alert("Please enter a title.");
            return false;
        }
        else if (blast_desc == "") {
            alert("Please enter a description.");
            return false;
        }
    
        else {
            alert("Breaking alert has been sent for " + blast_title + "!");
            const data = {};
                data.url = blast_url;
                data.author = blast_author;
                data.title = blast_title;
                data.description = blast_desc;
    
            const data_string = string(data);
            
            cl("Blast API running...", data);
            
            fetch("/server", {
                method: "post",
                headers: headers,
                body: string({id : id, data : data_string})
            })
            .then(
            function(response) {
            if (response.status != 200) {
                cl("Error: " + response.status);
                return;
            }
            response.json().then(
                function(resp_data) {
                    cl(resp_data);
                })
            })
            .catch(error => cl(error) );
        }
    });
});