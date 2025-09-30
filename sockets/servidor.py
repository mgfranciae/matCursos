import socket
import threading

HOST = '127.0.0.1'  # Dirección IP del servidor (localhost)
PORT = 12345        # Puerto de escucha del servidor

clientes = []
nombres = []

def broadcast(mensaje):
    for cliente in clientes:
        try:
            cliente.send(mensaje.encode('utf-8'))
        except:
            # Si el cliente se desconecta inesperadamente
            if cliente in clientes:
                indice = clientes.index(cliente)
                nombre = nombres[indice]
                clientes.remove(cliente)
                nombres.remove(nombre)
                broadcast(f'{nombre} ha abandonado el chat.'.encode('utf-8'))

def manejar_cliente(cliente):
    while True:
        try:
            mensaje = cliente.recv(1024).decode('utf-8')
            if mensaje:
                broadcast(f'{nombres[clientes.index(cliente)]}: {mensaje}'.encode('utf-8'))
            else:
                # Si el cliente envía un mensaje vacío, se desconecta
                indice = clientes.index(cliente)
                nombre = nombres[indice]
                clientes.remove(cliente)
                nombres.remove(nombre)
                cliente.close()
                broadcast(f'{nombre} ha abandonado el chat.'.encode('utf-8'))
                break
        except:
            # Si ocurre un error con la conexión del cliente
            if cliente in clientes:
                indice = clientes.index(cliente)
                nombre = nombres[indice]
                clientes.remove(cliente)
                nombres.remove(nombre)
                cliente.close()
                broadcast(f'{nombre} ha abandonado el chat.'.encode('utf-8'))
            break

def iniciar_servidor():
    servidor = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        servidor.bind((HOST, PORT))
    except socket.error as e:
        print(f"Error al enlazar el socket: {e}")
        return

    servidor.listen()
    print(f'Servidor escuchando en {HOST}:{PORT}')

    while True:
        cliente, direccion = servidor.accept()
        print(f'Cliente conectado desde {direccion}')

        cliente.send('NICK'.encode('utf-8'))
        nombre = cliente.recv(1024).decode('utf-8')
        nombres.append(nombre)
        clientes.append(cliente)

        broadcast(f'{nombre} se ha unido al chat.'.encode('utf-8'))

        hilo_cliente = threading.Thread(target=manejar_cliente, args=(cliente,))
        hilo_cliente.start()

if __name__ == "__main__":
    iniciar_servidor()