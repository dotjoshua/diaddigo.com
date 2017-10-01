<?php

require_once "database.php";
require_once "../lib/Twilio.php";
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
    $user = $auth_data["username"];
    $message = htmlspecialchars($_POST["message"]);
    $message = str_replace("%USERNAME%", $user, $message);

    $client = new Services_Twilio($TWILIO_ACCOUNT_SID, $TWILIO_AUTH_TOKEN);
    $textMessage = $client->account->messages->create(array(
        "From" => "770-691-2047",
        "To" => "770-377-4047",
        "Body" => $message,
    ));

    echo json_encode(array(
        "success" => true,
        "token" => $new_token
    ));
}


