<?php

function query($sql, $db_passwd, $no_response, $json_encode, $param_types, $params) {
    $servername = "localhost";
    $username = "ruffles_joshua";
    $db_name = "ruffles_diaddigo";

    $conn = new mysqli($servername, $username, $db_passwd, $db_name);
    $bind_params = array();
    $param_type = "";

    for ($i = 0; $i < count($params); $i++) {
        $param_type .= $param_types[$i];
    }

    $bind_params[] = & $param_type;

    for ($i = 0; $i < count($params); $i++) {
        $bind_params[] = & $params[$i];
    }

    $stmt = $conn->prepare($sql);
    if (count($params) > 0) {
        call_user_func_array(array($stmt, 'bind_param'), $bind_params);
    }
    $stmt->execute();

    if ($no_response) return "";

    $result = mysqli_stmt_get_result($stmt);
    $response = array();

    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
        array_push($response, $row);
    }

    if ($json_encode) {
        $response = json_encode($response);
    }

    return $response;
}

function check_auth_token($token, $db_passwd) {
    $hashed_token = hash("sha256", $token);

    query("DELETE FROM SessionTokens WHERE UNIX_TIMESTAMP(now()) - UNIX_TIMESTAMP(date_added) > 1800;", $db_passwd, true, true, array(), array());
    $token_present = query("SELECT COUNT(1) AS num FROM SessionTokens WHERE hashed_token=?", $db_passwd, false, false,  array("s"), array($hashed_token));

    if ($token_present[0]["num"] > 0) {
        $username = query("SELECT owner from SessionTokens WHERE hashed_token=?", $db_passwd, false, false,  array("s"), array($hashed_token))[0]["owner"];
        query("DELETE FROM SessionTokens WHERE hashed_token=?", $db_passwd, true, true, array("s"), array($hashed_token));
        return get_new_token($db_passwd, $username);
    } else {
        return array (
            "token" => false,
            "username" => false
        );
    }
}

function get_new_token($db_passwd, $username) {
    $token = bin2hex(openssl_random_pseudo_bytes(16));
    $hashed_token = hash("sha256", $token);
    query("INSERT INTO SessionTokens values (?, NOW(), ?)", $db_passwd, true, true, array("s", "s"), array($hashed_token, $username));
    return array (
        "token" => $token,
        "username" => $username
    );
}