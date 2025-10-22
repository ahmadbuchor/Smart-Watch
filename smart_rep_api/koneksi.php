<?php
$host = "localhost";
$dbname = "smart_rep";  // sesuaikan nama database
$username = "root";     // default XAMPP
$password = "";         // default XAMPP kosong

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["status" => "error", "message" => $e->getMessage()]));
}
?>
