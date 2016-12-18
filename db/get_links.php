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
    $giving_opportunities = query("SELECT * FROM Links;", $DB_PASSWD, false, false, array(), array());

    echo json_encode(array(
        "success" => true,
        "token" => $new_token,
        "links" => $giving_opportunities
    ));
}
