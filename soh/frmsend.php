<?php
if(isset($_POST['mails'])) {
 
    // Edita las líneas siguientes con tu dirección de correo y asunto
 
    $email_to = "javier099066@gmail.com";
 
    $email_subject = "Reporte desde beesoh.com";   
 
    function died($error) {
 
        // si hay algún error, el formulario puede desplegar su mensaje de aviso
 
        echo "Lo sentimos, hay un error en sus datos y el formulario no puede ser enviado. ";
 
        echo "Detalle de los errores.<br /><br />";
        
        echo $error."<br /><br />";
 
        echo "Porfavor corrije los errores e inténtelo de nuevo.<br /><br />";
        die();
    }
 
    // Se valida que los campos del formulairo estén llenos
 
    if(!isset($_POST['names']) ||
 
        !isset($_POST['mails']) ||
 
        !isset($_POST['radio']) ||
 
        !isset($_POST['link1'])) {
 
        died('Lo sentimos pero parece haber un problema con los datos enviados.');       
 
    }
 //Valor "name" nos sirve para crear las variables que recolectaran la información de cada campo
    
    $names = $_POST['names']; // requerido
 
    $mails = $_POST['mails']; // requerido
 
    $radio = $_POST['radio']; // requerido 

    $textarea = $_POST['textarea']; // opcional
    
    $link1 = $_POST['link1']; // requerido
    
    $link2 = $_POST['link2']; // opcional
    
    $link3 = $_POST['link3']; // opcional
    
 
    $error_message = "Error";

//Verificar que la dirección de correo sea válida 
    
   $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';
 
  if(!preg_match($email_exp,$mails)) {
 
    $error_message .= 'La dirección de correo proporcionada no es válida.<br />';
 
  }

//Validadacion de cadenas de texto

    $string_exp = "/^[A-Za-z .'-]+$/";

  if(!preg_match($string_exp,$names)) {
 
    $error_message .= 'El formato del nombre no es válido<br />';
 
  }
 
  if(strlen($textarea) > 900) {
 
    $error_message .= 'El formato del texto es muy largo.<br />';
 
  }
 
 
//Plantilla de mensaje

    $email_message = "Contenido del Reporte.\n\n";
 
     
 
//    function clean_string($string) {
// 
//      $bad = array("content-type","bcc:","to:","cc:","href");
// 
//      return str_replace($bad,"",$string);
// 
//    }
 
//     $texv .= "<b>Nombres: </b>" . $name . "<br>";
 
    $email_message .= "Nombre: " . $names . "\n";
 
    $email_message .= "Correo: " . $mails . "\n";
 
    $email_message .= "Problema: " . $radio . "\n";
 
    $email_message .= "Mensaje: " . $textarea . "\n";
   
    $email_message .= "Enlace infractor 1: " . $link1 . "\n";
    
    $email_message .= "Enlace infractor 2: " . $link2 . "\n";
    
    $email_message .= "Enlace infractor 3: " . $link3 . "\n";
   
    
 
//Encabezados
 
$headers = 'From: '.$mails."\r\n".
 
'Reply-To: '.$mails."\r\n" .
 
'X-Mailer: PHP/' . phpversion();
 
@mail($email_to, $email_subject, $email_message, $headers);  
 
?>



    <script>
     window.location.href='https://beesoh.com/p/18/received';
</script>

    <?php 
}
?>
