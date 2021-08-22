jQuery(document).ready(function($){	
	
    if(url=='frm_add_renovacion') {

    	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	    ::::::::::::::::::::::::::::: Add formulario ::::::::::::::::::::::::
	    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
        var monto = '';
        setTimeout(function(){         	
        	var limiteAprobado = 0;
            loadDataRenovacion(); 
        	// setTimeout(function(){ loadDataRenovacion(); }, 150);
            loadCard();
            // setTimeout(function(){ loadCard(); }, 150);

        	$('#validacion1').hide();
        	$('#validacion2').hide();
        	$('#validacion3').hide(); 

        	$('.title').html("Renovación"); 

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
                        // console.log("limite "+ limiteVenta);
                        if (limiteAprobado==0) {
                            if (monto>limiteVenta) { //supera limite de ventas
                                $("#field_venta").val('');
                                $("#field_venta").trigger('change');
                                $('#modalVentas').modal('show');
                            } else{
                                calcularRenovar();
                            }
                        } else{
                            calcularRenovar();
                        }               
                    }
                } else{
                    calcularRenovar();
                }    		    		  		
    		});
    		
    		$("#field_cuota").change(function(){
    			$('#validacion2').fadeOut();
        		if ($("#field_cuota").val()==0) {
        			$('#validacion2').fadeIn();
        			$("#field_cuota").val('');
        		} else{
        			calcularRenovar();
        		} 
    		});

    		$("#field_interes").change(function(){			
        		calcularRenovar();    		
    		});	 

    	    $('#btn_insertRenovacion').click(function(event){	    	
    	        if (requeridosRenovar()) {            
    	            event.preventDefault(); 
                    if (validarSaldoRuta($('#field_venta').val())) {
                        sessionStorage.setItem('insertRenovacion',true);
                        capturarDatosRenovar(parametroRenovar());
                    }            		            
    	        }
    	    });
            //Esconder div de carga 
            ocultarLoad();
        },1000);
	}     

	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::: Flags [Interes - Cuotas]::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

	function camposDinamicosRenovar(){
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

    function loadDataRenovacion(){ 	    	
    	// setTimeout(function(){
            var d = new Date(); 
            var dia = ((d.getDate()).toString().length==2?(d.getDate()):'0'+(d.getDate()));
            var mes = ((d.getMonth()+1).toString().length==2?(d.getMonth()+1):'0'+(d.getMonth()+1));
            var annio = d.getFullYear();           
    		$('#field_cuota').val(defaultCuota);
	    	$('#field_interes').val(defaultInteres);
            $('#field_date').val(dia+'/'+mes+'/'+annio);
	    	camposDinamicosRenovar();
    	// }, 500);
    } 

    function loadCard(){     
        var name, phone, location, nickname;   
        var result = idb.select("usuario", function (isSelected, responseData) {
            if (isSelected) {
                if(responseData.length != 0){ 
                    name = responseData[0].ruta.detalle.prestamo[parametroRenovar()].nombre +' '+responseData[0].ruta.detalle.prestamo[parametroRenovar()].apellido;
                    phone = responseData[0].ruta.detalle.prestamo[parametroRenovar()].telefono;
                    location = responseData[0].ruta.detalle.prestamo[parametroRenovar()].direccion;
                    nickname = responseData[0].ruta.detalle.prestamo[parametroRenovar()].alias;
                    $('#name').html(name+' ('+nickname+')');
                    $('#phone').html(((phone=='')?'No registrado':phone));
                    $('#location').html(((location=='')?'No registrada':location)); 
                }
            }
            else {
                console.log("Error: " + responseText);
            }             
        });        
    }

	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::: Capturando id usuario ::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/	

    function parametroRenovar(){
        var ruta = window.location.search.substring(1)
        var hash = window.location.hash;
        hash = hash.replace('#','');
    	// var ruta = window.location.search.substring(1)
        // var pair = ruta.split("="); 
		var pair = hash.split("="); 
		// console.log(pair[1])
		return pair[1];
    }

	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::: Calculos :::::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

    function calcularRenovar(){ 
    	var total; 
    	var cuota; 
    	$('#field_total').val('');
    	$('#field_valor').val('');
    	//Total a pagar 	
    	if ($('#field_venta').val()!='' && $('#field_interes').val()!='') {
    		total = parseFloat($('#field_venta').val())+($('#field_venta').val()*($('#field_interes').val()/100));	    		
    		$('#field_total').val(parseFloat(total).toFixed(2));
    	}
    	//Valor de cuota
    	if ($('#field_total').val()!='') {
    		cuota = parseFloat($('#field_total').val()/$('#field_cuota').val()).toFixed(2);
    		$('#field_valor').val(cuota);
    	}    	
    }

    function calcularTotalRenovar(){
    	// setTimeout(function(){
    		total = parseFloat($('#field_venta').val())+($('#field_venta').val()*($('#field_interes').val()/100));	    		
    		$('#field_total').val(parseFloat(total).toFixed(2));
            //Valor de cuota            
            cuota = parseFloat($('#field_total').val()/$('#field_cuota').val()).toFixed(2);
            $('#field_valor').val(cuota);           
    	// }, 500);
    }
    
    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::::::::: Token :::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

    function tokenRenovar(token){		     
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
            		insertTokenRenovar(token);
        		}                	
            } else{ 	
            	insertTokenRenovar(token);                	
            }
        }
        else {
            console.log("Error: " + responseText);
        }
    	});	    	
    }

    function insertTokenRenovar(token_val){
        
        dataToken = {
            "token_idDb": 0,
            "token": token_val,
            "tipo": 1, //Tabla tt_tipo_token
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
              	$("#field_venta").val(monto); 
                calcularRenovar();
              	limiteAprobado = 1;  
              	$('#modalVentas').modal('hide');               	
            } 
        }
    }	    

    $("#token_validacion").html('');

    $('#btn_token').click(function(event){
    	if ($('#field_token').val()!='') {            
    		tokenRenovar($('#field_token').val());
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
	    } else {
	        // console.log("Con domingos");
	        excluir = 0;
	        fecha_vencimiento = calcularFecha(d, fecha);
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
    
    function validarSaldoRuta(venta){                 
        var flag = true;         
        if (saldoRuta<venta) {
            idb.loadAlert("toast-top-right", "Saldo de ruta insuficiente para realizar una venta por $"+venta+"<br><br>Monto disponible: $"+saldoRuta,"Error!",'error');
            flag = false;           
        }           
        return flag;
    }

	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::::::: Nuevo prestamo ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

    function capturarDatosRenovar(key){	    	       	
    	var dataRenovacion = {};  	

    	var valor = $('#field_venta').val();
    	var cuotas = $('#field_cuota').val();
    	var interes = $('#field_interes').val();
    	var total = $('#field_total').val();
    	var valor_cuota = $('#field_valor').val();  	  
    	var fecha = $('#field_date').val(); 

        var saldo = parseFloat(saldoRuta - valor).toFixed(2);

    	flags(cuotas,fecha);	        

    	dataRenovacion = { 
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
    		"fecha_fin": fechaFormato(fecha_vencimiento),//calculada
    		"abonos": []    		
    	}; 

    	var result = idb.select("usuario", function (isSelected, responseData) {
            if (isSelected) {
                if(responseData.length != 0){
                	var renovacionArray = [];
                    $.extend(responseData[0].ruta.detalle, {"monto" : saldo}); 	
                    // for (var keyPrestamo in responseData[0].ruta.detalle.prestamo[key].detalle) {
                    //     idKey = parseInt(keyPrestamo) + 1;
                    // }  
                    idKey = (responseData[0].ruta.detalle.prestamo[key].detalle).length;              
	                renovacionArray[idKey] = dataRenovacion;
                	$.extend(responseData[0].ruta.detalle.prestamo[key].detalle, renovacionArray); 
                    responseData[0].actualizado = 1;                  
                    idb.insert('usuario', responseData[0]);
                    window.location.href = "index.html?abonar";
                }
            }
            else {
                console.log("Error: " + responseText);
            }
        });	    
    }

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::: Campos requeridosRenovar ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/  

    function requeridosRenovar(){               
        var regresar = true;        

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
    :::::::::::::::::::::::::::: Showing alerts :::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

    $( function() {

       if ( sessionStorage.getItem('insertRenovacion') != 'false' && sessionStorage.getItem('insertRenovacion') != null) {
           idb.loadAlert('toast-top-right', 'La renovación ha sido registrada','Alerta','success');           
           sessionStorage.setItem('insertRenovacion',false);
       }
    })
     
});