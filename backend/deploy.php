<?php
// Captura erros do PHP e evita HTML
ini_set('display_errors', 0);
error_reporting(0);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

try {
    // Debug: verifica se chegou até aqui
    error_log("Deploy.php executado");
    
    // Verifica se o script existe
    $scriptPath = '/var/www/html/deploy.sh';
    
    if (!file_exists($scriptPath)) {
        throw new Exception("Script deploy.sh não encontrado em: $scriptPath");
    }
    
    error_log("Script encontrado: $scriptPath");
    
    // Torna o script executável
    chmod($scriptPath, 0755);
    error_log("Permissões definidas para: $scriptPath");
    
    // Executa o script e captura a saída
    $output = [];
    $returnCode = 0;
    
    // Torna o script executável
    chmod($scriptPath, 0755);
    error_log("Permissões definidas para: $scriptPath");
    
    // Executa o script e captura a saída
    $output = [];
    $returnCode = 0;
    
    $command = "sudo -u root /var/www/html/deploy.sh 2>&1";
    error_log("Executando comando: $command");
    
    exec($command, $output, $returnCode);
    
    error_log("Return code: $returnCode");
    error_log("Output: " . implode("\n", $output));
    
    if ($returnCode === 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Deploy executado com sucesso!',
            'output' => $output
        ]);
    } else {
        throw new Exception("Script falhou com código: $returnCode. Output: " . implode("\n", $output));
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Erro no deploy: ' . $e->getMessage(),
        'output' => $output ?? []
    ]);
}
?>