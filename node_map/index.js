const express = require('express');
const axios = require('axios');
const polyline = require('@mapbox/polyline');

const app = express();
const port = 3000;

// Ruta para obtener la ruta entre dos puntos
app.get('/route', async (req, res) => {
  const { start, end } = req.query;

//   if (!start || !end) {
//     return res.status(400).json({ error: 'Please provide start and end points' });
//   }

  try {
    // Hacer la petición a GraphHopper para obtener la ruta
    const response = await axios.get(`http://127.0.0.1:8989/route/?point=11.019348%2C-74.850053&point=11.019466%2C-74.850989&profile=foot&layer=OpenStreetMap`);

    const path = response.data.paths[0]; // Obtener la primera ruta

    // Decodificar los puntos de la polyline
    const decodedPoints = polyline.decode(path.points);

    // Enviar la respuesta con los puntos decodificados
    res.json({
      distance: path.distance, // Distancia de la ruta en metros
      time: path.time, // Tiempo estimado de la ruta en milisegundos
      decoded_points: decodedPoints, // Puntos decodificados en [lat, lon]
      instructions: path.instructions, // Instrucciones de navegación paso a paso
    });
  } catch (error) {
    console.error('Error fetching route:', error.message);
    res.status(500).json({ error: 'Error fetching route' });
  }
});

// Iniciar el servidor en el puerto 3000
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
