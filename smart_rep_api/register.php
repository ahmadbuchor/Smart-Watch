<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$pdo = new PDO("mysql:host=localhost;dbname=smart_rep;charset=utf8", "root", "");

// Validasi data
if (!isset($_POST['name'], $_POST['email'], $_POST['password'], $_POST['weight'], $_POST['height'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Data tidak lengkap."
    ]);
    exit;
}

$name = trim($_POST['name']);
$email = trim($_POST['email']);
$password = password_hash($_POST['password'], PASSWORD_BCRYPT);
$weight = trim($_POST['weight']);
$height = trim($_POST['height']);

// Cek apakah email sudah terdaftar
$check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$check->execute([$email]);
if ($check->rowCount() > 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Email sudah terdaftar."
    ]);
    exit;
}

// Simpan user baru
$stmt = $pdo->prepare("INSERT INTO users (name, email, password, weight, height) VALUES (?, ?, ?, ?, ?)");
try {
    $stmt->execute([$name, $email, $password, $weight, $height]);
    echo json_encode([
        "status" => "success",
        "message" => "Registrasi berhasil."
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
