<?php

require_once "database.php";
require_once "auth.php";

$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);

function login($username, $password, $db_passwd) {
    $login_fail = array(
        "success" => false,
        "error" => "Invalid username or password."
    );

    $user = query("SELECT * FROM Users WHERE username=?;", $db_passwd, false, false, array("s"), array($username));
    if (count($user) == 0) {
        return $login_fail;
    }
    $user = $user[0];

    $hashed_input = hash("sha256", $password.$user["salt"]);
    if ($hashed_input == $user["password_hash"]) {
        return array(
            "success" => true,
            "token" => get_new_token($db_passwd, $user["username"])["token"]
        );
    } else {
        return $login_fail;
    }
}

$username = preg_replace("/[^A-Za-z]/", "", $_POST['username']);

echo json_encode(login($username, $_POST['password'], $DB_PASSWD));