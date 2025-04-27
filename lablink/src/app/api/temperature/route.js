const SerialPort = require("serialport");
const fs = require("fs");

const port = new SerialPort("/dev/ttyUSB0", { baudRate: 115200 }); // Or COM3 on Windows

export async function POST() {
  // this will push to Google Drive
}

export async function GET(req, res) {
  // this will use the serial to get the tempratue
  console.log("Reading temperature");

  SerialPort.list()
  // port.on("data", (data) => {
  //   const str = data.toString();
  //   const match = str.match(/DS18B20 Temperature: ([\d\.\-]+)/);
  //   if (match) {
  //     const temp = parseFloat(match[1]);
  //     // fs.writeFileSync("./temp.txt", temp.toString());
  //   }
  // });

  // port.on("error", (data)=> {
  //   console.log("ERROR:")
  // })

  return new Response(JSON.stringify({ hi: "hi" }), { status: 200 });
}
