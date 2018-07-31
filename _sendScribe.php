<?php

function enviar_datos(){
  global $curl_post_data;
  global $resultado;
  global $urlTimeStampClick;   

  $service_url = 'https://endpoint.scribesoft.com/v1/orgs/27038/requests/7030?accesstoken=8d0e3e43-a352-409a-bbee-401e2ee99b9f'; 

  $curl = curl_init($service_url);
  
  $esX = explode('*',$_POST['estado']);
  $estado = $esX[0];
  $estadoGUID = $esX[1];
  
  $tipoRegistro = $_POST['tipoRegistro'];
  //Check Activo

  if($tipoRegistro=='10183'){
    $GUIDAreaInteres="a8839dc4-6572-e211-b35f-6cae8b2a4ddc";
    $AreaInteres = "EQUIVALENCIA";
  }else{
    //Check No actuivo
    $GUIDAreaInteres="b0839dc4-6572-e211-b35f-6cae8b2a4ddc";
    $AreaInteres = "PRIMER INGRESO";
  }
  $data = array(
        'Nombre' => htmlspecialchars($_POST['nombre']),
        'ApellidoPaterno' => htmlspecialchars($_POST['apaterno']),
        'ApellidoMaterno' => htmlspecialchars($_POST['amaterno']),
        'CorreoElectronico' => htmlspecialchars($_POST['email']),
        'Telefono' => htmlspecialchars($_POST['celular']),
        'TelefonoPredictivo' => htmlspecialchars($_POST['telefonopredictivo']),
        'TelefonoCasaPredictivo' => htmlspecialchars($_POST['telefonopredictivo2']),
        'Estado' => htmlspecialchars($estado),
        'GUIDEstado' => htmlspecialchars($estadoGUID),
        'FuenteObtencion'=>"WEB",
        'FuenteNegocio'=>"WEB",
        'GUIDFuentedeObtencion'=>"4089dd13-6072-e211-b35f-6cae8b2a4ddc",
        'AreaInteres' => htmlspecialchars($AreaInteres),
        'GUIDAreaInteres' => htmlspecialchars($GUIDAreaInteres),
        'Campus' => htmlspecialchars($_POST['campus']),
        'Modalidad' => htmlspecialchars($_POST['modalidad']),
        'Nivel' => htmlspecialchars($_POST['nivel']),
        'Carrera' => htmlspecialchars($_POST['carrera']),
        'Ciclo' => htmlspecialchars($_POST['ciclo']),
        'OtroCampus' => htmlspecialchars($_POST['campus']),
        'Cookie' => htmlspecialchars($_POST['cookie']),
        'Banner' => htmlspecialchars($_POST['banner']),
        'Prioridad' => htmlspecialchars($_POST['prioridad']),
        'Attemp' => htmlspecialchars($_POST['attemp']),
        'LeadID' => htmlspecialchars(""),
        'CID' => htmlspecialchars($_POST['cid']),
        'CanalPreferido' => htmlspecialchars('VOZ'),
        'GUIDUsuario' => htmlspecialchars($_POST['GUIDUsuario']),
        'Usuario' => htmlspecialchars($_POST['GUIDUsuario']),
        'GUIDCampus' => htmlspecialchars($_POST['GUIDCampus']),  
        'GUIDCarrera' => htmlspecialchars($_POST['GUIDCarrera']),  
        'GUIDCiclo' => htmlspecialchars($_POST['GUIDCiclo']),  
        'GUIDModalidad' => htmlspecialchars($_POST['GUIDModalidad']),  
        'GUIDNivelInteres' => htmlspecialchars($_POST['GUIDNivelInteres']),
        'Team' => htmlspecialchars($_POST['team'])  
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

