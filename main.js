
const express = require('express');
const aplicacion = express();
const { Router } = express;
const port = 8080;


const rutaProductos = Router();


aplicacion.use(express.json());
aplicacion.use(express.urlencoded({extended:true}));

aplicacion.use('/static',express.static(__dirname + '/public'))

class Contenedor{
    constructor(productos){
        this.productos = productos;
    }
     save(objeto){
        if(objeto.id){
            this.productos.push(objeto);
            return objeto.id;
        }
        let id = 1;
        this.productos.forEach((element, index )=>{
            if(element.id >= id){
                id = element.id + 1;
            }
        });
        objeto.id = id;
        this.productos.push(objeto);
        return id;
        
    }   
     getById(id){
        let objetoSeleccionado = null;
        this.productos.forEach(element => {
            if(element.id == id){
                objetoSeleccionado = element;
            }
        });
        return objetoSeleccionado;
    }
    update(producto){
        this.productos = this.productos.map((element) => {
            if (element.id == producto.id) {
              return producto;
            }
            return element;
        });
    }

    getAll(){
        return this.productos;
    }

     deleteById(id){
        let indexSeleccionado = -1;
        this.productos.forEach((element,index) =>{
            if(element.id == id){
                indexSeleccionado = index;
            }
        });
        if(indexSeleccionado != -1){
            this.productos.splice(indexSeleccionado,1);
        }
    }
     deleteAll(){
        this.productos = [];
    }
}


const productos = new Contenedor([]);

productos.save({
    title: 'Pizza',
    price:  '4000',
    thumnail:'image'
})
productos.save({
    title: 'empanada',
    price:  '3000',
    thumnail:'image'
})


//Endpoints 

rutaProductos.get('/:id', (peticion, respuesta) =>{
    const id = parseInt(peticion.params.id);
    const producto = productos.getById(id);
    if(producto){
        respuesta.json(producto);
    } else{
        respuesta.status(404);
        respuesta.json({error : 'producto no encontrado'});
    }
    
});

rutaProductos.get('/', (peticion, respuesta) =>{
    const listaProductos = productos.getAll();
    respuesta.json(listaProductos);
    
});

rutaProductos.post('/', (peticion, respuesta) =>{

});

rutaProductos.put('/:id', (peticion, respuesta) =>{
    const producto = peticion.body;
    const id = peticion.params.id;

    productos.update({id,...producto});
    respuesta.json({
        status:'ok'
    });
    
});

rutaProductos.delete('/:id', (peticion, respuesta) =>{
    const id = parseInt(peticion.params.id);
    const producto = productos.getById(id);
    if(producto){
        respuesta.json(producto);
    } else{
        respuesta.status(404);
        respuesta.json({error : 'producto no encontrado'});
    }
    
});

aplicacion.use('/api/productos', rutaProductos);


const servidor = aplicacion.listen(port,() =>{
    console.log(`Servidor escuchando: ${servidor.address().port}`);
});

servidor.on('error', error => console.log(`Error: ${error}`));