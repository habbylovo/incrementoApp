/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:::::::::::::::::::::::: Sincronización de data :::::::::::::::::::::
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

var conexion = true;

function sincronizar(exit=0){    
    if(navigator.onLine){        
        idb.peticion(exit);
    }  else {        
        var result = idb.select("usuario", function (isSelected, responseData) {
            if (isSelected) {
                if(responseData.length != 0){
                    responseData[0].usuario.estado = 0;
                    responseData[0].ruta.estado = 0;
                    idb.insert('usuario', responseData[0]); 
                    ocultarLoad();
                    idb.loadAlert('toast-top-right', 'Conecte su dispositivo a internet','Upps!');                                                               
                }
            }
            else {
                console.log("Error: " + responseText);
            }
        }); 
    }    
}      

addEventListener('online', (e) => {
    conexion = true;
    // console.log('hay conexion');
})
addEventListener('offline', (e) => {
    conexion = false;
    // console.log('no hay conexion');
})  

// Clic en opción sincronizar
$('#opt_sincronizar').click(function(event){ 
    mostrarLoad();                    
    sincronizar(); 
})

//Clic en cierre de sesión
$('#salir').on('click', function(event){ 
    event.preventDefault();        
    mostrarLoad();   
            
    var result = idb.select("usuario", function (isSelected, responseData) {
        if (isSelected) {
            if(responseData.length != 0){
                responseData[0].actualizado = 1; 
                responseData[0].usuario.estado = 1;
                responseData[0].ruta.estado = 1;

                idb.insert('usuario', responseData[0]); 
                // console.log(responseData[0]);
                sincronizar(1);                                                               
            }
        }
        else {
            console.log("Error: " + responseText);
        }
    });   
     
});

/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:::::::::::::::::::::::::::::: Div de carga :::::::::::::::::::::::::
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

function ocultarLoad(){
    $('.loader-wrapper').hide();
}

function mostrarLoad(){
    $('.loader-wrapper').show();
}

