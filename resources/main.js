var current_page;
var username;
alert = jsh.alert.open;

window.onload = function() {
    jsh.cm.setup();

    open_page("login_page");

    jsh.select("#login_password").js.addEventListener("keypress", login_keypress_handler);
    jsh.select("#login_username").js.addEventListener("keypress", login_keypress_handler);
    jsh.select("#login_button").js.addEventListener("click", function(e) {
        login();
    });

    if (window.localStorage.token) {
        load_dashboard(window.localStorage.token, true);
    }
};

function login_keypress_handler(e) {
    if (e.keyCode == 13) {
        login();
    }
}

function login() {
    alert("logging in...");
    var username = jsh.select("#login_username").js.value;
    var password = jsh.select("#login_password").js.value;

    jsh.req.post({
        url: "db/login.php",
        parse_json: true,
        data: {
            username: username,
            password: password
        },
        callback: function(response) {
            if (!response["success"]) {
                alert(response["error"], "");
            } else {
                load_dashboard(response["token"]);
            }
        }
    });
}

function load_dashboard(token, silent) {
    alert("loading...");
    
    jsh.req.post({
        url: "db/get_dashboard.php",
        parse_json: true,
        data: {
            token: token
        },
        callback: function(response) {
            if (!response["success"]) {
                if (!silent) {
                    alert(response["error"]);
                } else {
                    jsh.alert.close();
                }
            } else {
                window.localStorage["token"] = response["token"];
                username = response["username"];
                jsh.select("#dashboard_page").js.innerHTML = response["html"];

                var script = document.createElement("script");
                script.innerHTML = response["js"];
                document.head.appendChild(script);

                var css = document.createElement("style");
                css.innerHTML = response["css"];
                document.head.appendChild(css);

                open_page("dashboard_page");
                jsh.alert.close();
            }
        }
    });
}

function open_page(page_div_id) {
    if (jsh.select("#" + page_div_id) == undefined) {
        alert("Page does not exist.", "Oops!");
        return;
    }

    if (current_page == page_div_id) {
        return;
    }

    current_page = page_div_id;

    var pages = jsh.select(".page");
    for (var i in pages) {
        if (!pages.hasOwnProperty(i)) continue;
        pages[i].add_class("transparent");
        pages[i].remove_class(pages[i].js.id + "_loading");
    }

    setTimeout(function() {
        var pages = jsh.select(".page");
        for (var i in pages) {
            if (!pages.hasOwnProperty(i)) continue;
            pages[i].add_class("display_none");
        }

        jsh.select("#" + page_div_id).remove_class("display_none");
        jsh.select("#" + page_div_id).add_class(page_div_id + "_loading");
        setTimeout(function() {
            jsh.select("#" + page_div_id).remove_class("transparent");
        }, 10);

        setTimeout(function() {
            window.dispatchEvent(new Event('page_opened'));
        }, 500);
    }, 500);

    window.location.hash = page_div_id.substring(0, page_div_id.length - 5);
}

if (('standalone' in window.navigator) && window.navigator.standalone) {
    window.addEventListener('load', function() {
        var links = document.links,
            link,
            i;

        for (i = 0; i < links.length; i++) {
            // Don't do this for javascript: links
            if (~(link = links[i]).href.toLowerCase().indexOf('javascript')) {
                link.addEventListener('click', function(event) {
                    top.location.href = this.href;
                    event.returnValue = false;
                }, false);
            }
        }
    }, false);
}