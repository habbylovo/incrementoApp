jQuery(document).ready(function($){    
	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::: Cargando data :::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/    

    if (url=='resumen') { 
        setTimeout(function(){
            $(".title").html('Resumen');
            // console.log(resultados) 
            cargarData();             
            //Esconder div de carga 
            ocultarLoad();
        },1000);        
    }

    function cargarData(){
        var porcentaje = ((resultados[0].recaudoPretendido>0)?(resultados[0].sumaAbonos*100)/resultados[0].recaudoPretendido:0);
        $('#fecha').text(resultados[0].fecha);
        $('#cIniciales').text(resultados[0].clientesIniciales);
        $('#cNuevos').text(resultados[0].nuevosClientes);
        $('#totalClientes').text(resultados[0].totalClientes);      
        $('#cobradas').text(resultados[0].cobradas);
        $('#noCobradas').text(resultados[0].noCobradas);
        $('#sInicial').text('$'+resultados[0].saldoInicial);
        $('#recaudoPretendido').text('$'+resultados[0].recaudoPretendido);              
        $('#recaudo').text('$'+resultados[0].sumaAbonos+' / '+porcentaje.toFixed(2)+'%');       
        $('#noPago').text(resultados[0].noPagos);
        $('#ventas').text('$'+resultados[0].sumaVentas);
        $('#gastos').text('$'+resultados[0].sumGastos);     
        $('#ingresos').text('$'+resultados[0].sumIngresos);
        $('#egresos').text('$'+resultados[0].sumEgresos);
        $('#sFinal').text('$'+resultados[0].saldoFinal); 
    }   

});