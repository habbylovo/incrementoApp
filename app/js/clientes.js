jQuery(document).ready(function($){	
    if (url=='clientes') {

    	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	    ::::::::::::::::::::::::::: Grid de clientes ::::::::::::::::::::::::
	    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
        $('.title').html("Gestión de clientes");           	

    } else if(url=='frm_add_clientes'){

    	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	    ::::::::::::::::::::::::::::: Add formulario ::::::::::::::::::::::::
	    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/  
    	var monto = '';
    	setTimeout(function(){ 
            
            var limiteAprobado = 0;
            $('.title').html("Agregar cliente"); 
            loadData();
            if ($("#field_cuota").val()!=''&& $("#field_date").val()!='') {
                flags($("#field_cuota").val(),$('#field_date').val());   
            }            
    	
        	$('#modalVentas').on('hidden.bs.modal', function () {
    		   $("#field_token").trigger('change');
    		})

        	$("#field_token").change(function(){			
        		$("#token_validacion").html('');   		
    		});    	

        	$("#field_venta").change(function(){
        		$('#validacion1').fadeOut();
                if ($(this).val()!='') {
            		if ($("#field_venta").val()==0) {
            			$('#validacion1').fadeIn();
            			$("#field_venta").val('');
            		} else{
            			monto = $("#field_venta").val();
            			// console.log("estado del limite "+ limiteAprobado);
            			if (limiteAprobado==0) {
            				if (monto>limiteVenta) { //supera limite de ventas
        	    				$("#field_venta").val('');
                                $("#field_venta").trigger('change');
        	    				$('#modalVentas').modal('show');
            				} else{
            					calcular();
            				}
            			} else{
            				calcular();
            			}    			
            		} 
                } else{
                    calcular();
                }   		  		
    		});
    		
    		$("#field_cuota").change(function(){
    			$('#validacion2').fadeOut();
        		if ($("#field_cuota").val()==0) {
        			$('#validacion2').fadeIn();
                    $("#field_cuota").val('');
        			$("#field_valor").val('');
        		} else{
        			calcular();
                    flags($(this).val(),$('#field_date').val());
        		} 
    		});

    		$("#field_interes").change(function(){			
        		calcular();    		
    		});


            $("#field_domingo").change(function(){          
                flags($('#field_cuota').val(),$('#field_date').val());         
            });    		

    	    $('#btn_insert').click(function(event){	    	
    	        if (requeridos()) {            
    	            event.preventDefault();             	
                	if (validarSaldoRuta($('#field_venta').val())) {
                        sessionStorage.setItem('insert',true);
    	            	capturarDatos();                   
    	            }	            
    	        }
    	    });
            //Esconder div de carga 
            ocultarLoad();            
        }, 1000); 

	} else if(url=='frm_edit_clientes') {
        
		/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	    :::::::::::::::::::::::::::: Edit formulario ::::::::::::::::::::::::
	    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
        var monto = '';
        setTimeout(function(){
            $('.title').html("Editar clientes");
            var key = parametro().key1;      
            var key2 = parametro().key2;     
            
            var limiteAprobado = 0; 
            loadCliente(key);             
            // setTimeout(function(){ loadCliente(key); }, 100);                

            $('#validacion1').hide();
            $('#validacion2').hide();
            $('#validacion3').hide();       

            $('#modalVentas').on('hidden.bs.modal', function () {
               $("#field_token").trigger('change');
            })

            $("#field_token").change(function(){            
                $("#token_validacion").html('');        
            });     

            $("#field_venta").change(function(){
                $('#validacion1').fadeOut();
                if ($("#field_venta").val()==0) {
                    $('#validacion1').fadeIn();
                    $("#field_venta").val('');
                } else{
                    monto = $("#field_venta").val();
                    if (limiteAprobado==0) {
                        if (monto>limiteVenta) { //supera limite de ventas                      
                            $("#field_venta").val('');
                            $('#modalVentas').modal('show');
                        } else{
                            calcular();
                        }
                    } else{
                        calcular();
                    }               
                }                   
            });
            
            $("#field_cuota").change(function(){
                $('#validacion2').fadeOut();
                if ($("#field_cuota").val()==0) {
                    $('#validacion2').fadeIn();
                    $("#field_cuota").val('');
                    $("#field_valor").val('');
                } else{
                    calcular();
                    flags($(this).val(),$('#field_date').val());
                } 
            });

            $("#field_interes").change(function(){          
                calcular();         
            });

            camposDinamicos();       
            // setTimeout(function(){ camposDinamicos(); }, 500);  
            $("#field_domingo").change(function(){          
                flags($('#field_cuota').val(),$('#field_date').val());         
            });    

            $('#btn_insertEdicion').click(function(event){         
                if (requeridos()) {            
                    event.preventDefault(); 
                    if (validarSaldoRuta($('#field_venta').val(),1)) {
                        sessionStorage.setItem('edit',true);
                        capturarDatosEditados(key,key2); 
                    }                               
                }
            })
            //Esconder div de carga 
            ocultarLoad();
        },1000);    	  	
	}

	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::: Flags [Interes - Cuotas]::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

	function camposDinamicos(){        
		if (flagCuota==1) {
    		$('#field_cuota').removeAttr('disabled');
    	}

    	if (flagInteres==1) {
    		$('#field_interes').removeAttr('disabled');
    	}
	}

	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::: Cargando agregar ::::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

    function loadData(){ 
        // setTimeout(function(){
            var d = new Date(); 
            var dia = ((d.getDate()).toString().length==2?(d.getDate()):'0'+(d.getDate()));
            var mes = ((d.getMonth()+1).toString().length==2?(d.getMonth()+1):'0'+(d.getMonth()+1));
            var annio = d.getFullYear(); 
            $('#field_cuota').val(defaultCuota);
            $('#field_interes').val(defaultInteres);
            $('#field_date').val(dia+'/'+mes+'/'+annio);
            camposDinamicos();
            var result = idb.select("usuario", function (isSelected, responseData) {
            if (isSelected) {
                if(responseData.length != 0){                    
                    $('#field_telefono').val(responseData[0].prefijo);                
                }
            }            
        });
        // }, 500);
    } 

	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::: Cargando editar ::::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/	

    function parametro(){
    	var ruta = window.location.search.substring(1)
        var hash = window.location.hash;
        hash = hash.replace('#','');

        var pair = hash.split("&"); 
        var pair2 = pair[0].split("="); 
		var pair3 = pair[1].split("=");
        var parametros = {
            "key1": pair2[1],
            "key2": pair3[1]
        }; 
		return parametros;
    } 

	function loadCliente(key){         
    	var result = idb.select("usuario", function (isSelected, responseData) {
            if (isSelected) {
                if(responseData.length != 0){
                	var clienteArray = [];	
                    var lastPrestamo = (responseData[0].ruta.detalle.prestamo[key].detalle).length-1;  
                    var abonos = (responseData[0].ruta.detalle.prestamo[key].detalle[lastPrestamo].abonos).length; 
                    //GENERAL       	                	
                	$('#field_alias').val(responseData[0].ruta.detalle.prestamo[key].alias);
			    	$('#field_nombre').val(responseData[0].ruta.detalle.prestamo[key].nombre);
			    	$('#field_apellido').val(responseData[0].ruta.detalle.prestamo[key].apellido);
			    	$('#field_direccion').val(responseData[0].ruta.detalle.prestamo[key].direccion);
			    	$('#field_telefono').val(responseData[0].ruta.detalle.prestamo[key].telefono);
                    if (abonos==0) {    
                        // VENTAS
                        $('#ventaInicial').text(responseData[0].ruta.detalle.prestamo[key].detalle[lastPrestamo].monto_prestado);
                        $('#field_venta').val(responseData[0].ruta.detalle.prestamo[key].detalle[lastPrestamo].monto_prestado);                       
                        $('#field_cuota').val(responseData[0].ruta.detalle.prestamo[key].detalle[lastPrestamo].cantidad_cuotas);
                        $('#field_interes').val(responseData[0].ruta.detalle.prestamo[key].detalle[lastPrestamo].interes);                                
                        $('#field_valor').val(responseData[0].ruta.detalle.prestamo[key].detalle[lastPrestamo].cuota);      
                        $('#field_date').val(fechaFormato(responseData[0].ruta.detalle.prestamo[key].detalle[lastPrestamo].fecha));
                        $('#field_fin').val(fechaFormato(responseData[0].ruta.detalle.prestamo[key].detalle[lastPrestamo].fecha_fin));
                    } else{
                        $('#flagVenta').text('1');
                        $('#ventaInicial').text(1);
                        $('#field_venta').val(1);                       
                        $('#field_cuota').val(1);
                        $('#field_interes').val(1);                                
                        $('#field_valor').val(1);
                        $('#ipills-ventas-tab').hide();
                    }		    	  
                }
            }
            else {
                console.log("Error: " + responseText);
            }
        });
        calcularTotal(); 
        var d = new Date(); 
        var dia = ((d.getDate()).toString().length==2?(d.getDate()):'0'+(d.getDate()));
        var mes = ((d.getMonth()+1).toString().length==2?(d.getMonth()+1):'0'+(d.getMonth()+1));
        var annio = d.getFullYear();
        $('#field_date').val(dia+'/'+mes+'/'+annio);             
	}    

	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::: Calculos :::::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

    function calcular(){ 
    	var total; 
    	var cuota; 
    	$('#field_total').val('');
    	$('#field_valor').val('');
    	//Total a pagar 	
    	if ($('#field_venta').val()!='' && $('#field_interes').val()!='') {
    		total = parseFloat($('#field_venta').val())+($('#field_venta').val()*($('#field_interes').val()/100));	    		
    		$('#field_total').val(total.toFixed(2));
    	}
    	//Valor de cuota
    	if ($('#field_total').val()!='' && $('#field_cuota').val()!='') {
    		cuota = parseFloat($('#field_total').val()/$('#field_cuota').val()).toFixed(2);
    		$('#field_valor').val(cuota);
    	}    	
    }

    function montoCuota(){
        if ($('#field_total').val()!='' && $('#field_cuota').val()!='') {
            cuota = parseFloat($('#field_total').val()/$('#field_cuota').val()).toFixed(2);
            $('#field_valor').val(cuota);
        } 
    }

    function calcularTotal(){
    	setTimeout(function(){
    		total = parseFloat($('#field_venta').val())+($('#field_venta').val()*($('#field_interes').val()/100));              		
    		$('#field_total').val(parseFloat(total).toFixed(2));
            //Valor de cuota
            cuota = parseFloat($('#field_total').val()/$('#field_cuota').val()).toFixed(2);
            $('#field_valor').val(cuota);
    	}, 500);
    }
    
    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::::::::: Token :::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

    function tokenCliente(token){	        
		var result = idb.select("tokens", function (isSelected, responseData) {
        if (isSelected) {
            if(responseData.length != 0){
            	var i = 0;
            	var insertado = 0; //0 = No encontrado 1= Encontrado
                // console.log('2'+token);      
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
            		insertTokenCliente(token);
        		}                	
            } else{ 
            	insertTokenCliente(token);                	
            }
        }
        else {
            console.log("Error: " + responseText);
        }
    	});	    	
    }

    function insertTokenCliente(token_val){
        console.log('entré')
        dataToken = {
            "token_idDb": 0,
            "token": token_val,
            "tipo": 1, //Tabla tt_tipo_token
            "usuario": idEmpleado
        }; 
        // console.log(dataToken)

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
            // console.log(encriptar)
            // console.log(token_val)
            // console.log(token.toString().substring(0, 10))
            if(token.toString().substring(0, 10) == token_val){      
              	idb.insert('tokens', dataToken);                             
              	$("#field_venta").val(monto); 
                calcular();
              	limiteAprobado = 1;  
              	$('#modalVentas').modal('hide');               	
            } 
        }
    }	    

    $("#token_validacion").html('');

    $('#btn_tokenCliente').click(function(event){
    	if ($('#field_token').val()!='') {   
        // console.log('hhhh')    
        // console.log(monto)       
    		tokenCliente($('#field_token').val());
    	} else {
    		$("#token_validacion").html("Ingrese un token");
    	}  	
    })	     

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::::::: Calcular fecha ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

 	var excluir;
 	var fecha_vencimiento; 

    function calcularFecha(d, fecha){
		var sFecha = fecha;
		var sep = sFecha.indexOf('/') != -1 ? '/' : '-';
		var aFecha = sFecha.split(sep);
		var fecha = aFecha[2]+'/'+aFecha[1]+'/'+aFecha[0];
		fecha = new Date(fecha);
		if (excluir==0) {
			fecha.setDate(fecha.getDate()+parseInt(d));	
		} else {
			var i = 0;            
            while (i < d)
            {
                fecha.setDate(fecha.getDate() + parseInt(1));
                if (fecha.getDay() == 0)
                {
                    i--;
                }  
                i++;
            }
		}	

		var anno=fecha.getFullYear();
		var mes= fecha.getMonth()+1;
		var dia= fecha.getDate();			
		mes = (mes < 10) ? ("0" + mes) : mes;
		dia = (dia < 10) ? ("0" + dia) : dia;			
		var fechaFinal = dia + sep + mes + sep + anno;	
    	return (fechaFinal);	
    }    	    

    function flags(d,fecha){	    	
	    if (!$('#field_domingo').prop('checked')) { 
	        // console.log("Sin domingos");		        
	        excluir = 1;
	        fecha_vencimiento = calcularFecha(d, fecha);
            $('#field_fin').val(fecha_vencimiento);
	    } else {
	        // console.log("Con domingos");
	        excluir = 0;
	        fecha_vencimiento = calcularFecha(d, fecha);
            $('#field_fin').val(fecha_vencimiento);
	    }		    
	}

	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::: Formato de fechas ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

	function fechaFormato(date){      	  		
		var sFecha = date;
		var sep = sFecha.indexOf('/') != -1 ? '/' : '-';
		var aFecha = sFecha.split(sep);			
		var fecha = aFecha[2]+'/'+aFecha[1]+'/'+aFecha[0];		
		return fecha;
	}

	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::: Validar saldo de ruta ::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    
	function validarSaldoRuta(venta, accion=0){      	  		
		var flag = true;
		var montoRuta;		
		montoRuta = ((accion==1)? parseFloat(saldoRuta) + parseFloat($('#ventaInicial').text()):parseFloat(saldoRuta))//1: Editando - 0: Agregando	
		if (montoRuta<venta) {
			idb.loadAlert("toast-top-right", "Saldo de ruta insuficiente para realizar una venta por $"+venta+"<br><br>Monto disponible: $"+montoRuta,"Error!",'error');
			flag = false;			
		}			
		return flag;
	}	

	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::::::: Agregar cliente :::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/	  

    function capturarDatos(){	    	       	
    	var dataCliente = {};   	

    	var alias = $('#field_alias').val();
    	var nombre = $('#field_nombre').val();
    	var apellido = ($('#field_apellido').val()=='')?'':$('#field_apellido').val();
    	var direccion = ($('#field_direccion').val()=='')?'':$('#field_direccion').val();
    	var telefono = ($('#field_telefono').val()=='')?'':$('#field_telefono').val();  

    	var valor = $('#field_venta').val();
    	var cuotas = $('#field_cuota').val();
    	var interes = $('#field_interes').val();
    	var total = $('#field_total').val();
    	var valor_cuota = $('#field_valor').val();  	  
    	var fecha = $('#field_date').val(); 

    	var saldo = parseFloat(saldoRuta) - parseFloat(valor);         

    	flags(cuotas,fecha);	        

    	dataCliente = {
    		"cliente_idDb": 0,
    		"alias": alias,
    		"nombre": nombre,
    		"apellido": apellido,
    		"direccion": direccion,
    		"telefono": telefono,
    		"estado": 0,
    		"documentos": [],
    		"detalle":[{
	    		"prestamos_idDb": 0,
                "ds_estado": 0,
            	"ds_saldo": 1,
            	"ds_id": 1,
	    		"monto_prestado": valor,
	    		"monto_pendiente": total,
	    		"cuota": valor_cuota,
	    		"interes": interes,
	    		"cantidad_cuotas": cuotas,
	    		"fecha": fechaFormato(fecha),
	    		"fecha_fin": fechaFormato(fecha_vencimiento), //calculada
	    		"abonos": []
    		}]
    	}; 

    	var result = idb.select("usuario", function (isSelected, responseData) {
            if (isSelected) {
                if(responseData.length != 0){                	
                	var clienteArray = [];
                    idKey = 0;
                    console.log(saldo);
                	$.extend(responseData[0].ruta.detalle, {"monto" : saldo}); 
                    for (var key in responseData[0].ruta.detalle.prestamo) {
                        idKey = parseInt(key)+1;
                    }	
	                clienteArray[idKey] = dataCliente;
                	$.extend(responseData[0].ruta.detalle.prestamo, clienteArray); 
                    responseData[0].actualizado = 1; 
                    idb.insert('usuario', responseData[0]);
                    window.location.href = "index.html?frm_add_clientes";
                }
            }
            else {
                console.log("Error: " + responseText);
            }
        });	    
    }

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::::: Editar Cliente :::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/    
	
    function capturarDatosEditados(key, key2){            	       	
    	var dataCliente = {};   	

    	var alias = $('#field_alias').val();
    	var nombre = $('#field_nombre').val();
    	var apellido = ($('#field_apellido').val()=='')?'':$('#field_apellido').val();
    	var direccion = ($('#field_direccion').val()=='')?'':$('#field_direccion').val();
    	var telefono = ($('#field_telefono').val()=='')?'':$('#field_telefono').val();  

    	var valor = $('#field_venta').val();
    	var cuotas = $('#field_cuota').val();
    	var interes = $('#field_interes').val();
    	var total = $('#field_total').val();
    	var valor_cuota = $('#field_valor').val();  	  
    	var fecha = $('#field_date').val();

    	var venta = parseFloat($('#ventaInicial').text());
    	var saldo = (parseFloat(saldoRuta) + venta) - parseFloat(valor);
        var bandera = $('#flagVenta').text();

    	flags(cuotas,fecha);               
          

    	var result = idb.select("usuario", function (isSelected, responseData) {
            if (isSelected) {
                if(responseData.length != 0){ 
                    if (bandera==0) {
                        dataCliente = {
                            "prestamos_idDb": key,
                            "ds_estado": 0,
                            "ds_saldo": responseData[0].ruta.detalle.prestamo[key].detalle[key2].ds_saldo,
                            "ds_id": responseData[0].ruta.detalle.prestamo[key].detalle[key2].ds_id,
                            "monto_prestado": valor,
                            "monto_pendiente": total,
                            "cuota": valor_cuota,
                            "interes": interes,
                            "cantidad_cuotas": cuotas,
                            "fecha": fechaFormato(fecha),
                            "fecha_fin": fechaFormato(fecha_vencimiento),//calculada
                            "abonos": []               
                        };   
                    }
                    
                    responseData[0].ruta.detalle.prestamo[key].alias = alias;
                    responseData[0].ruta.detalle.prestamo[key].nombre = nombre;
                    responseData[0].ruta.detalle.prestamo[key].apellido = apellido;
                    responseData[0].ruta.detalle.prestamo[key].direccion = direccion;
                    responseData[0].ruta.detalle.prestamo[key].telefono = telefono;
                    
                	var clienteArray = [];                    
                    clienteArray[key2] = dataCliente;
                    
                    if (bandera==0) { //0: Cliente sin abonos 1: Cliente con abonos
                        $.extend(responseData[0].ruta.detalle, {"monto" : saldo}); 
                        $.extend(responseData[0].ruta.detalle.prestamo[key].detalle, clienteArray);                   
                    } 
                    responseData[0].actualizado = 1;  
                    idb.insert('usuario', responseData[0]);
                    window.location.reload();
                }
            }
            else {
                console.log("Error: " + responseText);
            }
        });	    
    }

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::: Campos requeridos ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/  

    function requeridos(){               
        var regresar = true;  
        if ($('#field_alias').val()=='') {
            errorInput('#field_alias');
            regresar = false;
        }   

        if ($('#field_nombre').val()=='') {
            errorInput('#field_nombre');
            regresar = false;
        }

        if ($('#field_telefono').val()=='') {
            errorInput('#field_telefono');
            regresar = false;
        }

        if ($('#field_venta').val()=='') {
            errorInput('#field_venta');
            regresar = false;
        }   

        if ($('#field_cuota').val()=='') {
            errorInput('#field_cuota');
            regresar = false;
        } 

        if ($('#field_interes').val()=='') {
            errorInput('#field_interes');
            regresar = false;
        }
        return regresar;
    } 	    

    $('#field_alias').keypress(function() {
        ocultarErroresInput(this); 
    });

    $('#field_nombre').keypress(function() {
        ocultarErroresInput(this); 
    });

    $('#field_telefono').keypress(function() {
        ocultarErroresInput(this); 
    });

    $('#field_venta').keypress(function() {
        ocultarErroresInput(this); 
    });

    $('#field_cuota').keypress(function() {
        ocultarErroresInput(this); 
    });

    $('#field_interes').keypress(function() {
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
    ::::::::::::::::::::::::::::::: Solo teléfonos ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

    $('body').on('keypress keyup blur', '.number', function(){    
        $(this).val($(this).val().replace(/[^0-9\.]/g,''));        
        if ((event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::::: Mask teléfono ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/    

    // $("#field_telefono").mask("9999-9999");  
	// $("#field_telefono").on("blur", function() {
	// 	var last = $(this).val().substr( $(this).val().indexOf("-") + 1 );

	// 	if( last.length == 5 ) {
	// 	    var move = $(this).val().substr( $(this).val().indexOf("-") + 1, 1 );
	// 	    var lastfour = last.substr(1,4);
	// 	    var first = $(this).val().substr( 0, 9 );

	// 	    $(this).val( first + move + '-' + lastfour );
	// 	}
	// });

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::: Showing alerts :::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

    $( function() {

       if ( sessionStorage.getItem('insert') != 'false' && sessionStorage.getItem('insert') != null) {
           idb.loadAlert('toast-top-right', 'El préstamo ha sido registrado','Alerta','success');           
           sessionStorage.setItem('insert',false);
       }
       if ( sessionStorage.getItem('edit') != 'false' && sessionStorage.getItem('edit') != null) {
           idb.loadAlert('toast-top-right', 'El préstamo ha sido editado','Alerta','warning');           
           sessionStorage.setItem('edit',false);
       }
    }) 
});