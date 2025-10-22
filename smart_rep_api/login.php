<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'koneksi.php';

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if ($email === '' || $password === '') {
  echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
  exit;
}

$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
  if (password_verify($password, $user['password'])) {
    echo json_encode([
      "status" => "success",
      "user_id" => $user['id'],
      "name" => $user['name']
    ]);
  } else {
    echo json_encode(["status" => "error", "message" => "Password salah"]);
  }
} else {
  echo json_encode(["status" => "error", "message" => "Email tidak ditemukan"]);
}
?>
