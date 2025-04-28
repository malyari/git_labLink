
import { SerialPort } from 'serialport';
import http from 'http';
import { DelimiterParser } from '@serialport/parser-delimiter';
import { appendData } from './upload.js';

// TODO: update to not rely on the logger name
const loggerName = "[I][INFO:063]: ";
let latestData = {};

const serialPath = "/dev/tty.usbserial-2110";
const serialBaud = 115200;
const serverPort = 3001;

const port = new SerialPort({
    path: serialPath,
    baudRate: serialBaud,
});

const parser = port.pipe(new DelimiterParser({ delimiter: loggerName }))

// this helps you identiy the serial port
SerialPort.list().then(ports => {
    console.log('Available Serial Ports:');
    ports.forEach((port, index) => {
        console.log(`Port ${index + 1}:`);
        console.log(`  Path: ${port.path}`);
        console.log(`  Manufacturer: ${port.manufacturer || 'Unknown'}`);
        console.log(`  Serial Number: ${port.serialNumber || 'Unknown'}`);
        console.log(`  Vendor ID: ${port.vendorId || 'Unknown'}`);
        console.log(`  Product ID: ${port.productId || 'Unknown'}`);
        console.log('-----------------------------------');
    });
}).catch(err => {
    console.error('Error listing ports:', err);
});

parser.on('error', (err) => {
    console.error('Serial Port Error:', err);
});

parser.on('data', async (data) => {
    const dataStr = data.toString();
    if (dataStr.includes('temperature_f')) {
        const jsonStart = dataStr.indexOf('{');
        const jsonEnd = dataStr.lastIndexOf('}');
        const jsonStr = dataStr.substring(jsonStart, jsonEnd + 1);

        try {
            console.log(jsonStr);
            latestData = JSON.parse(jsonStr.trim());
            await appendData(latestData);

        } catch (error) {
            console.error('Error parsing JSON:', jsonStr, error);
        }
    }
})

const server = http.createServer((req, res) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === 'GET' && pathname === '/sensor-data') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ...latestData, timestamp: new Date() }));

    } else if (req.method === 'GET' && pathname === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', timestamp: new Date() }));

    } else if (req.method === 'GET' && pathname === '/ports') {
        SerialPort.list().then(ports => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(ports));
        }).catch(err => {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        });

    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(serverPort, () => {
    console.log(`Serial HTTP server running at http://localhost:${serverPort}`);
});

