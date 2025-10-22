<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include 'koneksi.php';

$session_id = $_GET['session_id'] ?? '';

if ($session_id == '') {
  echo json_encode(["status" => "error", "message" => "Session ID kosong"]);
  exit;
}

$stmt = $conn->prepare("SELECT rep_number, timestamp FROM rep_logs WHERE session_id = ? ORDER BY timestamp ASC");
$stmt->execute([$session_id]);
$reps = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(["status" => "success", "data" => $reps]);
?>
