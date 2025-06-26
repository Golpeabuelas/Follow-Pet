export const API_URL = 'https://follow-pet.onrender.com';

export const uploadImages = async (uri) => {
    const fileName = uri.split('/').pop();
    const match = /\.(\w+)$/.exec(fileName);
    const fileType = match ? `image/${match[1]}` : `image`;

    const file = {
        uri,
        name: fileName,
        type: fileType,
    };

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(`${API_URL}/cargarImagen`, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        });

        const data = await response.json();
        return data.ruta;
    } catch (error) {
        console.error("Error al subir la imagen:", error);
        console.error("Ruta de la imagen:", error);
        return null;
    }
};