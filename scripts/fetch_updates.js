$.ajax({
    type: "POST",
    url: "/email",
    data: { id : "lists", data : "{}" },
    success: function(data) {
        
        const status = "active";
        const list_convention = "Master List ";
        const list_length = list_convention.length;    
        const data_lists = data.lists;
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

        const lists_list = document.getElementById("user_lists");
        console.log(all_lists);
        if (!lists_list.length > 0) {
            all_lists.forEach(list => {
                const option = document.createElement("option");
                option.innerHTML = list;
                document.getElementById("user_lists").appendChild(option);
            });
        }

        document.getElementById("retr_lists").classList.add("recs_message");
        document.getElementById("user_dropdown").classList.remove("dropdown");
    }
});