<?php
$servername = "localhost";
$username = "root"; // Usuario por defecto de MySQL en XAMPP
$password = "";     // Sin contraseña por defecto
$dbname = "lingualeap";  // Nombre de la base de datos que creaste

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>
