import React, {useEffect, useState} from "react";
import axios from 'axios';
import './API.css'

function API()
{
    const [data, setData] = useState(null);
    const [geoData, setGeoData] = useState(null);
    const [lat, setLat] = useState(42.3478);
    const [long, setLong] = useState(-71.0466);
    const [tap, setTap] = useState(false);


    const api = `https://api.tomorrow.io/v4/weather/forecast?location=${lat},${long}&apikey=aQI0MvS5hPvnNoII3NGBNw9rnTIbWuzw`
    const geoEncodingApi = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}8&lon=${long}&apiKey=cee0190487354dbdb089268c178bfbb4`
    async function fetchAPI()
    {
        try
        {
            const response = await axios.get(api)
            setData(response.data)
        }
        catch(e)
        {
            console.log(e)
        }
       
    }
    async function fetchGeoEncodingAPI()
    {
        try 
        {
            const response = await axios.get(geoEncodingApi)
            setGeoData(response.data)
            console.log(response.data)
        }
        catch(e)
        {
            console.log(e)
        }

    }
    useEffect(() => {
        fetchAPI()
        fetchGeoEncodingAPI()
    }, [tap])


    if (data === null || geoData === null)
    {
        return <div style={{height: "100vh", textAlign: "center"}}>loading...</div>
    }
    return<>  
        <div style={{fontSize: 20, marginTop: 3}}>{geoData.features[0].properties.city} - {geoData.features[0].properties.country}</div>
        <div>
            <input type="text" value={lat}  onChange={(e) => {setLat(e.target.value)}}/>
            <input type="text" value={long}  onChange={(e) => {setLong(e.target.value)}}/>
            <button onClick={() => {setTap(!tap)}}>Search</button>
        </div>
        <div className="cardHolder">{data.timelines.daily.map((item, index) => {
            return <div key={item.time} className="main">
                <Card color={"rgb(0, 31, 46)"} z={1}>
                <div>Date: {new Date(item.time).toLocaleDateString()}</div>
                    <div>Temperature Avg: {item.values.temperatureAvg}°C</div>
                    <div>Temperature Max: {item.values.temperatureMax}°C</div>
                    <div>Temperature Min: {item.values.temperatureMin}°C</div>
                </Card>
                <div className="humidityHolder">
                    <Card color={"rgb(169, 11, 135)"} z={0}>
                            <div>Humidity Avg: {item.values.humidityAvg}°C</div>
                            <div>Humidity Max: {item.values.humidityMax}°C</div>
                            <div>Humidity Min: {item.values.humidityMin}°C</div>
                    </Card>
                </div>
                <div className="windspeedHolder">
                    <Card color={"rgb(20, 101, 109)"} z={0}>
                            <div>WindSpeed Avg: {item.values.windSpeedAvg}°C</div>
                            <div>WindSpeed Max: {item.values.windSpeedMax}°C</div>
                            <div>WindSpeed Min: {item.values.windSpeedMin}°C</div>
                    </Card>
                </div>
            </div>
        })}</div>
    </>
}

function Card({children, color, z}) {
    return<>
        <div className="card" style={{backgroundColor: color, zIndex: z}}>
            {children}
        </div>
    </>
}

export default API; 