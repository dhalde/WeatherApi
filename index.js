const fs = require('fs');
const http = require('http');

var request = require('requests');

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceData = (tempVal, orgVal) => {
    var celTemp = (orgVal.main.temp - 273.15).toFixed(2);
    var celTemp_min = (orgVal.main.temp_min - 273.15).toFixed(2);
    var celTemp_max = (orgVal.main.temp_max - 273.15).toFixed(2);
    let temperature = tempVal.replace("{%tempval%}", celTemp);
    temperature = temperature.replace("{%tempmin%}", celTemp_min);
    temperature = temperature.replace("{%tempmax%}", celTemp_max);
    temperature = temperature.replace("{%city%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempStat%}", orgVal.weather[0].main);

    return temperature;
};

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        request("https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=72f1d6da804d59368430484d79d3e3ab")
            .on("data", (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData];
                // const celcuis = Math.round(arrData[0].main.temp - 273.15);
                // console.log(celcuis);
                let realTimeData = arrData.map(val => replaceData(homeFile, val)).join("");
                // console.log(val.main);
                res.write(realTimeData);
                // console.log(realTimeData);

            })
            .on("end", (err) => {
                if (err) return console.log("connection closed due to error", err);
                // console.log("end");
                res.end();

            });
    }
    else {
        res.end("File not found");
    }
});

server.listen(8000, "127.0.0.1");