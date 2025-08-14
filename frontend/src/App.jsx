
import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";

export default function App(){
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [farms, setFarms] = useState([]);
  const [query, setQuery] = useState("");
  const [source, setSource] = useState({lat:31.378, lon:48.978});

  useEffect(()=>{
    fetch('/dehkoda_farms.csv').then(r=>r.text()).then(t=>{
      const rows = t.split(/\r?\n/).filter(Boolean);
      const header = rows[0].split(',').map(h=>h.trim());
      const nameIdx = header.findIndex(h=>/farm_name|نام مزرعه|مزرعه/i.test(h));
      const latIdx = header.findIndex(h=>/lat|عرض/i.test(h));
      const lonIdx = header.findIndex(h=>/lon|lng|طول/i.test(h));
      const out = rows.slice(1).map(row=>{
        const cols = row.split(',');
        return { farm_name: cols[nameIdx]||'', lat: parseFloat(cols[latIdx]), lon: parseFloat(cols[lonIdx]) };
      }).filter(f=>!isNaN(f.lat) && !isNaN(f.lon));
      setFarms(out);
    });
  },[]);

  useEffect(()=>{
    if(mapRef.current) return;
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {version:8,sources:{osm:{type:'raster',tiles:['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],tileSize:256}},layers:[{id:'osm',type:'raster',source:'osm'}]},
      center: [source.lon, source.lat],
      zoom: 12
    });
    mapRef.current = map;
    return ()=> map.remove();
  },[]);

  useEffect(()=>{
    if(!mapRef.current) return;
    mapRef.current.setCenter([source.lon, source.lat]);
  },[source]);

  return (
    <div style={{display:'flex',height:'100vh'}}>
      <div style={{width:420,padding:16,background:'#0b1220',overflow:'auto'}}>
        <h2>Dehkhoda Smoke Visualizer</h2>
        <p>نام مزرعه را تایپ کنید و از لیست انتخاب کنید، سپس شبیه‌سازی و لایه‌ها بارگذاری می‌شوند.</p>
        <input placeholder="جستجوی نام مزرعه..." value={query} onChange={e=>setQuery(e.target.value)} style={{width:'100%',padding:8,marginBottom:8}} />
        <div style={{maxHeight:400,overflow:'auto',border:'1px solid #233'}}>
          {farms.filter(f=>f.farm_name.toLowerCase().includes(query.toLowerCase())).slice(0,200).map((f,i)=>(
            <div key={i} style={{padding:10,borderBottom:'1px solid #223'}}>
              <button onClick={()=>{ setSource({lat:f.lat,lon:f.lon}); fetch('/api/forecast?lat='+f.lat+'&lon='+f.lon).then(r=>r.json()).then(j=>console.log('forecast',j));}} style={{background:'transparent',border:0,color:'white',textAlign:'left',width:'100%'}}>
                <div style={{fontWeight:600}}>{f.farm_name}</div>
                <div style={{fontSize:12, color:'#9aa'}}>({f.lat.toFixed(5)}, {f.lon.toFixed(5)})</div>
              </button>
            </div>
          ))}
        </div>
        <p style={{fontSize:12,color:'#9aa',marginTop:12}}>توجه: برای فعال شدن لایه‌های GEE و پیش‌بینی کامل باید بک‌اند را نیز اجرا و متصل کنید.</p>
      </div>
      <div style={{flex:1,position:'relative'}}>
        <div ref={mapContainer} style={{position:'absolute',inset:0}} />
      </div>
    </div>
  );
}
