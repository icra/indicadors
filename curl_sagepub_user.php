<?php

$id_user = isset($_GET["id_user"]) ? $_GET["id_user"] : false;

if(!$id_user){
  //$id_user = 24669;//test id_user
  die("{'error':true}");
}

$url = "https://policyprofiles.sagepub.com/spa/public/citation-data/for-user/$id_user";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response  = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
if(curl_errno($ch)) {
  echo "{'error':'cURL error: ".curl_error($ch)."'}";
}else{
  //echo "Response Code: " . $http_code . "\n";
  echo $response;
}
curl_close($ch);
?>
