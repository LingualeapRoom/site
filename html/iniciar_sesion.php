<?php
include '../config.php'; // Conexión a la base de datos

// Recoger los datos del formulario
$correo = $_POST['email'];
$contrasena = $_POST['password'];

// Consulta para verificar si el usuario existe usando consultas preparadas
$sql = "SELECT * FROM usuarios WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $correo);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // El usuario existe, ahora verificar la contraseña
    $row = $result->fetch_assoc();
    $contrasena_encriptada = $row['contraseña']; // Obtener la contraseña encriptada de la base de datos

    if (password_verify($contrasena, $contrasena_encriptada)) {
        // Iniciar sesión exitosamente
        echo "<script>
                window.location.href = 'LLL.html?mensaje=exito';
              </script>";
        exit();
    } else {
        // Contraseña incorrecta
        header("Location: iniciarsesion.html?mensaje=La%20contraseña%20es%20incorrecta&tipo_mensaje=error");
        exit();
    }
} else {
    // El usuario no existe
    header("Location: iniciarsesion.html?mensaje=No%20existe%20una%20cuenta%20con%20este%20correo%20electrónico.&tipo_mensaje=error");
    exit();
}

// Cerrar la conexión
$stmt->close(); // Cerrar la declaración
$conn->close(); // Cerrar la conexión
?>
