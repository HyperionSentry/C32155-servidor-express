const express = require("express");
const path = require("path");

const aplicacion = express();
const puerto = 8080;

const server = aplicacion.listen(puerto, () => {
  console.log("Server Listo. Escuchando en puerto ", puerto);
});
server.on("error", (err) => {
  console.log("Se produjo un error".err);
});


// Mi logica
const fs = require('fs')

class Contenedor {
    constructor (archivo) {
        this.archivo = archivo;
    }

    async readFAsync() {
        try {
            console.log(this.archivo) 
            console.log(__dirname)
            //const myFilePath = path.resolve(__dirname, this.archivo);
            const myFilePath = path.resolve(__dirname, this.archivo);
            console.log(myFilePath)
            const data = await fs.promises.readFile(myFilePath,'utf-8')
            return JSON.parse(data)
        } catch (error) {
            console.log('Error leyendo el archivo'+ error);
        }
        
    }

    async writeFAsync(obj) {
       return await fs.promises.writeFile(this.archivo, JSON.stringify(obj, null, '\t'))
    }

    async save(obj){
        //Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.    

        if (fs.existsSync(this.archivo)) {
            const data = await this.readFAsync()
            obj.id = data.length + 1
            console.log(`El archivo existe, guardando album con id: ${obj.id}...`)
            data.push(obj);
            await this.writeFAsync(data)
            
        } else {
            obj.id = 1
            console.log(`El archivo no existe, creando uno nuevo con album de id: ${obj.id}...`)
            let arrObj = [obj]
            await this.writeFAsync(arrObj)
        }

        return obj.id

    }

    async getById(id){
        //Recibe un id y devuelve el objeto con ese id, o null si no está.
        try {
            const dataObj = await this.readFAsync()
            const found = dataObj.find( element => element.id === id)
            if (found == undefined) {
                console.log(`No existe un album con el id: ${id}`);
                return null
            } else {
                return found
            }
        } catch (error) {
            console.log('Error: '+ error);
        }
    }

    async getAll(){
        //Devuelve un array con los objetos presentes en el archivo.
        try {
            const dataObj = await this.readFAsync()
            return dataObj
        } catch (error) {
            console.log('Error: '+ error);
        }  
    }

    async deleteById(id){
        try {
            const dataObj = await this.readFAsync()
            const found = dataObj.find( element => element.id === id )
            if (found == undefined) {
                console.log(`No existe un album con el id: ${id}`);
            } else {
                console.log(`Se eliminara el album con el id: ${id}`);
                dataObj.splice(dataObj.indexOf(found), 1)
                await this.writeFAsync(dataObj)
            }
        } catch (error) {
            console.log('Error: '+ error);
        }
    }


    async deleteAll(){
        //Elimina todos los objetos presentes en el archivo.
        try {
            await this.writeFAsync([])
        } catch (error) {
            console.log('Error: '+ error);
        }
    }
}

const contenedor1 = new Contenedor('./productos.txt')
contenedor1.getAll().then( (result) => {
    console.log(result);
} )


//Logica Server
aplicacion.get("/", (request, response) => {
  const myFilePath = path.resolve(__dirname, "./views/vista1.html");
  response.sendFile(myFilePath);
});

aplicacion.get("/productos", (request, response) => {
  response.json({
     Todos: contenedor1.getAll()
  }) 
});

aplicacion.get("/productoRandom", (request, response) => {
  
  
}); 