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
    $name = htmlspecialchars($_POST["name"]);
    $link = $_POST["link"];
    $description = htmlspecialchars($_POST["description"]);
    $user = $auth_data["username"];
    $prayer = query("INSERT INTO GivingOpportunities VALUES (?, ?, ?, ?)", $DB_PASSWD, true, true, array("s", "s", "s", "s"), array($name, $link, $description, $user));

    echo json_encode(array(
        "success" => true,
        "token" => $new_token
    ));
}
