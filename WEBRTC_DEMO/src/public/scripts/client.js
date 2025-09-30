// Client-side WebRTC logic

let localStream;
let peerConnection;
const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }; // STUN for local NAT

// Initialize WebRTC
function initWebRTC(socket, roomId, userId) {
  console.log('Initializing WebRTC...');
  
  // Get local media (video + audio)
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      console.log('Local stream obtained.');
      localStream = stream;
      document.getElementById('localVideo').srcObject = stream;
      
      // Join room via signaling
      socket.emit('join-room', roomId, userId);
      
      // Create peer connection
      peerConnection = new RTCPeerConnection(config);
      localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
      
      // Handle remote stream
      peerConnection.ontrack = (event) => {
        console.log('Remote stream received.');
        document.getElementById('remoteVideo').srcObject = event.streams[0];
      };
      
      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Sending ICE candidate.');
          socket.emit('ice-candidate', { candidate: event.candidate, roomId, from: userId });
        }
      };
      
      // Listen for user connection
      socket.on('user-connected', (otherUserId) => {
        console.log(`Other user connected: ${otherUserId}`);
        createOffer(otherUserId); // Initiate offer
      });
    })
    .catch(err => console.error('Error accessing media:', err));
  
  // Signaling event listeners
  socket.on('offer', (data) => {
    console.log('Received offer.');
    handleOffer(data.offer, data.from);
  });
  
  socket.on('answer', (data) => {
    console.log('Received answer.');
    peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
  });
  
  socket.on('ice-candidate', (data) => {
    console.log('Received ICE candidate.');
    peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
  });
}

// Create and send offer
function createOffer(toUserId) {
  peerConnection.createOffer()
    .then(offer => peerConnection.setLocalDescription(offer))
    .then(() => {
      console.log('Offer created and set.');
      socket.emit('offer', { offer: peerConnection.localDescription, roomId, from: userId, to: toUserId });
    });
}

// Handle incoming offer
function handleOffer(offer, from) {
  peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
    .then(() => peerConnection.createAnswer())
    .then(answer => peerConnection.setLocalDescription(answer))
    .then(() => {
      console.log('Answer created and sent.');
      socket.emit('answer', { answer: peerConnection.localDescription, roomId, from: userId, to: from });
    });
}