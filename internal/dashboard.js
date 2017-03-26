jsh.req.post({
    url: "db/get_prayer.php",
    data: {token: window.localStorage.token},
    parse_json: true,
    async: false,
    callback: function(result) {
        if (!result["success"]) {
            alert(result["error"]);
        } else {
            window.localStorage.token = result["token"];
            jsh.select("#prayer_topic").js.innerText = "pray for " + result["prayer_topic"];
            jsh.select("#prayer_description").js.innerText = result["prayer_description"];
            jsh.select("#prayer_user").js.innerText = "- " + result["prayer_user"];
        }
    }
});

jsh.req.post({
    url: "db/get_giving_opportunities.php",
    data: {token: window.localStorage.token},
    parse_json: true,
    async: false,
    callback: function(result) {
        if (!result["success"]) {
            alert(result["error"]);
        } else {
            window.localStorage.token = result["token"];
            var table = jsh.select("#giving_table").js;

            var rows = result["giving_opportunities"];
            for (var i = 0; i < rows.length; i++) {
                var row = document.createElement("tr");
                var col = document.createElement("td");
                var user_icon = document.createElement("div");
                user_icon.classList.add("user_icon");
                user_icon.style.backgroundImage = "url(resources/images/" + rows[i]["owner"] + ".jpg)";
                col.appendChild(user_icon);
                row.appendChild(col);

                col = document.createElement("td");
                var a = document.createElement("a");
                a.innerText = rows[i]["name"];
                a.href = rows[i]["link"];
                col.appendChild(a);
                row.appendChild(col);

                col = document.createElement("td");
                col.innerText = rows[i]["description"];
                row.appendChild(col);

                table.appendChild(row);
            }
        }
    }
});

jsh.req.post({
    url: "db/get_links.php",
    data: {token: window.localStorage.token},
    parse_json: true,
    async: false,
    callback: function(result) {
        if (!result["success"]) {
            alert(result["error"]);
        } else {
            window.localStorage.token = result["token"];
            var table = jsh.select("#links_table").js;

            var rows = result["links"];
            for (var i = 0; i < rows.length; i++) {
                var row = document.createElement("tr");
                var col = document.createElement("td");
                var user_icon = document.createElement("div");
                user_icon.classList.add("user_icon");
                user_icon.style.backgroundImage = "url(resources/images/" + rows[i]["owner"] + ".jpg)";
                col.appendChild(user_icon);
                row.appendChild(col);

                col = document.createElement("td");
                var a = document.createElement("a");
                a.innerText = rows[i]["link"];
                a.href = rows[i]["link"];
                col.appendChild(a);
                row.appendChild(col);

                col = document.createElement("td");
                col.innerText = rows[i]["description"];
                row.appendChild(col);

                table.appendChild(row);
            }
        }
    }
});


jsh.select("#prayer_submit").js.addEventListener("click", function() {
    alert(function() {
        var topic = document.createElement("input");
        topic.id = "prayer_topic_input";
        topic.setAttribute("placeholder", "topic");

        var description = document.createElement("textarea");
        description.id = "prayer_description_input";
        description.setAttribute("placeholder", "description");

        var container = document.createElement("div");
        container.appendChild(topic);
        container.appendChild(description);
        return container.innerHTML;
    }(), "New Prayer Topic", {
        button_text: "submit",
        show_cancel: true,
        button_callback: function() {
            jsh.req.post({
                url: "db/add_prayer.php",
                parse_json: true,
                data: {
                    token: window.localStorage.token,
                    topic: jsh.select("#prayer_topic_input").js.value,
                    description: jsh.select("#prayer_description_input").js.value
                },
                callback: function(response) {
                    if (!response["success"]) {
                        alert(response["error"]);
                    } else {
                        alert("Prayer submitted.", "", {
                            button_callback: function() {
                                location.reload();
                            }
                        });
                        window.localStorage["token"] = response["token"];
                    }
                }
            });
        }
    });
});

