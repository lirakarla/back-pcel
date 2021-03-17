const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 4000;
const axios=require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use(
    cors({
      origin: function (origin, callback) {
        /*if(!origin) 
          return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1) {
          var msg =
            "The CORS policy for this site does not " +
            "allow access from the specified Origin.";
          return callback(msg, false);
        }*/
        return callback(null, true);
      }
    })
  );


app.get("/", async(req, res)=> {
        const response=await axios.get(`https://pcel.com/index.php?route=product/search&filter_name=${req.query.producto}&limit=${req.query.cantidad}&sort=p.price&order=${req.query.opciones}`)
      
        const dom = new JSDOM(response.data);
      
        const document=dom.window.document;
    
        const productos=[];
        const imagenes=Array.from (document.getElementsByClassName("image")).map(seccion=>{
            return seccion.firstChild.firstChild.src;
        })
    
    
        const descripciones=Array.from (document.getElementsByClassName("name")).map(seccion=>{
            return seccion.firstChild.textContent.replace(new RegExp('\n','g'), '');
    
        })
        const links=Array.from (document.getElementsByClassName("name")).map(seccion=>{
            return seccion.firstChild.href;
        })
      
    
        const precios=Array.from (document.getElementsByClassName("price")).map(seccion=>{
            if(seccion.childElementCount===1){
                return seccion.textContent.replace(new RegExp('\n','g'), '');
            }
            else{
                return seccion.children[0].textContent;
            }
        
        })
       
        for (let index = 0; index < precios.length; index++) {
            productos.push({
                imagen: imagenes[index],
                descripcion: descripciones[index],
                link: links[index],
                precio: precios[index]
            })
            
        }
        res.send(productos);
});


app.listen(port, () => {
    console.log(`WebScraping app listening at http://localhost:${port}`)
})
