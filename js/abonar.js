jQuery(document).ready(function($){
    if (url=='abonar') {
        setTimeout(function(){ 
            var key;
            var keyPrestamo;
            $('.title').html("Gestión de abonos");
            // Carga de pantalla
            loadClientes(0);
            // setTimeout(function(){ loadClientes(0); }, 200);    

            $('#filtro_estado').on('change', function() {            
                loadClientes($(this).val());            
            });

            $('#field_motivo').on('change', function() {            
                console.log($(this).val());
            });

            //Guardar no pago
            $('#btn_nopago').click(function(event){ 
                var motivo = $('#field_motivo').val();                     
                capturarDatosAbonar(key, keyPrestamo, motivo,0); 
                loadClientes($('#filtro_estado').val());           
                // setTimeout(function(){ loadClientes($('#filtro_estado').val()); }, 200);            
                $('#modaNopago').modal('hide');
            })

            //Abrir modal
            $('body').on('click', '#btn_nopagar', function(){
                loadSelect();
                $('#modaNopago').modal('show'); 
                key = $(this).data('id');             
                keyPrestamo = $(this).data('prestamo');          
            }) 
            //Esconder div de carga 
            ocultarLoad();
        },1800);

    } else if (url=='frm_add_abonos') {

        setTimeout(function(){ 
            var limiteAprobado = 0;
            var cantidad;        
            var saldoRuta;            
            setTimeout(function(){ loadForm(); }, 300);

            $('.title').html("Agregar abono");

            $('#validacion1').hide();
            $('#validacion2').hide(); 

            $('#modalCuotas').on('hidden.bs.modal', function () {
               $("#field_token").trigger('change');
            })

            $("#field_token").change(function(){            
                $("#token_validacion").html('');        
            });

            $("#field_valor").change(function(){
                $('#validacion2').fadeOut();
                if ($("#field_valor").val()==0) {
                    $('#validacion2').fadeIn();
                    $("#field_valor").val('');
                } else{
                    calcularTotalAbono();
                } 
            }); 

            $("#field_cuota").change(function(){
                $('#validacion1').fadeOut();
                if ($('#field_cuota').val()=='') {
                    $('#field_total').val('');
                } else{ 
                    if ($("#field_cuota").val()==0) {
                        $('#validacion1').fadeIn();
                        $("#field_cuota").val('');                
                    } else{
                        cantidad = $("#field_cuota").val();
                        if (limiteAprobado==0) {
                            if (cantidad>limiteCuota) { //Supera limite de cuotas
                                $("#field_cuota").val('');
                                $('#modalCuotas').modal('show');
                            } else{
                                calcularTotalAbono();
                            }
                        } else{
                            calcularTotalAbono();
                        }               
                    }
                }                   
            });

            $('#btn_insertAbono').click(function(event){         
                if (requeridosAbonar()) { 
                    if (validarMontoPendiente()) {
                        event.preventDefault(); 
                        sessionStorage.setItem('insertAbono',true);
                        capturarDatosAbonar(parametroAbono().key1, parametroAbono().key2);
                    }  
                }
            })
            //Esconder div de carga 
            ocultarLoad();
        }, 1000);
    }    

	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::: Cargar clientes ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/ 

    function loadClientes(status){        
        var card = '';      
        $('#card').html('');
        for (var i = 0; i < list_clientes.length; i++) {
            if (list_clientes[i].estado==0 && status==0) {   
                if (list_clientes[i].pendiente>0) {
                    card +=  
                    '<tr>'+
                        '<td>'+
                            '<div class="d-flex rounded-circle align-items-center justify-content-center media-icon iconbox-45 bg-danger text-white">'+
                                '<i class="mdi mdi-briefcase-download font-size-18"></i>'+
                            '</div>'+
                        '</td>'+
                        '<td>'+
                            '<a class="mt-0 mb-1 font-size-15 text-dark" href="#">'+list_clientes[i].alias+' - '+list_clientes[i].nombre+'</a>'+
                            '<p>'+list_clientes[i].telefono+'</p>'+                            
                        '</td>'+
                        '<td style="text-align: right;">'+
                            '<div class="btn-group mb-1">'+
                                '<button type="button" class="btn btn-warning">Opciones</button>'+
                                '<button type="button" class="btn btn-warning dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-display="static">'+
                                '<span class="sr-only">Toggle Dropdown</span>'+
                                '</button>'+
                                '<div class="dropdown-menu">'+
                                    '<a class="dropdown-item" href="index.html?frm_add_abonos#key='+list_clientes[i].key+'&key2='+list_clientes[i].keyPrestamo+'"><i class="mdi mdi-gesture-two-tap"></i> Abonar</a>'+
                                    '<a class="dropdown-item" href="" data-id="'+list_clientes[i].key+'" data-prestamo="'+list_clientes[i].keyPrestamo+'" data-toggle="modal" id="btn_nopagar"><i class="mdi mdi-information-outline"></i> No pago</a>'+
                                '</div>'+
                            '</div>'+
                        '</td> '+
                    '</tr>'+
                    '<tr>';
                }
            } else if (list_clientes[i].estado==1 && status==1) {              
                if (list_clientes[i].pendiente>0) {         
                    card +=  
                    '<tr>'+
                        '<td>'+
                            '<div class="d-flex rounded-circle align-items-center justify-content-center media-icon iconbox-45 bg-primary text-white">'+
                                '<i class="mdi mdi-briefcase-check font-size-18"></i>'+
                            '</div>'+
                        '</td>'+
                        '<td>'+
                            '<a class="mt-0 mb-1 font-size-15 text-dark" href="#">'+list_clientes[i].alias+' - '+list_clientes[i].nombre+'</a>'+
                            '<p>'+list_clientes[i].telefono+'</p>'+                            
                        '</td>'+
                    '</tr>';
                }
            } else if (status==2) {
                if (list_clientes[i].pendiente==0) {             
                    card +=  
                    '<tr>'+
                        '<td>'+
                            '<div class="d-flex rounded-circle align-items-center justify-content-center media-icon iconbox-45 bg-success text-white">'+
                                '<i class="mdi mdi-heart font-size-18"></i>'+
                            '</div>'+
                        '</td>'+
                        '<td>'+
                            '<a class="mt-0 mb-1 font-size-15 text-dark" href="#">'+list_clientes[i].alias+' - '+list_clientes[i].nombre+'</a>'+
                            '<p>'+list_clientes[i].telefono+'</p>'+                           
                        '</td>'+
                        '<td style="text-align: right;">'+
                            '<div class="btn-group mb-1">'+
                                '<button type="button" class="btn btn-warning">Opciones</button>'+
                                '<button type="button" class="btn btn-warning dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-display="static">'+
                                '<span class="sr-only">Toggle Dropdown</span>'+
                                '</button>'+
                                '<div class="dropdown-menu">'+
                                    '<a class="dropdown-item" href="index.html?frm_add_renovacion#key='+list_clientes[i].key+'"><i class="mdi mdi-circle-edit-outline"></i> Renovar</a>'+                                
                                '</div>'+
                            '</div>'+
                        '</td> '+
                    '</tr>'; 
                }                 
            }
        }  
        $('#card').html(card);               
    } 

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::::: Div de carga :::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

    function ocultarLoad(){
        $('.loader-wrapper').hide();
    }

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::: Default form data ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/ 
    var montoPendiente = 0;   

    function loadForm(){     
        var name, phone, location, nickname;   
        var result = idb.select("usuario", function (isSelected, responseData) {
            if (isSelected) {
                if(responseData.length != 0){ 
                    name = responseData[0].ruta.detalle.prestamo[parametroAbono().key1].nombre +' '+responseData[0].ruta.detalle.prestamo[parametroAbono().key1].apellido;
                    phone = responseData[0].ruta.detalle.prestamo[parametroAbono().key1].telefono;
                    location = responseData[0].ruta.detalle.prestamo[parametroAbono().key1].direccion;
                    nickname = responseData[0].ruta.detalle.prestamo[parametroAbono().key1].alias;
                    pendiente = parseFloat(montoPendientePrestamo()).toFixed(2);
                    $('#name').html(name+' ('+nickname+')');
                    $('#phone').html(((phone=='')?'No registrado':phone));
                    // $('#location').html(((location=='')?'No registrada':location));  
                    $('#pendiente').html('$'+pendiente+' pendientes');                     

                    valorCuota  =  responseData[0].ruta.detalle.prestamo[parametroAbono().key1].detalle[parametroAbono().key2].cuota;   
                    $('#field_valor').val(valorCuota);
                    montoPendiente = responseData[0].ruta.detalle.prestamo[parametroAbono().key1].detalle[parametroAbono().key2].monto_pendiente;                                                     
                    
                    // Determinando cuotas pendientes
                    var totalCuotas = responseData[0].ruta.detalle.prestamo[parametroAbono().key1].detalle[parametroAbono().key2].cantidad_cuotas;
                    var totalAbonos = 0;                    
                    for(var key in responseData[0].ruta.detalle.prestamo[parametroAbono().key1].detalle[parametroAbono().key2].abonos){
                        var montoAbono = responseData[0].ruta.detalle.prestamo[parametroAbono().key1].detalle[parametroAbono().key2].abonos[key].monto;                     
                        if (montoAbono>valorCuota) {                            
                            var numPagos = montoAbono/valorCuota;
                            if (!Number.isInteger(numPagos)) {                                   
                                totalAbonos += Math.trunc(numPagos);
                            } else{
                                totalAbonos += numPagos; 
                            }                            
                        } else{
                            totalAbonos ++;
                        }
                    } 
                    var cuotasPendientes = totalCuotas-totalAbonos;                 
                    $('#cuotas').html(((cuotasPendientes>1)? cuotasPendientes+' cuotas pendientes':cuotasPendientes+' cuota pendiente'));  
                }
            }
            else {
                console.log("Error: " + responseText);
            }             
        });
        setTimeout(function(){ 
            $("#field_cuota").trigger('change');                                
        }, 300);
    }

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::: Select motivo ::::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/     

    function loadSelect(){ 
        var options;  
        $('#field_motivo option').remove();
        var result = idb.select("motivos", function (isSelected, responseData) {
            if (isSelected) {
                if(responseData.length != 0){                     
                    for (var key in responseData) {             
                        options += '<option value='+responseData[key].motivos_idDb+'>'+responseData[key].monto+'</option>';                        
                    } 
                    $('#field_motivo').append(options);
                }
            }
            else {
                console.log("Error: " + responseText);
            }             
        });
    }

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::::::: Agregar abono :::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    
    function parametroAbono(){
        var ruta = window.location.search.substring(1)
        var hash = window.location.hash;
        hash = hash.replace('#','');

        var pair = hash.split("&"); 
        var pair2 = pair[0].split("="); 
        var pair3 = pair[1].split("=");
        var parametroAbonos = {
            "key1": pair2[1],
            "key2": pair3[1]
        }; 
        return parametroAbonos;
    }

    function saldoActualRuta(){
        var saldo;
        for (var i = 0; i < list_clientes.length; i++) { 
            if (list_clientes[i].key==parametroAbono().key1) {
                saldo = list_clientes[i].saldo_ruta;
                i = list_clientes[i].length;
            }
        }
        return saldo;
    }    

    function montoPendientePrestamo(){
        var saldo;
        for (var i = 0; i < list_clientes.length; i++) { 
            if (list_clientes[i].key==parametroAbono().key1) {
                saldo = list_clientes[i].pendiente;
                i = list_clientes[i].length;
            }
        }
        return saldo;
    }    
    
    function capturarDatosAbonar(key, keyPrestamo, motivo ='', accion = 1){        
        var monto;                    
        var dataAbonos = {};        
        var d = new Date();
        var strDate = d.getFullYear() + "/" + ((d.getMonth()+1).toString().length==2?(d.getMonth()+1):'0'+(d.getMonth()+1)) + "/" + ((d.getDate()).toString().length==2?(d.getDate()):'0'+(d.getDate()));            
        
        if (accion == 1) {
            monto = $('#field_total').val();
            dataAbonos = {
                "monto": monto,
                "fecha": strDate,
                "abonos_idDb": 0            
            };
        } else {
            dataAbonos = {                
                "fecha": strDate,
                "motivo": motivo,
                "abonos_idDb": 0            
            };
        }         
        
        var result = idb.select("usuario", function (isSelected, responseData) {
            if (isSelected) {
                if(responseData.length != 0){
                    var abonoArray = []; 
                    idKey = 0;               
                    for (var clave in responseData[0].ruta.detalle.prestamo[key].detalle[keyPrestamo].abonos) {
                        idKey = parseInt(clave)+1;
                    }                 
                    // idKey = parseInt((responseData[0].ruta.detalle.prestamo[key].detalle[keyPrestamo].abonos).length);                                     
                    abonoArray[idKey] = dataAbonos;
                    $.extend(responseData[0].ruta.detalle.prestamo[key].detalle[keyPrestamo].abonos, abonoArray);                     
                    if (accion==1) { //1: Si abono 0: Si es No pago
                        var saldo = parseFloat(montoPendientePrestamo())-parseFloat(monto);
                        var saldo2 = parseFloat(monto) + parseFloat(saldoActualRuta());
                        $.extend(responseData[0].ruta.detalle, {"monto" : saldo2}); 
                        $.extend(responseData[0].ruta.detalle.prestamo[parametroAbono().key1].detalle[parametroAbono().key2], {"monto_pendiente" : saldo});
                        //Prestamo ya fue cancelado
                        if (saldo==0) {
                            $.extend(responseData[0].ruta.detalle.prestamo[parametroAbono().key1].detalle[parametroAbono().key2], {"ds_estado" : 1});
                        }
                    }   
                    responseData[0].actualizado = 1;                  
                    idb.insert('usuario', responseData[0]); 
                    idb.loadClientesByStatus();
                    window.location.href = "index.html?abonar";
                }
            }
            else {
                console.log("Error: " + responseText);
            }
        });     
    }

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::::::::: Token :::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

    function token(token){           
        var result = idb.select("tokens", function (isSelected, responseData) {
        if (isSelected) {
            if(responseData.length != 0){
                var i = 0;
                var insertado = 0; //0 = No encontrado 1= Encontrado
                while(i<responseData.length){
                    if(responseData[i].token == token){
                        $("#token_validacion").html("El token <b>"+token+"</b> ya ha sido usado");
                        $("#field_token").val("");                          
                        i = responseData.length;
                        insertado = 1;
                    } 
                    i++;
                }                   
                if (insertado==0) {
                    insertToken(token);
                }                   
            } else{     
                insertToken(token);                 
            }
        }
        else {
            console.log("Error: " + responseText);
        }
        });         
    }

    function insertToken(token_val){        
        dataToken = {
            "token_idDb": 0,
            "token": token_val,
            "tipo": 2, //Tabla tt_tipo_token
            "usuario": idEmpleado
        }; 

        let fecha = new Date()
        // console.log(fecha)
        var anio = fecha.getFullYear();
        var mes = fecha.getMonth();
        var dia = fecha.getDate();
        var horas = fecha.getHours();
        var minutos = fecha.getMinutes();                           

        fecha.setMinutes(fecha.getMinutes() - 10);
        var anio = fecha.getFullYear();
        var mes = fecha.getMonth();
        var dia = fecha.getDate();
        var horas = fecha.getHours();
        var minutos = fecha.getMinutes();
        // console.log(dia+'-'+(mes+1)+'-'+anio+' '+horas+':'+minutos);
        fecha.setMinutes(fecha.getMinutes() + 20);
        var anio = fecha.getFullYear();
        var mes = fecha.getMonth();
        var dia = fecha.getDate();
        var horas = fecha.getHours();
        var minutos = fecha.getMinutes();
        // console.log(dia+'-'+(mes+1)+'-'+anio+' '+horas+':'+minutos);
        // console.log('========== recorrido de horas ========')
        fecha.setMinutes(fecha.getMinutes() - 21);
        for (var x = 0; x <= 20; x++) {
            fecha.setMinutes(fecha.getMinutes() + 1);
            var anio = fecha.getFullYear();
            var mes = fecha.getMonth();
            var dia = fecha.getDate();
            var horas = fecha.getHours();
            var minutos = fecha.getMinutes();
            var encriptar = ( (dia).toString().length==2?(dia):'0'+(dia) )+''+( (mes+1).toString().length==2?(mes+1):'0'+(mes+1) )+''+anio+''+horas+''+minutos;
            var token = CryptoJS.SHA256(encriptar);            
            if(token.toString().substring(0, 10) == token_val){                     
                idb.insert('tokens', dataToken);               
                $("#field_cuota").val(cantidad); 
                calcularTotalAbono();
                limiteAprobado = 1;  
                $('#modalCuotas').modal('hide');                
            } 
        }
    }       

    $("#token_validacion").html('');

    $('#btn_tokenAbonar').click(function(event){
        if ($('#field_token').val()!='') {            
            token($('#field_token').val());
        } else {
            $("#token_validacion").html("Ingrese un token");
        }   
    })

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::: Validar monto pendiente :::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/ 

    function validarMontoPendiente(){
        var flag = true;       
        if (parseFloat(montoPendiente)<$('#field_total').val()) {             
            idb.loadAlert("toast-top-right", "El total excede el monto pendiente del prestamo<br>Monto pendiente: $"+montoPendiente,"Error!",'error');
            flag = false;
        }
        return flag;
    }     

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::::: Calcular total ::::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/ 

    function calcularTotalAbono(){
        var total;
        $('#field_total').val('');
        if ($('#field_cuota').val()!='' && $('#field_valor').val()!='') {
            total = $('#field_cuota').val() * $('#field_valor').val();
            $('#field_total').val(parseFloat(total).toFixed(2));
        }       
    }

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::: Campos requeridosAbonar ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/  

    function requeridosAbonar(){               
        var regresar = true; 
        if ($('#field_cuota').val()=='') {
            errorInput('#field_cuota');
            regresar = false;
        } 

        if ($('#field_valor').val()=='') {
            errorInput('#field_valor');
            regresar = false;
        }
        return regresar;
    }       

    $('#field_cuota').keypress(function() {
        ocultarErroresInput(this); 
    });

    $('#field_valor').keypress(function() {
        ocultarErroresInput(this); 
    });   
    
    function errorInput($element){      
        $($element).addClass('is-invalid');
    }

    function ocultarErroresInput($element){
        $($element).removeClass('is-invalid');
    } 

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

       if ( sessionStorage.getItem('insertAbono') != 'false' && sessionStorage.getItem('insertAbono') != null) {
           idb.loadAlert('toast-top-right', 'El abono ha sido ingresado','Alerta','success');           
           sessionStorage.setItem('insertAbono',false);
       }
       
    })   
});