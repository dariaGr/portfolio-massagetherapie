<?php
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;

	require 'phpmailer/src/Exception.php';
	require 'phpmailer/src/PHPMailer.php';

	$mail = new PHPMailer(true);
	$mail->CharSet = 'UTF-8';
	$mail->setLanguage('de', 'phpmailer/language/');
	$mail->IsHTML(true);

	//Absender
	$mail->setFrom('test@test.com', 'test@test.com');
	//Empfänger
	$mail->addAddress('grb747@inbox.ru');
	//Betreff
	$mail->Subject = 'Neuer Kontakt';
	//Text
	$body = '<h1>Neuer Kontakt!</h1>';
	
	if(trim(!empty($_POST['name']))){
		$body.='<p><strong>Name:</strong> '.$_POST['name'].'</p>';
	}
	if(trim(!empty($_POST['email']))){
		$body.='<p><strong>E-Mail:</strong> '.$_POST['email'].'</p>';
	}
   if(trim(!empty($_POST['phone']))){
		$body.='<p><strong>Telefon:</strong> '.$_POST['phone'].'</p>';
	}
   if(trim(!empty($_POST['date']))){
		$body.='<p><strong>Bevorzugtes Datum/Uhrzeit:</strong> '.$_POST['date'].'</p>';
	}
	
	if(trim(!empty($_POST['message']))){
		$body.='<p><strong>Nachricht:</strong> '.$_POST['message'].'</p>';
	}

	$mail->Body = $body;

	//Senden
	if (!$mail->send()) {
		$message = 'Fehler!';
	} else {
		$message = 'Daten gesendet!';
	}

	$response = ['message' => $message];

	header('Content-type: application/json');
	echo json_encode($response);
?>