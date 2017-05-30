var current_page;
var username;
var alert = function(a, b, c) {
    c = c || {};
    c["message"] = a;
    c["title"] = b;
    new jsh.Alert(c).open();
};

window.onload = function() {
    jsh.cm();

    open_page("page_login");

    jsh.get("#login_password").addEventListener("keypress", login_keypress_handler);
    jsh.get("#login_username").addEventListener("keypress", login_keypress_handler);
    jsh.get("#login_button").addEventListener("click", function(e) {
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
    var username = jsh.get("#login_username").value;
    var password = jsh.get("#login_password").value;

    new jsh.Request({
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
    }).post();
}

function load_dashboard(token, silent) {
    alert("loading...");
    
    new jsh.Request({
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
                    new jsh.Alert().close();
                }
            } else {
                window.localStorage["token"] = response["token"];
                username = response["username"];
                jsh.get("#page_dashboard").innerHTML = response["html"];

                var script = document.createElement("script");
                script.innerHTML = response["js"];
                document.head.appendChild(script);

                var css = document.createElement("style");
                css.innerHTML = response["css"];
                document.head.appendChild(css);

                open_page("page_dashboard");
                new jsh.Alert().close();
            }
        }
    }).post();
}

function open_page(page_div_id) {
    if (jsh.get("#" + page_div_id) == undefined) {
        alert("Page does not exist.", "Oops!");
        return;
    }

    if (current_page == page_div_id) {
        return;
    }

    current_page = page_div_id;

    var pages = jsh.get(".page");
    for (var i in pages) {
        if (!pages.hasOwnProperty(i)) continue;
        pages[i].classList.add("transparent");
        pages[i].classList.remove(pages[i].id + "_loading");
    }

    setTimeout(function() {
        var pages = jsh.get(".page");
        for (var i in pages) {
            if (!pages.hasOwnProperty(i)) continue;
            pages[i].classList.add("display_none");
        }

        jsh.get("#" + page_div_id).classList.remove("display_none");
        jsh.get("#" + page_div_id).classList.add(page_div_id + "_loading");
        setTimeout(function() {
            jsh.get("#" + page_div_id).classList.remove("transparent");
        }, 10);

        setTimeout(function() {
            window.dispatchEvent(new Event('page_opened'));
        }, 500);
    }, 500);

    window.location.hash = page_div_id.substring(5);
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
                    window.location.href = this.href;
                    event.returnValue = false;
                }, false);
            }
        }
    }, false);
}