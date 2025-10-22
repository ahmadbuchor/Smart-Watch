<?php
include 'koneksi.php';

$session_id = $_POST['session_id'];
$rep_number = $_POST['rep_number'];
$timestamp = $_POST['timestamp'];
$imu_raw_data = $_POST['imu_raw_data'];

$sql = "INSERT INTO rep_logs (session_id, rep_number, timestamp, imu_raw_data)
VALUES ('$session_id', '$rep_number', '$timestamp', '$imu_raw_data')";

if ($conn->query($sql) === TRUE) {
  echo json_encode(["status" => "success"]);
} else {
  echo json_encode(["status" => "error", "message" => $conn->error]);
}
?>
