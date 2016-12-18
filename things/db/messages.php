<?php
require_once "../../db/auth.php";
require_once "./database.php";

$action = preg_replace("/[^a-z]*/", "", $_GET["action"]);
if ($action == "receive") {
    $latest_id = preg_replace("/[^0-9-]*/", "", $_GET["latest_id"]);
    $result = query("SELECT * FROM messages WHERE messages.id > ".$latest_id." AND messages.time >= CURDATE() - INTERVAL 7 DAY;", $DB_PASSWD, false);
    echo json_encode($result);
} else {
    $user_id = preg_replace("/[^A-Za-z0-9]*/", "", $_GET["user_id"]);
    $message = htmlspecialchars($_GET["message"]);
    $message = trim($message);
    $message = preg_replace("/[\x{1F600}-\x{1F64F}]+/u", "<span class='emoji'>$0</span>", $message);
    if (strlen($message) < 1) return;
    query("INSERT INTO messages (user_id, message, time) VALUES (\"".$user_id."\", \"".$message."\", NOW() - INTERVAL 5 HOUR);", $DB_PASSWD, true);
}
