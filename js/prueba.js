


// Function to toggle dropdowns
function toggleDropdown(dropdownId) {
    var dropdown = document.getElementById(dropdownId);
    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
}

// Close dropdown if clicked outside
window.onclick = function(event) {
    if (!event.target.matches('.notification-icon') && !event.target.matches('.menu-icon')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.style.display === "block") {
                openDropdown.style.display = "none";
            }
        }
    }
}











/*este me sirve */

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const toggleCameraButton = document.getElementById('toggleCamera');
const startCallButton = document.getElementById('startCallButton');

let localStream = null;
let isCameraOn = false; // Estado de la cámara
let peerConnection;

// Configuración de la conexión
const config = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' } // Servidor STUN de Google
    ]
};

// Conectar al servidor de señalización
const socket = io.connect('http://localhost:3000'); // Cambia la dirección si es necesario

// Función para encender/apagar la cámara
function toggleCamera() {
    if (isCameraOn) {
        // Apagar la cámara
        localStream.getTracks().forEach(track => track.stop());
        localVideo.srcObject = null;
        toggleCameraButton.textContent = '📷';
        isCameraOn = false;
    } else {
        // Encender la cámara
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                localStream = stream;
                localVideo.srcObject = localStream;
                toggleCameraButton.textContent = '📷';
                isCameraOn = true;

                // Si la conexión ya existe, añadir el stream local
                if (peerConnection) {
                    localStream.getTracks().forEach(track => {
                        peerConnection.addTrack(track, localStream);
                    });
                }
            })
            .catch(error => {
                console.error('Error al acceder a la cámara:', error);
            });
    }
}

// Crear conexión RTC
function createPeerConnection() {
    peerConnection = new RTCPeerConnection(config);

    // Cuando se recibe el stream remoto
    peerConnection.ontrack = event => {
        remoteVideo.srcObject = event.streams[0];
    };

    // Manejar candidatos ICE
    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            socket.emit('candidate', event.candidate);
        }
    };
}

// Iniciar llamada
function startCall() {
    if (!isCameraOn) {
        alert('Por favor, enciende la cámara antes de iniciar la llamada.');
        return; // No iniciar la llamada si la cámara está apagada
    }

    createPeerConnection();

    // Crear oferta y enviarla
    peerConnection.createOffer()
        .then(offer => {
            return peerConnection.setLocalDescription(offer);
        })
        .then(() => {
            socket.emit('offer', peerConnection.localDescription);
        })
        .catch(error => {
            console.error('Error al crear la oferta:', error);
        });
}

// Recibir oferta
socket.on('offer', offer => {
    createPeerConnection();
    peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
        .then(() => {
            return navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        })
        .then(stream => {
            localStream = stream;
            localVideo.srcObject = localStream;

            // Añadir el stream local
            stream.getTracks().forEach(track => {
                peerConnection.addTrack(track, stream);
            });

            // Crear respuesta
            return peerConnection.createAnswer();
        })
        .then(answer => {
            return peerConnection.setLocalDescription(answer);
        })
        .then(() => {
            socket.emit('answer', peerConnection.localDescription);
        })
        .catch(error => {
            console.error('Error al recibir la oferta:', error);
        });
});

// Recibir respuesta
socket.on('answer', answer => {
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});

// Recibir candidatos ICE
socket.on('candidate', candidate => {
    const iceCandidate = new RTCIceCandidate(candidate);
    peerConnection.addIceCandidate(iceCandidate)
        .catch(error => {
            console.error('Error al añadir el candidato ICE:', error);
        });
});

// Agregar evento para iniciar la llamada
startCallButton.addEventListener('click', startCall);
toggleCameraButton.addEventListener('click', toggleCamera);






// Función para añadir un nuevo mensaje al chat
function addMessage(messageText, isRight = true) {
    const chatBox = document.getElementById('chat-box');
    
    // Crear un nuevo div para el mensaje
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');

    // Alinear a la izquierda o a la derecha
    if (isRight) {
        messageDiv.classList.add('right');
    } else {
        messageDiv.classList.add('left');
    }

    // Añadir el texto del mensaje
    const messageContent = document.createElement('p');
    messageContent.textContent = messageText;
    messageDiv.appendChild(messageContent);

    // Añadir la hora actual
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const timeSpan = document.createElement('span');
    timeSpan.classList.add('time');
    timeSpan.textContent = currentTime;
    messageDiv.appendChild(timeSpan);

    // Añadir el nuevo mensaje al chat
    chatBox.appendChild(messageDiv);

    // Hacer scroll hacia abajo para mostrar el mensaje nuevo
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Función para manejar el envío de mensajes
function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value;

    if (messageText.trim() !== '') {
        addMessage(messageText); // Añadir el mensaje del usuario (alineado a la derecha)
        messageInput.value = ''; // Limpiar el input después de enviar el mensaje
    }
}

// Añadir eventos al botón y a la tecla "Enter"
document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('message-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
