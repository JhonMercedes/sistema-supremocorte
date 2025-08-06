<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dados = file_get_contents("php://input");

if ($dados) {
    file_put_contents(__DIR__ . "/produtos.json", $dados);

  echo "OK";
} else {
  http_response_code(400);
  echo "Erro ao receber dados.";
}
?>
