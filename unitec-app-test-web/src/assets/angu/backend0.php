<?php

function enviar_datos(){
  global $curl_post_data;
  global $resultado;
  global $lpVisitada;
  global $urlTimeStampClick;   
  $service_url = 'https://endpoint.scribesoft.com/v1/orgs/27038/requests/5907?accesstoken=8d0e3e43-a352-409a-bbee-401e2ee99b9f'; //Ultima URL proporcionada por Richard 03/05/2018
  $curl = curl_init($service_url);
  $data = array(
        'FirstName' => htmlspecialchars($_POST["theData"]['nombre']),
        'LastName' => htmlspecialchars($_POST["theData"]['apaterno']),
        'new_apellidomaterno' => htmlspecialchars($_POST["theData"]['amaterno']),
        'new_campus' => htmlspecialchars($_POST["theData"]['campus']),
        'emailaddress1' => "email@email.com",
        'new_sexo' => htmlspecialchars($_POST["theData"]['sexo']),
        'new_ciclo' => htmlspecialchars($_POST["theData"]['ciclo']),
        'new_banner' => htmlspecialchars($_POST["theData"]['banner']),
        'new_esalumno' => htmlspecialchars($_POST["theData"]['esAlumno']),
        'new_calidadregistro' => htmlspecialchars($_POST["theData"]['calidadRegistro']),
        'new_tipoRegistro' => htmlspecialchars($_POST["theData"]['tipoRegistro']),
        'new_subNivelInteres' => htmlspecialchars($_POST["theData"]['subnivelinteres']),
        'new_carreraInteres' => htmlspecialchars($_POST["theData"]['idCarrera']),
        'new_carrera' => htmlspecialchars($_POST["theData"]['carrera']),
        'new_nivelInteres' => htmlspecialchars($_POST["theData"]['nivelInteres']),
        'new_micrositio' => htmlspecialchars($_POST["theData"]['micrositio']),
        'mobilephone' => htmlspecialchars($_POST["theData"]['celular']),
        'new_estado' => htmlspecialchars($_POST["theData"]['estado']),
        'new_fechaNacimiento' => htmlspecialchars($_POST["theData"]['fechaNacimiento']),
        'new_fechaRegistro' => htmlspecialchars($_POST["theData"]['fechaRegistro']),
        'new_equipo' => htmlspecialchars($_POST["theData"]['equipo']),
        'telephone1' => htmlspecialchars($_POST["theData"]['telefonoPredictivo']),
        'new_prioridad' => htmlspecialchars($_POST["theData"]['prioridad']),
        'telephone2' => htmlspecialchars($_POST["theData"]['telefonoPredictivo2']),
        'new_enviarCC' => htmlspecialchars($_POST["theData"]['enviarCC']),
        'new_nacionalidad' => htmlspecialchars($_POST["theData"]['nacionalidad']),
        'new_cid' => htmlspecialchars($_POST["theData"]['cid']),
        'new_leadid' => htmlspecialchars($_POST["theData"]['leadID']),
        'new_attemp' => htmlspecialchars($_POST["theData"]['attemp']),
        'new_fuenteObtencion' => htmlspecialchars($_POST["theData"]['fuenteObtencion']),
        'new_universidadinteres' => htmlspecialchars($_POST["theData"]['universidadInteres']),
        'new_EsperaResultadosUPublica' => htmlspecialchars($_POST["theData"]['esParaResultadosUPublica']),
        'new_EsPadredePrepa' => htmlspecialchars($_POST["theData"]['esPadreDePrepa']),
        'new_cookieHubspot' => htmlspecialchars($_POST["theData"]['cookieHubspot']),
        'new_urlreferrer' => htmlspecialchars($_POST["theData"]['urlReferrer']),
        'urlLandingPage' => htmlspecialchars($lpVisitada),
        'new_timestamp' => htmlspecialchars($urlTimeStampClick),
        'new_telefonodomicilio' => htmlspecialchars($_POST["theData"]['telefonoPredictivo']),
        'new_telefonotrabajo' => htmlspecialchars($_POST["theData"]['telefonoPredictivo2']),
        'vid' => htmlspecialchars("12313333"),
        "ContactUpsert" => "12313333"
  );
  $curl_post_data = json_encode($data);
  $largo = strlen($curl_post_data); 
  curl_setopt($curl, CURLOPT_POST, true);
  curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST"); 
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($curl, CURLOPT_POSTFIELDS, $curl_post_data);
  curl_setopt($curl, CURLOPT_HTTPHEADER, array(                                                                          
    'content-type: application/json',                                                                                
    'content-length: '.strlen($curl_post_data) )                                                                       
  );
  
  $curl_response = curl_exec($curl);
  $cInfo = curl_getinfo($curl);
  $cError = curl_error($curl);
  $httpCode = $cInfo["http_code"];
 
  if ($curl_response === false) {
    curl_close($curl);    
    echo "cError: $cError<br><br>";
    echo "cInfo: ";
    print_r ($cInfo);    
    $logfile = fopen("logs.txt", "a") or die("Unable to open file!");
    $txt = "cError: $cError<br><br>".'<br><br>error occured during curl exec.';
    fwrite($logfile, "\n". $txt);
    fclose($logfile);
    die('<br><br>error occured during curl exec.');
  }
  else {
 
    curl_close($curl);
    switch ($httpCode) {
 
      case 200:
        echo "200"; 
        $resultado = "¡Operación exitosa!<br>";
        $resultado .= "Datos: ".str_replace('","', '", "', $curl_post_data)."<br>";
        echo $resultado;
        $logfile = fopen("logs.txt", "a") or die("Unable to open file!");
        $txt = $resultado;
        fwrite($logfile, "\n". $txt);
        fclose($logfile);
        break;
      case 400: // url incorrecta
        echo "400";
        $resultado .= "<br>Fallo la Operación<br>";
        $resultado .= "httpCode: $httpCode<br><br>";
        $resultado .= "Datos: ".str_replace('","', '", "', $curl_post_data)."<br><br>";
        $resultado .= "curl_response: $curl_response<br>";
        echo $resultado;
        $logfile = fopen("logs.txt", "a") or die("Unable to open file!");
        $txt = $resultado;
        fwrite($logfile, "\n". $txt);
        fclose($logfile);
        break;
 
      default:
        echo "default";
        $resultado = "Fallo la Operación ;-( <br>";
        $resultado .= "httpCode: $httpCode<br><br>";
        $resultado .= "Datos: ".str_replace('","', '", "', $curl_post_data)."<br><br>";
        $resultado .= "curl_response: $curl_response<br><br>";
        $resultado .= "cError: $cError<br><br>";
        echo $resultado;        
        $decoded = json_decode($curl_response);
        $logfile = fopen("logs.txt", "a") or die("Unable to open file!");
        $txt = $resultado.$decoded;
        fwrite($logfile, "\n". $txt);
        fclose($logfile);
        if (isset($decoded->response->status) && $decoded->response->status == 'ERROR') {
          die('error occured: ' . $decoded->response->errormessage);
        } 
    }
  }
}
enviar_datos();
?>
