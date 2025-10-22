<?php
include 'koneksi.php';

$session_id = $_GET['session_id'];

$stmt = $conn->prepare("SELECT * FROM rep_logs WHERE session_id = ? ORDER BY rep_number ASC");
$stmt->execute([$session_id]);
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($data);
?>
