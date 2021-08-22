$(document).ready(function () { 
    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::: Cargas iniciales ::::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/    
    cargar_rutas(); 
    $('input[id="field_desde"]').attr("placeholder","Desde");
    
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
		// console.log("actual "+fecha1.getDay());
		if (fecha1.getDay()!=0) {
			var diasAtras = fecha1.getDay() - 1;			
			var diasAdelante = 6 - fecha2.getDay();
			
			fecha1.setDate(fecha1.getDate()-parseInt(diasAtras));
			var desde = fecha1.getFullYear() + '-' + ((fecha1.getMonth()+1).toString().length==2?(fecha1.getMonth()+1):'0'+(fecha1.getMonth()+1)) + '-' + ((fecha1.getDate()).toString().length==2?(fecha1.getDate()):'0'+(fecha1.getDate()));
			
			fecha2.setDate(fecha2.getDate()+parseInt(diasAdelante));
			var hasta = fecha2.getFullYear() + '-' + ((fecha2.getMonth()+1).toString().length==2?(fecha2.getMonth()+1):'0'+(fecha2.getMonth()+1)) + '-' + ((fecha2.getDate()).toString().length==2?(fecha2.getDate()):'0'+(fecha2.getDate()));

		} else {
			callToaster('toast-top-right', 'Día domingo no es un día laboral','Alerta','warning'); 
			return false;
		}				

		var datos = {
			"desde": desde,
			"hasta": hasta
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
                var field_desde = fechas.desde; 
                var field_hasta = fechas.hasta;            
                var field_unidad = $("#field_unidad").val();
                var ruta = $( "#field_unidad option:selected" ).text();     
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: url + 'reportes/reporte_diario',
                    data: {'field_desde': field_desde,'field_hasta':field_hasta, 'field_unidad': field_unidad},            
                    success: function (result) {
                        var encabezado =                      
                        '<table cellpadding="2">'+
                          '<tr>'+
                            '<td width="90"><h4 style="color:#251f44">Unidad : </h4></td>'+
                            '<td>'+ruta+'</td>'+
                          '</tr>'+
                          '<tr>'+
                            '<td width="90"><h4 style="color:#251f44">Fecha inicio : </h4></td>'+
                            '<td>'+field_desde+'</td>'+
                          '</tr>'+
                          '<tr>'+
                            '<td width="90"><h4 style="color:#251f44">Fecha fin : </h4></td>'+
                            '<td>'+field_hasta+'</td>'+
                          '</tr>'+
                        '</table><br><br>';                   
                        $('#btn_pdf').fadeIn(800);
                        $('#result').fadeIn(1000);
                        $("#details").html('');                        
                        $("#details").html(result.data);                        
                        $("#html").val('');                        
                        $("#html").val(encabezado+result.pdf);                        
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