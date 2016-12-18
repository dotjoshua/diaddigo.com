<?php

function query($sql, $db_passwd, $no_response) {
    $servername = "localhost";
    $username = "ruffles_joshua";
    $db_name = "ruffles_joshua";
    $conn = new mysqli($servername, $username, $db_passwd, $db_name);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $conn->set_charset("utf8mb4");

    $result = mysqli_query($conn, $sql);
    if ($no_response) return "";
    $response = array();
    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
        array_push($response, $row);
    }

    return $response;
}
