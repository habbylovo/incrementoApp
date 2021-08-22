$(document).ready(function () { 
    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::: Cargas iniciales ::::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/ 
       
    cargar_rutas(); 
    
    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::::::::: Cargar rutas ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

    function cargar_rutas(){        
        $.ajax({
            type: 'post',
            url: url + 'reportes/rutas',           
            success: function (result) {
                $("#field_unidad").html(result);
            }
        }); 
    } 

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::::::: Formatear fechas ::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

    function formato_fechas(fecha){
        var fecha = fecha.split('/');
        fecha = fecha[2]+'-'+fecha[1]+'-'+fecha[0]; //yy-mm-dd
        return fecha;
    }        

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::: Campos requeridos ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/  

    tiempo = 1000;  
    function requeridos(){
        var regresar = true;  
        if ($("#field_desde").val()=='') {                
            callToaster('toast-top-right', 'Seleccione la fecha','Error','error');
            $("#field_desde").css("border-color", "red");
            regresar = false;
        } 
        return regresar;
    } 

    $("#field_desde").change(function(){        
        $("#field_desde").css("border-color", "");
    }); 

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::: Calcular filtros de fecha :::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

    function calcularFecha(fecha){
		var aFecha = fecha.split('/');
		var fecha1 = aFecha[2]+'/'+aFecha[1]+'/'+aFecha[0];
		var fecha2 = aFecha[2]+'/'+aFecha[1]+'/'+aFecha[0];
		fecha1 = new Date(fecha1);
		fecha2 = new Date(fecha2);		
		
		if (fecha1.getDay()!=0) {
			var diasAtras = fecha1.getDay() - 1;			
            var diasAdelante = 13 - fecha2.getDay();
			var diasAdelante2 = 6 - fecha2.getDay();
			
            // Semana 1
			fecha1.setDate(fecha1.getDate()-parseInt(diasAtras));
			var desde1 = fecha1.getFullYear() + '/' + ((fecha1.getMonth()+1).toString().length==2?(fecha1.getMonth()+1):'0'+(fecha1.getMonth()+1)) + '/' + ((fecha1.getDate()).toString().length==2?(fecha1.getDate()):'0'+(fecha1.getDate()));
			
			fecha2.setDate(fecha2.getDate()+parseInt(diasAdelante2));
            var hasta1 = fecha2.getFullYear() + '/' + ((fecha2.getMonth()+1).toString().length==2?(fecha2.getMonth()+1):'0'+(fecha2.getMonth()+1)) + '/' + ((fecha2.getDate()).toString().length==2?(fecha2.getDate()):'0'+(fecha2.getDate()));
		      
            // Semana 2
            fecha3 = new Date(hasta1);
            fecha3.setDate(fecha3.getDate()+parseInt(2));
            var desde2 = fecha3.getFullYear() + '/' + ((fecha3.getMonth()+1).toString().length==2?(fecha3.getMonth()+1):'0'+(fecha3.getMonth()+1)) + '/' + ((fecha3.getDate()).toString().length==2?(fecha3.getDate()):'0'+(fecha3.getDate()));
            
            fecha4 = new Date(desde2);
            fecha4.setDate(fecha3.getDate()+parseInt(5));
            var hasta2 = fecha4.getFullYear() + '/' + ((fecha4.getMonth()+1).toString().length==2?(fecha4.getMonth()+1):'0'+(fecha4.getMonth()+1)) + '/' + ((fecha4.getDate()).toString().length==2?(fecha4.getDate()):'0'+(fecha4.getDate()));
        
        } else {
			callToaster('toast-top-right', 'Día domingo fuera del rango válido','Alerta','warning'); 
			return false;
		}				

		var datos = {
			"desde1": desde1,
			"hasta1": hasta1,
            "desde2": desde2,
            "hasta2": hasta2
		}	
    	return datos;	
    }         

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::: Iniciar búsqueda :::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

    $("#btn_search").click(function(){ 
        if (requeridos()) {  
            var fechas = calcularFecha($("#field_desde").val());
        	if (fechas) {
        		
                var desde1 = fechas.desde1;
                var hasta1 = fechas.hasta1;
                var desde2 = fechas.desde2;
                var hasta2 = fechas.hasta2;
                var field_unidad = $("#field_unidad").val(); 
                var unidad = $( "#field_unidad option:selected" ).text();

                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: url + 'reportes/reporte_oficina',
                    data: {'desde1': desde1,'desde2': desde2, 'hasta1': hasta1, 'hasta2' : hasta2, 'field_unidad' : field_unidad},            
                    success: function (result) {                       
                        $('#btn_pdf').fadeIn(800);
                        $('#result').fadeIn(800); 
                        // Cargando data a vista
                        $("#details1").html('');                        
                        $("#details2").html('');                        
                        $("#details1").html(result.semana1);                        
                        $("#details2").html(result.semana2); 
                        $("#details3").html(result.resumen); 
                        $("#fechas1").html(desde1 + ' - '+hasta1); 
                        $("#fechas2").html(desde2 + ' - '+hasta2); 
                        // HTML para PDF
                        var encabezado =                      
                        '<table cellpadding="2">'+
                          '<tr>'+
                            '<td width="90"><h4 style="color:#251f44">Unidad : </h4></td>'+
                            '<td>'+unidad+'</td>'+
                          '</tr>'+
                          '<tr>'+
                            '<td width="90"><h4 style="color:#251f44">Fecha inicio : </h4></td>'+
                            '<td>'+desde1+'</td>'+
                          '</tr>'+
                          '<tr>'+
                            '<td width="90"><h4 style="color:#251f44">Fecha fin : </h4></td>'+
                            '<td>'+hasta2+'</td>'+
                          '</tr>'+
                        '</table><br><br>';
                        var semana1 = 
                        '<h4 style="color:#251f44">Detalle Oficina</h4>'+
                        '<table cellspacing="0" cellpadding="2" border="1">'+
                          '<tr style="background-color:#c2c5cc;color:#000000;">'+
                            '<td colspan="12" style="text-align:center">'+desde1 + ' - '+hasta1+'</td>'+
                          '</tr>'+
                          '<tr style="background-color:#fee07a;color:#000000;">'+
                            '<td colspan="3" align="center">Clientes</td>'+
                            '<td align="center">Ventas</td>'+
                            '<td colspan="4" align="center">Recaudo</td>'+
                            '<td colspan="2" align="center">No Pagos</td>'+
                            '<td align="center">Cartera</td>'+
                            '<td align="center">Gastos</td>'+                            
                          '</tr>'+      
                          '<tr style="background-color:#a2bfff;color:#000000;">'+
                            '<td>Total ventas</td>'+
                            '<td>Clientes nuevos</td>'+
                            '<td>Total clientes</td>'+
                            '<td>Total ventas</td>'+
                            '<td>Recaudo real</td>'+
                            '<td>Recaudo pretendido</td>'+
                            '<td>Promedio por día</td>'+
                            '<td>% Recaudo semanal</td>'+
                            '<td>No pagos</td>'+
                            '<td>Promedio por día</td>'+
                            '<td>Cartera</td>'+
                            '<td>Gastos</td>'+
                          '</tr>';
                        var semana2 = 
                        '<tr class="table-light">'+
                            '<td colspan="12"></td>'+
                        '</tr>'+                        
                        '<tr style="background-color:#c2c5cc;color:#000000;">'+
                            '<td colspan="12" style="text-align:center">'+desde2 + ' - '+hasta2+'</td>'+
                        '</tr>'+
                        '<tr style="background-color:#fee07a;color:#000000;">'+
                            '<td colspan="3" align="center">Clientes</td>'+
                            '<td align="center">Ventas</td>'+
                            '<td colspan="4" align="center">Recaudo</td>'+
                            '<td colspan="2" align="center">No Pagos</td>'+
                            '<td align="center">Cartera</td>'+
                            '<td align="center">Gastos</td>'+                            
                        '</tr>'+      
                        '<tr style="background-color:#a2bfff;color:#000000;">'+
                            '<td>Total ventas</td>'+
                            '<td>Clientes nuevos</td>'+
                            '<td>Total clientes</td>'+
                            '<td>Total ventas</td>'+
                            '<td>Recaudo real</td>'+
                            '<td>Recaudo pretendido</td>'+
                            '<td>Promedio por día</td>'+
                            '<td>% Recaudo semanal</td>'+
                            '<td>No pagos</td>'+
                            '<td>Promedio por día</td>'+
                            '<td>Cartera</td>'+
                            '<td>Gastos</td>'+
                        '</tr>';  
                        var resumen = 
                        '<br><h4 style="color:#251f44">Resumen Oficina</h4>'+
                        '<table cellspacing="0" cellpadding="2" border="1">'+
                        '<tr style="background-color:#c2c5cc;color:#000000;">'+
                            '<th scope="col" colspan="2" width="18%"></th>'+
                            '<th scope="col" width="15%">Valor total ventas</th>'+
                            '<th scope="col">Recaudo real</th>'+
                            '<th scope="col" width="15%">Recaudo pretendido</th>'+
                            '<th scope="col">Promedio por día</th>'+
                            '<th scope="col" width="14%">Cartera por cobrar</th>'+
                            '<th scope="col">Gastos</th>'+
                        '</tr>'; 
                        // Cargando html a textarea 
                        $("#html").val('');                        
                        $("#html").val(encabezado+semana1+result.semana1+semana2+result.semana2+'</table>'+resumen+result.resumen+'</table>');                        
                    }
                }); 
        	}            
        }
    })

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::::::: Generar PDF :::::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/ 
    $('#btn_pdf').click(function(){
        $("#reporte").submit();
    })    
    	
});