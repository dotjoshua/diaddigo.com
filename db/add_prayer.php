<?php

require_once "database.php";
require_once "auth.php";

$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);
$auth_data = check_auth_token($_POST["token"], $DB_PASSWD);
$new_token = $auth_data["token"];

if (!$new_token) {
    echo json_encode(array(
        "success" => false,
        "error" => "Authentication error."
    ));
} else {
    $prayer_topic = htmlspecialchars($_POST["topic"]);
    $prayer_description = htmlspecialchars($_POST["description"]);
    $prayer_user = $auth_data["username"];
    $prayer = query("INSERT INTO Prayers VALUES (?, ?, NOW() + INTERVAL 1 WEEK, ?)", $DB_PASSWD, true, true, array("s", "s", "s"), array($prayer_topic, $prayer_description, $prayer_user));

    echo json_encode(array(
        "success" => true,
        "token" => $new_token
    ));
}
