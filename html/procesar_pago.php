<?php
include '../config.php'; // Conexión a la base de datos

// Recoger datos del formulario
$nombre = $_POST['nombre'];
$numero_tarjeta = $_POST['numero_tarjeta'];
$fecha_vencimiento = $_POST['fecha_vencimiento'];
$cvv = $_POST['cvv'];
$direccion = $_POST['direccion'];
$ciudad = $_POST['ciudad'];
$estado = $_POST['estado'];
$codigo_postal = $_POST['codigo_postal']; 
$pais = $_POST['pais'];
$usuario_id = $_POST['usuario_id']; // ID del usuario


// Insertar los datos del pago en la base de datos
$sql = "INSERT INTO pagos (id_usuario, nombre_titular, numero_tarjeta, fecha_vencimiento, cvv, direccion, ciudad, estado, codigo_postal, pais, fecha_pago) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo "Error en la preparación de la declaración: " . $conn->error;
    exit();
}

$stmt->bind_param("isssssssss", $usuario_id, $nombre, $numero_tarjeta, $fecha_vencimiento, $cvv, $direccion, $ciudad, $estado, $codigo_postal, $pais);

if ($stmt->execute()) {
    // Transacción exitosa
    echo "<script src='https://unpkg.com/sweetalert/dist/sweetalert.min.js'></script>";
    echo "<script>
        document.addEventListener('DOMContentLoaded', function() {
            swal({
                title: 'Transacción Exitosa',
                text: 'Tu pago se ha procesado correctamente.',
                icon: 'success',
                button: 'Aceptar',
            }).then((value) => {
                window.location.href = 'LLL.html'; // Redirigir a la página de inicio
            });
        });
    </script>";
}

// Cerrar declaraciones y conexión
$stmt->close();
$conn->close();
?>
