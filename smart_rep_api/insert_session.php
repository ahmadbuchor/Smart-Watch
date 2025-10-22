<?php
include 'koneksi.php';

$user_id = $_POST['user_id'];
$start_time = $_POST['start_time'];
$end_time = $_POST['end_time'];
$total_reps = $_POST['total_reps'];
$total_calories = $_POST['total_calories'];

$sql = "INSERT INTO workout_sessions (user_id, start_time, end_time, total_reps, total_calories) 
VALUES ('$user_id', '$start_time', '$end_time', '$total_reps', '$total_calories')";

if ($conn->query($sql) === TRUE) {
  echo json_encode(["status" => "success"]);
} else {
  echo json_encode(["status" => "error", "message" => $conn->error]);
}
?>
