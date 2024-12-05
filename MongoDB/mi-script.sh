#!/bin/bash

# Nombre del contenedor
CONTAINER_NAME="mongo_container"

# Nombre de la imagen de MongoDB
IMAGE_NAME="mongo:latest"

# Comprobar si el contenedor ya existe y eliminarlo si es necesario
if [ "$(sudo docker ps -a -q -f name=$CONTAINER_NAME)" ]; then
    echo "El contenedor $CONTAINER_NAME ya existe. Eliminándolo..."
    sudo docker rm -f $CONTAINER_NAME  # Fuerza la eliminación del contenedor existente
fi

# Ejecutar el contenedor de MongoDB en modo interactivo
echo "Creando y ejecutando el contenedor $CONTAINER_NAME..."
sudo docker run -it --name $CONTAINER_NAME -p 27017:27017 -v mongo_data:/data/db $IMAGE_NAME /bin/bash

# Iniciar MongoDB dentro del contenedor (este comando se ejecutará después de acceder al contenedor)
echo "Iniciando MongoDB dentro del contenedor. Ejecuta 'mongod --bind_ip_all' para iniciar el servidor."
