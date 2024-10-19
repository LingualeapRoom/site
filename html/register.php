<?php
include '../config.php'; // Establecer la conexión a la base de datos

// Recoger datos del formulario
$nombre = $_POST['nombre'];
$edad = $_POST['edad']; // Asegúrate de recoger la edad
$correo = $_POST['email']; 
$contrasena = $_POST['password'];

// Verifica si el usuario ya existe
$query = "SELECT * FROM usuarios WHERE email = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $correo);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // El usuario ya existe
    $mensaje = "El usuario ya existe en la base de datos.";
    $tipo_mensaje = "error";

    // Redirigir a la página de registro con el mensaje de error
    echo "<script>
        window.location.href = 'registrarse.html?mensaje=" . urlencode($mensaje) . "&tipo_mensaje=" . $tipo_mensaje . "';
    </script>";
    exit();
} else {
    // Encriptar la contraseña antes de almacenarla
    $contrasena_encriptada = password_hash($contrasena, PASSWORD_DEFAULT);

    // Insertar datos en la base de datos, incluyendo la edad
    $sql = "INSERT INTO usuarios (nombre, email, contraseña, edad) VALUES (?, ?, ?, ?)";
    $stmt_insert = $conn->prepare($sql);

    if (!$stmt_insert) {
        echo "Error en la preparación de la declaración: " . $conn->error;
        exit();
    }
    
    // Cambia 'sss' a 'sssi' para incluir la edad
    $stmt_insert->bind_param("sssi", $nombre, $correo, $contrasena_encriptada, $edad); // Agrega el parámetro de edad

    if ($stmt_insert->execute()) {
        // Registro exitoso, obtener el ID del usuario
        $usuario_id = $conn->insert_id; // Obtener el ID del último usuario insertado

        // Mensaje de éxito para SweetAlert
        $mensaje = "Te has registrado con éxito.";
        $tipo_mensaje = "success"; // Cambiar a "success" para SweetAlert

        // Redirigir a la página de planes y pasar el ID del usuario en la URL
        echo "<script>
            window.location.href = 'planes.html?id=" . $usuario_id . "&mensaje=" . urlencode($mensaje) . "&tipo_mensaje=" . $tipo_mensaje . "';
        </script>";
        exit();
    } else {
        // Error al insertar
        $mensaje = "Error: " . $stmt_insert->error;
        $tipo_mensaje = "error";
    
        // Redirigir de vuelta a la página de registro con el mensaje de error
        echo "<script>
            window.location.href = 'registrarse.html?mensaje=" . urlencode($mensaje) . "&tipo_mensaje=" . $tipo_mensaje . "';
        </script>";
        exit();
    }
}

// Cerrar declaraciones y conexión
$stmt->close(); // Cerrar la declaración de verificación
$conn->close(); // Cerrar la conexión
?>
