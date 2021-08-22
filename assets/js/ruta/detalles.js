jQuery(document).ready(function($){

   $(function () { $("select#field_cierre").change(); }); 
    
    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::: Filtrar info :::::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/    

    $('#field_cierre').on('change', function(){        
        var fecha_cierre = $( "#field_cierre option:selected" ).text(); 
        var id = $( "#field_id").val(); 
        var field_fecha = $( "#field_fecha").val(); 
        if (fecha_cierre!='') {
            $('#resumen').fadeIn(800);
            $('#datos').fadeIn(800);

            $.ajax({
                type: 'post',
                dataType: 'json',
                url: url + 'catalogo/load_detalles', 
                data: {'fecha_cierre': fecha_cierre, 'id': id, 'field_fecha': field_fecha},             
                success: function (result) {
                    //SALDOS
                    $('#inicial').html('$'+result.detalles['saldoInicial']);  
                    $('#saldo_ventas').html('$'+result.detalles['ventas']);  
                    $('#saldo_recaudo').html('$'+result.detalles['recaudoTotal']);  
                    $('#cartera').html('$'+result.detalles['totalCartera']);  
                    $('#saldo').html('$'+result.detalles['saldoFinal']); 
                    //DETALLES
                    $('#fechaUnidad').html(result.detalles['fechaUnidad']);
                    $('#fechaApertura').html(result.detalles['fechaApertura']);
                    $('#fechaCierre').html(result.detalles['fechaCierre']);
                    $('#clientesIniciales').html(result.detalles['clientesIniciales']);
                    $('#numVentas').html(result.detalles['numVentas']);
                    $('#totalClientes').html(result.detalles['totalClientes']);
                    $('#saldoInicial').html('$'+result.detalles['saldoInicial']);
                    $('#recaudoPretendido').html('$'+result.detalles['recaudoPretendido']);
                    $('#recaudoTotal').html('$'+result.detalles['recaudoTotal']);                
                    $('#sells').html('$'+result.detalles['ventas']);
                    $('#g1').html('$'+result.detalles['gastos']);
                    $('#r1').html('$'+result.detalles['retiros']);
                    $('#i1').html('$'+result.detalles['ingresos']);
                    $('#totalCartera').html('$'+result.detalles['totalCartera']);
                    $('#saldoFinal').html('$'+result.detalles['saldoFinal']); 
                    // GASTOS
                    tablaGastos = ''; 
                    for (var gastos in result.gastos) {
                        tablaGastos += 
                        '<tr class="table-secondary">'+
                            '<td style="display:none" id="idMovimiento">'+result.gastos[gastos].id+'</td>'+
                            '<td scope="row" id="data_monto">$'+result.gastos[gastos].monto+'</td>'+
                            '<td>'+result.gastos[gastos].comentario+'</td>'+
                            '<td>'+result.gastos[gastos].concepto+'</td>'+
                            '<td>'+
                                '<button type="button" id="btn_eliminar_gasto" class="mb-1 btn-sm btn btn-pill btn-lg btn-danger" title="Eliminar"><i class="mdi mdi-window-close"></i></button>'+                            
                            '</td>'+
                        '</tr>';
                    }                
                    $('#tabla_gastos').html(tablaGastos);
                    // RETIROS
                    tablaRetiros = ''; 
                    for (var retiros in result.egresos) {
                        tablaRetiros += 
                        '<tr class="table-secondary">'+
                            '<td style="display:none" id="idMovimiento">'+result.egresos[retiros].id+'</td>'+
                            '<td scope="row" id="data_monto">$'+result.egresos[retiros].monto+'</td>'+
                            '<td>'+result.egresos[retiros].comentario+'</td>'+
                            '<td>'+result.egresos[retiros].concepto+'</td>'+
                            '<td>'+
                                '<button type="button" id="btn_eliminar_retiros" class="mb-1 btn-sm btn btn-pill btn-lg btn-danger" title="Eliminar"><i class="mdi mdi-window-close"></i></button>'+                            
                            '</td>'+
                        '</tr>';
                    }                
                    $('#tabla_retiros').html(tablaRetiros);
                    // INGRESOS
                    tablaIngresos = ''; 
                    for (var ingresos in result.ingresos) {
                        tablaIngresos += 
                        '<tr class="table-secondary">'+
                            '<td style="display:none" id="idMovimiento">'+result.ingresos[ingresos].id+'</td>'+
                            '<td scope="row" id="data_monto">$'+result.ingresos[ingresos].monto+'</td>'+
                            '<td>'+result.ingresos[ingresos].comentario+'</td>'+
                            '<td>'+result.ingresos[ingresos].concepto+'</td>'+
                            '<td>'+
                                '<button type="button" id="btn_eliminar_ingresos" class="mb-1 btn-sm btn btn-pill btn-lg btn-danger" title="Eliminar"><i class="mdi mdi-window-close"></i></button>'+                            
                            '</td>'+
                        '</tr>';
                    }                
                    $('#tabla_ingresos').html(tablaIngresos);
                    // VENTAS
                    tablaVentas = '';
                    // console.log(result.prestamos)
                    // console.log(result.prestamos.lenght)
                    for (var prestamos in result.prestamos) { 
                        tablaVentas += 
                        '<tr class="table-secondary">'+                       
                            '<td scope="row">'+result.prestamos[prestamos].alias+'</td>'+
                            '<td>'+result.prestamos[prestamos].renovacion+'</td>'+
                            '<td>'+result.prestamos[prestamos].telefono+'</td>'+
                            '<td>$'+result.prestamos[prestamos].venta+'</td>'+
                            '<td>'+result.prestamos[prestamos].interes+'%</td>'+ 
                            '<td>$'+result.prestamos[prestamos].total_a_pagar+'</td>'+                                               
                            '<td>'+result.prestamos[prestamos].fecha_venta+'</td>'+
                            '<td>$'+result.prestamos[prestamos].cuota_de_venta+'</td>'+                        
                        '</tr>';
                    }
                    $('#tabla_ventas').html(tablaVentas);
                    // ABONOS
                    tablaAbonos = '';
                    for (var abonos in result.abonos) { 
                        tablaAbonos += 
                        '<tr class="table-secondary">'+                       
                            '<td scope="row">'+result.abonos[abonos].alias+'</td>'+
                            '<td>$'+result.abonos[abonos].monto+'</td>'+
                            '<td>'+result.abonos[abonos].fecha+'</td>'+                        
                        '</tr>';
                    }
                    $('#tabla_abonos').html(tablaAbonos);                    
                    // NO PAGOS
                    tablaNoPagos = '';
                    for (var nopagos in result.nopagos) { 
                        tablaNoPagos += 
                        '<tr class="table-secondary">'+                       
                            '<td scope="row">'+result.nopagos[nopagos].alias+'</td>'+
                            '<td>$'+result.nopagos[nopagos].pendiente+'</td>'+
                            '<td>'+result.nopagos[nopagos].fecha+'</td>'+                        
                            '<td>'+result.nopagos[nopagos].motivo+'</td>'+                        
                        '</tr>';
                    }
                    $('#tabla_no_pagos').html(tablaNoPagos);
                }
            });
        }        
        
    })

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::::::: Modal de gastos :::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/    
    // Cierre de modal
    $('#modalGastos').on('hidden.bs.modal', function () {
        ocultarErroresInput('#field_monto1');
        $('#field_concepto1').trigger('change');
        $('#field_monto1').val('');
        $('#field_comentario1').val('');
    })
    //Abrir modal
    $('body').on('click', '#btn_gastos', function(){            
        $('#modalGastos').modal('show'); 
        cargar_gastos();         
    }) 
    //Guardar gastos
    $('#btn_save_gastos').click(function(event){ 
        if (requeridosGastos()) {
            $('#btn_save_gastos').prop('disabled',true);
            var ruta = $('#field_id').val();
            var monto = $('#field_monto1').val();
            var fecha = $('#field_cierre option:selected').text();
            var comentario = $('#field_comentario1').val(); 
            var tipo = $('#field_concepto1').val(); 
            var saldo = $('#field_sr_id').val();   
            // str.substring(1, str.lenght)          
            $.ajax({
                type: 'post',  
                url: url + 'catalogo/guardarGastos', 
                data: {'monto': monto, 'fecha': fecha, 'comentario': comentario, 'tipo': tipo, 'saldo': saldo, 'ruta': ruta, 'accion': 0},           
                success: function (result) {
                    sessionStorage.setItem('gasto',true); 
                    window.location.reload();
                }
            });                        
        }        
    })    
    //Select conceptos gastos
    function cargar_gastos(){           
        $.ajax({
            type: 'post',  
            url: url + 'catalogo/conceptos', 
            data: {'tipo': 0 },           
            success: function (result) {
                $("#field_concepto1").html(result);
            }
        }); 
    } 
    // Campos requeridos
    function requeridosGastos(){ 
        var regresar = true; 
        if ($('#field_monto1').val()=='') {
            errorInput('#field_monto1');
            regresar = false;
        } 

        if ($("#field_concepto1 option:selected" ).text()=='') {
            $("#field_concepto1").css("border-color", "red");
            regresar = false;
        }
        return regresar;
    }       

    $('#field_monto1').keypress(function() {
        ocultarErroresInput(this); 
    });

    $('#field_concepto1').change(function(){        
        $("#field_concepto1").css("border-color", "");
    });  

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::: Modal de retiros :::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/    
    // Cierre de modal
    $('#modalRetiros').on('hidden.bs.modal', function () {
        ocultarErroresInput('#field_monto2');
        $('#field_concepto2').trigger('change');
        $('#field_monto2').val('');
        $('#field_comentario2').val('');
    })
    //Abrir modal
    $('body').on('click', '#btn_retiros', function(){            
        $('#modalRetiros').modal('show'); 
        cargar_retiros();         
    }) 
    //Guardar retiros
    $('#btn_save_retiros').click(function(event){ 
        if (requeridosRetiros()) {
            $('#btn_save_retiros').prop('disabled',true);
            var ruta = $('#field_id').val();
            var monto = $('#field_monto2').val(); 
            var fecha = $('#field_cierre option:selected').text();            
            var comentario = $('#field_comentario2').val(); 
            var tipo = $('#field_concepto2').val(); 
            var saldo = $('#field_sr_id').val();  
            $.ajax({
                type: 'post',  
                url: url + 'catalogo/guardarRetiros', 
                data: {'monto': monto, 'fecha': fecha, 'comentario': comentario, 'tipo': tipo, 'saldo': saldo, 'ruta': ruta, 'accion': 0},           
                success: function (result) {
                    sessionStorage.setItem('retiro',true); 
                    window.location.reload();
                }
            });            
        }        
    })    
    //Select conceptos retiros
    function cargar_retiros(){           
        $.ajax({
            type: 'post',  
            url: url + 'catalogo/conceptos', 
            data: {'tipo': 1 },           
            success: function (result) {
                $("#field_concepto2").html(result);
            }
        }); 
    } 
    // Campos requeridos
    function requeridosRetiros(){ 
        var regresar = true; 
        if ($('#field_monto2').val()=='') {
            errorInput('#field_monto2');
            regresar = false;
        } 

        if ($("#field_concepto2 option:selected" ).text()=='') {
            $("#field_concepto2").css("border-color", "red");
            regresar = false;
        }
        return regresar;
    }       

    $('#field_monto2').keypress(function() {
        ocultarErroresInput(this); 
    });

    $('#field_concepto2').change(function(){        
        $("#field_concepto2").css("border-color", "");
    }); 

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::: Modal de ingresos ::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/    
    // Cierre de modal
    $('#modalIngresos').on('hidden.bs.modal', function () {
        ocultarErroresInput('#field_monto3');
        $('#field_concepto3').trigger('change');
        $('#field_monto3').val('');
        $('#field_comentario3').val('');
    })
    //Abrir modal
    $('body').on('click', '#btn_ingresos', function(){            
        $('#modalIngresos').modal('show'); 
        cargar_ingresos();         
    }) 
    //Guardar ingresos
    $('#btn_save_ingresos').click(function(event){ 
        if (requeridosIngresos()) {
            $('#btn_save_ingresos').prop('disabled',true);
            var ruta = $('#field_id').val();
            var monto = $('#field_monto3').val(); 
            var fecha = $('#field_cierre option:selected').text();
            var comentario = $('#field_comentario3').val(); 
            var tipo = $('#field_concepto3').val(); 
            var saldo = $('#field_sr_id').val(); 
            $.ajax({
                type: 'post',  
                url: url + 'catalogo/guardarIngresos', 
                data: {'monto': monto, 'fecha': fecha, 'comentario': comentario, 'tipo': tipo, 'saldo': saldo, 'ruta': ruta, 'accion': 0},           
                success: function (result) {
                    sessionStorage.setItem('ingreso',true); 
                    window.location.reload();
                }
            });            
        }        
    })    
    //Select conceptos ingresos
    function cargar_ingresos(){           
        $.ajax({
            type: 'post',  
            url: url + 'catalogo/conceptos', 
            data: {'tipo': 2 },           
            success: function (result) {
                $("#field_concepto3").html(result);
            }
        }); 
    } 
    // Campos requeridos
    function requeridosIngresos(){ 
        var regresar = true; 
        if ($('#field_monto3').val()=='') {
            errorInput('#field_monto3');
            regresar = false;
        } 

        if ($("#field_concepto3 option:selected" ).text()=='') {
            $("#field_concepto3").css("border-color", "red");
            regresar = false;
        }
        return regresar;
    }       

    $('#field_monto3').keypress(function() {
        ocultarErroresInput(this); 
    });

    $('#field_concepto3').change(function(){        
        $("#field_concepto3").css("border-color", "");
    }); 
    
    function errorInput($element){      
        $($element).addClass('is-invalid');
    }

    function ocultarErroresInput($element){
        $($element).removeClass('is-invalid');
    } 

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::: Eliminando movimientos :::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

    // ELIMINANDO GASTOS  
    $(body).on("click", "#btn_eliminar_gasto", function() {        
        $(this).closest('tr').find('#btn_eliminar_gasto').prop('disabled',true);
        var id = $(this).closest('tr').find('#idMovimiento').text();
        var monto = $(this).closest('tr').find('#data_monto').text().substring(1, this.lenght).replace(',','');        
        var saldo = $('#field_sr_id').val(); 
        var ruta = $('#field_id').val();        
        var fecha = $('#field_cierre option:selected').text();

        $.ajax({
            type: 'post',  
            url: url + 'catalogo/guardarGastos', 
            data: {'monto': monto, 'id': id, 'accion': 1, 'saldo': saldo, 'ruta':ruta, 'fecha': fecha},           
            success: function (result) {
                sessionStorage.setItem('gastoEliminado',true); 
                window.location.reload();
            }
        });
    });

    // ELIMINANDO RETIROS  
    $(body).on("click", "#btn_eliminar_retiros", function() { 
        $(this).closest('tr').find('#btn_eliminar_retiros').prop('disabled',true);       
        var id = $(this).closest('tr').find('#idMovimiento').text();
        var monto = $(this).closest('tr').find('#data_monto').text().substring(1, this.lenght).replace(',','');        
        var saldo = $('#field_sr_id').val(); 
        var ruta = $('#field_id').val();        
        var fecha = $('#field_cierre option:selected').text();
        
        $.ajax({
            type: 'post',  
            url: url + 'catalogo/guardarRetiros', 
            data: {'monto': monto, 'id': id, 'accion': 1, 'saldo': saldo, 'ruta':ruta, 'fecha': fecha},           
            success: function (result) {
                sessionStorage.setItem('retiroEliminado',true); 
                window.location.reload();
            }
        });
    });

    // ELIMINANDO INGRESOS  
    $(body).on("click", "#btn_eliminar_ingresos", function() { 
        $(this).closest('tr').find('#btn_eliminar_ingresos').prop('disabled',true);        
        var id = $(this).closest('tr').find('#idMovimiento').text();
        var monto = $(this).closest('tr').find('#data_monto').text().substring(1, this.lenght).replace(',','');
        // monto = monto.replace(',','');        
        var saldo = $('#field_sr_id').val(); 
        var ruta = $('#field_id').val();        
        var fecha = $('#field_cierre option:selected').text(); 
        $.ajax({
            type: 'post',  
            url: url + 'catalogo/guardarIngresos', 
            data: {'monto': monto, 'id': id, 'accion': 1, 'saldo': saldo, 'ruta':ruta, 'fecha': fecha},           
            success: function (result) {
                sessionStorage.setItem('ingresoEliminado',true); 
                window.location.reload();
            }
        });
    });

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::::::::: Solo números ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/ 

    $('body').on('keypress keyup blur', '.numero', function(){ 
        $(this).val($(this).val().replace(/[^0-9\.]/g,''));
        if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::: Showing alerts :::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

    $( function() {
       if ( sessionStorage.getItem('gasto') != 'false' && sessionStorage.getItem('gasto') != null) {
           callToaster('toast-top-right', 'El gasto ha sido registrado','Alerta');           
           sessionStorage.setItem('gasto',false);
       }
       if ( sessionStorage.getItem('retiro') != 'false' && sessionStorage.getItem('retiro') != null) {
           callToaster('toast-top-right', 'El retiro ha sido registrado','Alerta');           
           sessionStorage.setItem('retiro',false);
       }
       if ( sessionStorage.getItem('ingreso') != 'false' && sessionStorage.getItem('ingreso') != null) {
           callToaster('toast-top-right', 'El ingreso ha sido registrado','Alerta');           
           sessionStorage.setItem('ingreso',false);
       }
       if ( sessionStorage.getItem('gastoEliminado') != 'false' && sessionStorage.getItem('gastoEliminado') != null) {
            callToaster('toast-top-right', 'El gasto ha sido eliminado','Alerta','error');           
            sessionStorage.setItem('gastoEliminado',false);
       }
       if ( sessionStorage.getItem('retiroEliminado') != 'false' && sessionStorage.getItem('retiroEliminado') != null) {
            callToaster('toast-top-right', 'El retiro ha sido eliminado','Alerta','error');           
            sessionStorage.setItem('retiroEliminado',false);
       }
       if ( sessionStorage.getItem('ingresoEliminado') != 'false' && sessionStorage.getItem('ingresoEliminado') != null) {
            callToaster('toast-top-right', 'El ingreso ha sido eliminado','Alerta','error');           
            sessionStorage.setItem('ingresoEliminado',false);
       }
    })

});