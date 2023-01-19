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
    $parameterbuilder = '';
    $parameterbuilder .= $body->election_code . ',';
    $parameterbuilder .= '\'' . 'ExampleStation' . '\',';
    $parameterbuilder .= '\'' . $body->electorate_name . '\',';
    $parameterbuilder .= '\'' . $body->voter_f_name . '\',';
    $parameterbuilder .= '\'' . $body->voter_l_name . '\',';
    $parameterbuilder .= 'TO_DATE(' . '\'' . $body->voter_dob . '\'' . ', \'DD/MM/YYYY\')' . ',';
    $parameterbuilder .= '\'' . $body->voter_r_address . '\',';

    $twoDArrayContents = '';
    foreach ($body->candidates as $candidate) {
        $twoDArrayContents .= 'Arr1D_Type(';
        $twoDArrayContents .= $candidate->preference . ',';
        $twoDArrayContents .= '\'' . $candidate->candidate_name . '\',';
        $twoDArrayContents .= '\'' . $candidate->candidate_party . '\'';
        $twoDArrayContents .= '), ';
    }

    // remove last comma
    $twoDArrayContents = substr($twoDArrayContents, 0, -2);

    $parameterbuilder .= 'Arr2D_Type(' . $twoDArrayContents . ')';
    $query = 'BEGIN cast_ballot(' . $parameterbuilder . '); END;';
    $stid = oci_parse($conn, $query);
    oci_execute($stid);

    // check if a issuance was created
    $query = 'SELECT *
            FROM   issuance
            WHERE  election_code = :election_code
            AND voter_f_name = :voter_f_name
            AND voter_l_name = :voter_l_name
            AND voter_dob = TO_DATE(:voter_dob, \'DD/MM/YYYY\')
            AND voter_r_address = :voter_r_address';
    
    $stid = oci_parse($conn, $query);
    oci_bind_by_name($stid, ":election_code", $body->election_code);
    oci_bind_by_name($stid, ":voter_f_name", $body->voter_f_name);
    oci_bind_by_name($stid, ":voter_l_name", $body->voter_l_name);
    oci_bind_by_name($stid, ":voter_dob", $body->voter_dob);
    oci_bind_by_name($stid, ":voter_r_address", $body->voter_r_address);
    oci_execute($stid);

    // count the number of rows
    $count = 0;
    while ($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS)) {
        $count++;
    }

    if ($count == 1) {
        $res = array(
            "status" => 200,
            "message" => "Votes have been cast.",
        );
        print(json_encode($res));
    } else {
        $res = array(
            "status" => 400,
            "message" => "Votes have not been cast.",
        );
        print(json_encode($res));
    }

}

oci_close($conn);

?>