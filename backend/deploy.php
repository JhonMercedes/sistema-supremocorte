<?php
// deploy.php
header('Content-Type: application/json');

$output = [];
$return_var = 0;

// Executa o script deploy.sh
exec('bash /var/www/html/deploy.sh 2>&1', $output, $return_var);

if ($return_var === 0) {
    echo json_encode(["success" => true, "message" => "Deploy realizado com sucesso!", "output" => $output]);
} else {
    echo json_encode(["success" => false, "message" => "Erro ao realizar deploy.", "output" => $output]);
}
?>
