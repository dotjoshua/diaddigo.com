<?php

require_once "database.php";
require_once "auth.php";

$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);

$new_token = check_auth_token($_POST["token"], $DB_PASSWD)["token"];

if (!$new_token) {
    echo json_encode(array(
        "success" => false,
        "error" => "Authentication error."
    ));
} else {
    $prayer = query("SELECT * FROM (SELECT * FROM Prayers WHERE exp_date > NOW()) as recent ORDER BY RAND() LIMIT 1;", $DB_PASSWD, false, false, array(), array());

    if (count($prayer) == 0) {
        $prayer = array(array(
            "topic" => "...",
            "description" => "No current prayers. Prayers expire after 1 week.",
            "user" => "Joshua"
        ));
    }

    echo json_encode(array(
        "success" => true,
        "token" => $new_token,
        "prayer_topic" => $prayer[0]["topic"],
        "prayer_description" => $prayer[0]["description"],
        "prayer_user" => $prayer[0]["user"]
    ));
}
