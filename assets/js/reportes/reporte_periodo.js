$(document).ready(function () { 
    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::: Cargas iniciales ::::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/    
    cargar_rutas(); 
    $('input[id="field_desde"]').attr("placeholder","Desde");
    $('input[id="field_hasta"]').attr("placeholder","Hasta");
    
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
    :::::::::::::::::::: Validar fechas - desde<hasta :::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    function validar_fechas(){
        var field_desde = $("#field_desde").val();
        var field_hasta = $("#field_hasta").val();
        var regresar = true;
        if(($.trim(field_desde) == "" || $.trim(field_hasta) == "")){
            regresar = false;            
        }
        
        var field_desde_array = field_desde.split('/');
        var field_hasta_array = field_hasta.split('/');

        var fecha1 = field_desde_array[2]+'-'+field_desde_array[1]+'-'+field_desde_array[0];
        var fecha2 = field_hasta_array[2]+'-'+field_hasta_array[1]+'-'+field_hasta_array[0];
        var fechaInicio = new Date(fecha1).getTime();
        var fechaFin    = new Date(fecha2).getTime();

        var diff = fechaFin - fechaInicio;

        var diferencia = diff/(1000*60*60*24);
        if(diferencia < 0 && regresar){
            regresar = false;
            callToaster('toast-top-right', 'Período de búsqueda incorrecto','Error','error');           
            $("#field_hasta").css("border-color", "red");
            $("#field_desde").css("border-color", "red");
            $("#field_desde").val('');
            $("#field_hasta").val('');         
        }
        return regresar;
    }   

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::: Campos requeridos ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/  
    tiempo = 1000;  
    function requeridos(){
        var regresar = true;  
        if ($("#field_hasta").val()=='' && $("#field_desde").val()=='') {
            callToaster('toast-top-right', 'Complete las fechas','Error','error');
            $("#field_hasta").css("border-color", "red");
            $("#field_desde").css("border-color", "red");

        } else{
            if ($("#field_hasta").val()=='') {                
                callToaster('toast-top-right', 'Seleccione la fecha','Error','error');
                $("#field_hasta").css("border-color", "red");
                regresar = false;
            }
            if ($("#field_desde").val()=='') {                
                callToaster('toast-top-right', 'Seleccione la fecha','Error','error');
                $("#field_desde").css("border-color", "red");
                regresar = false;
            }
        }
        
        return regresar;
    } 

    $("#field_desde").change(function(){        
        $("#field_desde").css("border-color", "");
    });  
    $("#field_hasta").change(function(){
        $("#field_hasta").css("border-color", "");
    });     

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::: Iniciar búsqueda :::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    $("#btn_search").click(function(){ 
        if (requeridos()) {            
            if (validar_fechas()) {                
                var field_desde = formato_fechas($("#field_desde").val()); 
                var field_hasta = formato_fechas($("#field_hasta").val());
                var field_unidad = $("#field_unidad").val();  
                var ruta = $( "#field_unidad option:selected" ).text();     
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: url + 'reportes/reporte_periodo',
                    data: {'field_desde': field_desde,'field_hasta':field_hasta, 'field_unidad': field_unidad},            
                    success: function (result) {                       
                        $('#btn_pdf').fadeIn(800);
                        $('#details').fadeIn(800);
                        $('#result').fadeIn(800);
                        
                        $("#gastos").text('$'+result.totales['gastos']);
                        $("#egresos").text('$'+result.totales['egresos']);
                        $("#ingresos").text('$'+result.totales['ingresos']);
                        $("#recaudos").text('$'+result.totales['recaudos']);
                        $("#ventas").text('$'+result.totales['ventas']);
                        // console.log(result.totales)     
                        var tablaDetalles = 
                        '<h4 style="color:#251f44">Detalles de ruta: '+ruta+'</h4>'+
                        '<table cellpadding="2">'+
                            '<tr>'+
                                '<td width="86"><b>Ventas</b></td>'+
                                '<td> $'+result.totales['ventas']+'</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td width="86"><b>Recaudos</b></td>'+
                                '<td> $'+result.totales['recaudos']+'</td>'+
                            '</tr>'+                            
                            '<tr>'+
                                '<td width="86"><b>Gastos</b></td>'+
                                '<td> $'+result.totales['gastos']+'</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td width="86"><b>Egresos</b></td>'+
                                '<td> $'+result.totales['egresos']+'</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td width="86"><b>Ingresos</b></td>'+
                                '<td> $'+result.totales['ingresos']+'</td>'+
                            '</tr>'+                          
                        '</table><br>';                    
                        
                        $("#details").html('');                        
                        $("#details").html(result.data);                        
                        $("#html").val('');                        
                        $("#html").val(tablaDetalles+result.gastos+result.retiros+result.ingresos);                        
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