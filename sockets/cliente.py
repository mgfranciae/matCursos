import socket
import threading

HOST = '127.0.0.1'  # Dirección IP del servidor
PORT = 12345        # Puerto del servidor

def recibir_mensajes(cliente):
    while True:
        try:
            mensaje = cliente.recv(1024).decode('utf-8')
            if mensaje == 'NICK':
                cliente.send(input('Elige un nombre: ').encode('utf-8'))
            else:
                print(mensaje)
        except:
            print('Error al recibir mensajes del servidor.')
            cliente.close()
            break

def enviar_mensajes(cliente):
    while True:
        mensaje = input()
        cliente.send(mensaje.encode('utf-8'))

def iniciar_cliente():
    cliente = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        cliente.connect((HOST, PORT))
        print(f'Conectado al servidor en {HOST}:{PORT}')
    except socket.error as e:
        print(f'Error al conectar al servidor: {e}')
        return

    hilo_recibir = threading.Thread(target=recibir_mensajes, args=(cliente,))
    hilo_enviar = threading.Thread(target=enviar_mensajes, args=(cliente,))

    hilo_recibir.start()
    hilo_enviar.start()

if __name__ == "__main__":
    iniciar_cliente()