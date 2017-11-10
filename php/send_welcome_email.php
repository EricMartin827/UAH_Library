<?php
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$email    = $request->$email;
$password = $request->password;
$name     = $request->name;

$output;
$status;

$perl_script = "perl ../perl/welcome_email.pl -u $name -e $email -p $password";
exec($perl_script, $output, $status);
echo $output[0];
?>
