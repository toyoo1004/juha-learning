import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=import.meta.dirname;
http.createServer(async(req,res)=>{try{const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]==='/'?'/index.html':req.url.split('?')[0]));if(!file.startsWith(root+path.sep))throw Error();const data=await readFile(file);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.mp3':'audio/mpeg'})[path.extname(file)]||'application/octet-stream');res.end(data);}catch{res.writeHead(404);res.end('Not found');}}).listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('Learning app listening on port '+(process.env.PORT||3000)));
