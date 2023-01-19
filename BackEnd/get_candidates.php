<?php
$json = file_get_contents('php://input');
$body = json_decode($json);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

$username = 'S3851781';
$password = '9DwVpV&^6ahYKF';
$servername = 'talsprddb01.int.its.rmit.edu.au';
$servicename = 'CSAMPR1.ITS.RMIT.EDU.AU';
$connection = $servername."/".$servicename;

$conn = oci_connect($username, $password, $connection);
if(!$conn) 
{
    $e = oci_error();
    trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
    $res = array(
        "status" => 500,
        "message" => "Connection failed"
    );
    print(json_encode($res));
}
else 
{
    $query = 'SELECT candidate_name, party_code
    FROM candidate
    NATURAL JOIN party
    WHERE election_code = :election_code
    AND electorate_name = :electorate_name';
    
    $stid = oci_parse($conn, $query);
    oci_bind_by_name($stid, ":election_code", $body->election_code);
    oci_bind_by_name($stid, ":electorate_name", $body->electorate_name);
    oci_execute($stid);

    // count the number of rows
    $count = 0;
    $data = array();
    while ($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS)) {
        $count++;
        // create a copy with lowercase keys
        $rowData = array();
        foreach ($row as $key => $value) {
            $rowData[strtolower($key)] = $value;
        }
        array_push($data, $rowData);
    }

    if ($count > 0) {
        $res = array(
            "status" => 200,
            "message" => "Electorate has candidates.",
            "data" => $data,
            "election_code" => $body->election_code,
            "electorate_name" => $body->electorate_name
        );
        print(json_encode($res));
    } else {
        $res = array(
            "status" => 400,
            "message" => "Electorate has no candidates.",
            "election_code" => $body->election_code,
            "electorate_name" => $body->electorate_name
        );
        print(json_encode($res));
    }
}

oci_close($conn);

?>