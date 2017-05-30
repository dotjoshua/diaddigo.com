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

    jsh.pages["login"].open();

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

                while (document.readyState !== "complete") {
                    console.log(document.readyState);
                }

                var script = document.createElement("script");
                script.innerHTML = response["js"];
                document.head.appendChild(script);

                var css = document.createElement("style");
                css.innerHTML = response["css"];
                document.head.appendChild(css);

                jsh.pages["dashboard"].open();
                new jsh.Alert().close();

                var links = jsh.get("a");
                for (var i = 0; i < links.length; i++) {
                    links[i].onclick = function() {
                        window.location=this.getAttribute("href");
                        return false
                    }
                }
            }
        }
    }).post();
}