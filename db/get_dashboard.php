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
    echo json_encode(array(
        "success" => true,
        "token" => $new_token,
        "html" => file_get_contents("../internal/dashboard.html"),
        "js" => file_get_contents("../internal/dashboard.js"),
        "css" => file_get_contents("../internal/dashboard.css"),
        "username" => $auth_data["username"]
    ));
}