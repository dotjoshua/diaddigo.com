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
    $username = $auth_data["username"];
    $user = query("SELECT * FROM Users WHERE username=?", $DB_PASSWD, false, false, array("s"), array($username))[0];
    $new_password_hash = $hashed_input = hash("sha256", $_POST["new_pass"].$user["salt"]);

    query("UPDATE Users SET password_hash=? WHERE username=?", $DB_PASSWD, true, true, array("s", "s"), array($new_password_hash, $username));

    echo json_encode(array(
        "success" => true,
        "token" => $new_token
    ));
}