jsh.select("#giving_submit").js.addEventListener("click", function() {
    alert(function() {
        var name = document.createElement("input");
        name.id = "giving_name_input";
        name.setAttribute("placeholder", "name");

        var link = document.createElement("input");
        link.id = "giving_link_input";
        link.setAttribute("placeholder", "link");

        var description = document.createElement("textarea");
        description.id = "giving_description_input";
        description.setAttribute("placeholder", "description");

        var container = document.createElement("div");
        container.appendChild(name);
        container.appendChild(link);
        container.appendChild(description);
        return container.innerHTML;
    }(), "New Giving Opportunity", {
        button_text: "submit",
        show_cancel: true,
        button_callback: function() {
            jsh.req.post({
                url: "db/add_giving_opportunity.php",
                parse_json: true,
                data: {
                    token: window.localStorage.token,
                    name: jsh.select("#giving_name_input").js.value,
                    link: jsh.select("#giving_link_input").js.value,
                    description: jsh.select("#giving_description_input").js.value
                },
                callback: function(response) {
                    if (!response["success"]) {
                        alert(response["error"]);
                    } else {
                        alert("Giving opportunity submitted.", "", {
                            button_callback: function() {
                                location.reload();
                            }
                        });
                        window.localStorage["token"] = response["token"];
                    }
                }
            });
        }
    });
});

jsh.select("#links_submit").js.addEventListener("click", function() {
    alert(function() {
        var link = document.createElement("input");
        link.id = "link_link_input";
        link.setAttribute("placeholder", "link");

        var description = document.createElement("textarea");
        description.id = "link_description_input";
        description.setAttribute("placeholder", "description");

        var container = document.createElement("div");
        container.appendChild(link);
        container.appendChild(description);
        return container.innerHTML;
    }(), "New Link", {
        button_text: "submit",
        show_cancel: true,
        button_callback: function() {
            jsh.req.post({
                url: "db/add_link.php",
                parse_json: true,
                data: {
                    token: window.localStorage.token,
                    link: jsh.select("#link_link_input").js.value,
                    description: jsh.select("#link_description_input").js.value
                },
                callback: function(response) {
                    if (!response["success"]) {
                        alert(response["error"]);
                    } else {
                        alert("Link submitted.", "", {
                            button_callback: function() {
                                location.reload();
                            }
                        });
                        window.localStorage["token"] = response["token"];
                    }
                }
            });
        }
    });
});

jsh.select("#account_logout").js.addEventListener("click", function(e) {
    alert("Would you like to logout?", "Are you sure?", {
        button_callback: function() {
            window.localStorage.token = "";
            location.reload();
        },
        button_text: "yes",
        show_cancel: true
    });
});

jsh.select("#account_change_password").js.addEventListener("click", function() {
    alert(function() {
        var new_pass_1 = document.createElement("input");
        new_pass_1.id = "new_pass_1_input";
        new_pass_1.setAttribute("type", "password");
        new_pass_1.setAttribute("placeholder", "new password");

        var new_pass_2 = document.createElement("input");
        new_pass_2.id = "new_pass_2_input";
        new_pass_2.setAttribute("type", "password");
        new_pass_2.setAttribute("placeholder", "confirm new password");

        var container = document.createElement("div");
        container.appendChild(new_pass_1);
        container.appendChild(new_pass_2);
        return container.innerHTML;
    }(), "Reset Password", {
        button_text: "reset",
        show_cancel: true,
        button_callback: function() {
            var new_pass_1 = jsh.select("#new_pass_1_input").js.value;
            var new_pass_2 = jsh.select("#new_pass_2_input").js.value;

            if (new_pass_1 != new_pass_2) {
                alert("Passwords do not match.", "Oops!", {
                    button_callback: function() {
                        jsh.select("#account_change_password").js.dispatchEvent(new Event("click"));
                    }
                })
            } else {
                jsh.req.post({
                    url: "db/reset_password.php",
                    parse_json: true,
                    data: {
                        token: window.localStorage.token,
                        new_pass: new_pass_1
                    },
                    callback: function(response) {
                        if (!response["success"]) {
                            alert(response["error"]);
                        } else {
                            alert("Success.");
                            window.localStorage["token"] = response["token"];
                        }
                    }
                });
            }
        }
    });
});
