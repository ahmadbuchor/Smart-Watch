<?php
header("Content-Type: application/json");
include 'koneksi.php';

if (!isset($_GET['user_id'])) {
  echo json_encode(["status" => "error", "message" => "User ID tidak ada"]);
  exit;
}

$user_id = $_GET['user_id'];

try {
  $stmt = $conn->prepare("SELECT id, name, weight, height FROM users WHERE id = ?");
  $stmt->execute([$user_id]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($user) {
    echo json_encode(["status" => "success", "user" => $user]);
  } else {
    echo json_encode(["status" => "error", "message" => "User tidak ditemukan"]);
  }
} catch (PDOException $e) {
  echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
