import express from 'express';
import fs from 'fs';
import fetch from 'node-fetch';
// Earth Engine client library requires special init; this is a placeholder.
// In deployment, ensure @google/earthengine is installed and service-account.json exists.
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8080;

app.get('/api/forecast', async (req, res) => {
  try{
    const { lat, lon } = req.query;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=wind_speed_10m,wind_direction_10m&forecast_days=2&timezone=auto`;
    const r = await fetch(url);
    const j = await r.json();
    res.json(j);
  }catch(e){
    res.status(500).json({error:String(e)});
  }
});

app.get('/', (req,res)=> res.send('Dehkhoda server running'));

app.listen(PORT, ()=> console.log('Server listening on', PORT));
