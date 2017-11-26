<?php
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$email    = $request->email;
$name     = $request->name;

$output;
$status;

$perl_script = "perl ../perl/notify_borrower.pl -u $name -e $email";
exec($perl_script, $output, $status);
echo $output[0];
?>
