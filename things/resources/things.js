var messages = {
    latest_id: -1,
    last_posted_datetime: new Date(0),
    fetching: false,

    setup: function() {
        messages.user_id = Math.random().toString(36).slice(2);
        messages.send_button = jsh.get("#messages_send");
        messages.input = jsh.get("#messages_footer_input");

        messages.input.addEventListener("keyup", function(e) {
            if (e.keyCode == 13) {
                messages.send(e.target.value);
            }

            if (e.target.value == "") {
                messages.send_button.classList.add("messages_send_inactive");
            } else {
                messages.send_button.classList.remove("messages_send_inactive");
            }
        });

        messages.send_button.addEventListener("click", function() {
            if (messages.input.value != "") {
                messages.send(messages.input.value);
                messages.input.value = "";
            }
        });

        setInterval(messages.listen, 1000);
    },

    send: function(message) {
        new jsh.Request({
            url: "./db/messages.php",
            data: {
                message: message,
                user_id: messages.user_id,
                action: "send"
            },
            callback: function(response) {
                messages.input.value = "";
                messages.send_button.classList.add("messages_send_inactive");
                if (response["error"] != undefined) {
                    console.log(response["error"]);
                }
            }
        }).get();
    },

    listen: function() {
        if (messages.fetching) return;
        messages.fetching = true;

        new jsh.Request({
            url: "./db/messages.php",
            data: {
                latest_id: messages.latest_id,
                action: "receive"
            },
            parse_json: true,
            callback: function(response) {
                if (response["error"] != undefined) {
                    console.log(response["error"]);
                } else {
                    for (var i in response) {
                        if (!response.hasOwnProperty(i)) continue;


                        var datetime = response[i]["time"].split(/[-: ]/);
                        datetime = new Date(datetime[0], datetime[1] - 1, datetime[2], datetime[3], datetime[4], datetime[5]);

                        messages.load(response[i]["message"],
                            response[i]["user_id"] == messages.user_id,
                            datetime
                        );

                        if (parseInt(response[i]["id"]) > messages.latest_id) {
                            messages.latest_id = parseInt(response[i]["id"]);
                        } else {
                            console.log(messages.latest_id);
                            console.log(response[i]["id"]);
                        }
                    }
                    messages.fetching = false;
                }
            }
        }).get();
    },

    load: function(message, sent, datetime) {
        var origin = sent ? "sent" : "received";
        var messages_div = jsh.get("#messages");

        //<div class="texts_date"><b>Mon, Sep 6,</b> 11:11 PM</div>
        if (datetime > messages.last_posted_datetime) {
            var date_div = document.createElement("div");
            date_div.classList.add("messages_date");

            var days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            date_div.innerHTML = "<b>" + days[datetime.getDay()] + ", " + months[datetime.getMonth()] + " "
                + datetime.getDate() + ",</b> " + datetime.getHours() % 12 + ":" + ("00"
                + datetime.getMinutes()).substr(-2) + (datetime.getHours() > 12 ? " PM" : " AM");
            messages_div.appendChild(date_div);

            datetime.setMinutes(datetime.getMinutes() + 5);
            messages.last_posted_datetime = datetime;
        }

        var container_div = document.createElement("div");
        container_div.classList.add(origin + "_message_container");
        container_div.setAttribute("origin", origin);

        var message_div = document.createElement("div");
        message_div.classList.add(origin + "_message");
        message_div.classList.add("message");
        message_div.innerHTML = message;
        container_div.appendChild(message_div);

        var curl_div = document.createElement("div");
        curl_div.classList.add(origin + "_message_curl");
        container_div.setAttribute("curl_sid", curl_div.sid);
        container_div.appendChild(curl_div);

        if (sent) {
            var delivered = jsh.get("#message_delivered");
            if (delivered != undefined) {
                delivered.remove();
            }

            delivered = document.createElement("div");
            delivered.id = "message_delivered";
            delivered.innerText = "Delivered";

            container_div.appendChild(delivered);
        }

        if (messages_div.lastChild != undefined) {
            if (messages_div.lastChild.getAttribute("origin") == origin) {
                var children = messages_div.lastChild.children;

                for (var i in children) {
                    if (!children.hasOwnProperty(i)) continue;
                    if (children[i].classList != undefined
                        && children[i].classList.contains(origin + "_message_curl")) {
                        children[i].remove();
                    }
                }

            }
        }

        messages_div.appendChild(container_div);
        messages_div.scrollTop = messages_div.scrollHeight;
    }
};

window.onload = function() {
    jsh.cm();
    messages.setup();
};
