<?php
header("Content-Type: application/json");
include("koneksi.php");

$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data['user_id'];
$name    = $data['name'];
$weight  = $data['weight'];
$height  = $data['height'];

try {
    $stmt = $conn->prepare("UPDATE users SET name = ?, weight = ?, height = ? WHERE id = ?");
    $stmt->execute([$name, $weight, $height, $user_id]);
    echo json_encode(["status" => "success", "message" => "Profile updated"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
