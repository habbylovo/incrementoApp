jQuery(document).ready(function($){ 

    showSelect();   
	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::: Insert formulario ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    $('#btn_insert').click(function(event){
        event.preventDefault(); 
        if (requeridos(1)) {            
             $.ajax({
                type: 'post',
	            dataType: 'json',
	            url: url + 'seguridad/add_users', 
	            data: $("#frm_user").serialize(),                           
	            success: function (result) {
                    if (result.repeat!='') { 
                        existeUsuario(result.repeat); 
                        callToaster('toast-top-right', 'Nombre de usuario en uso','Error','error');                        
                    } else {   
                        sessionStorage.setItem('insert',true);                     
                        window.location.href = result.page;  
                    }	            	                    
                }
            });
        }
    })

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::: Edit formulario ::::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    $('#btn_edit').click(function(event){
        event.preventDefault();
        if (requeridos(2)) {
        // console.log('vineeeee')                                  
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: url + 'seguridad/save_edit', 
                data: $("#frm_user").serialize(),                           
                success: function (result) {                    
                    if (result.repeat!='') {                        
                        existeUsuario(result.repeat); 
                        callToaster('toast-top-right', 'Nombre de usuario en uso','Error','error');                        
                    } else { 
                        sessionStorage.setItem('edit',true);                       
                        window.location.href = result.page;  
                    }                                       
                }
            });
        }
    })
    
    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::: Campos requeridos ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/  

    function requeridos(accion){
        var regresar = true;  

        if ($('#field_user').val()=='') {
            errorInput('#field_user');
            regresar = false;
        }

        if ($('#field_groups').val()=='') {            
            errorSelect();      
            regresar = false;
        } 

        if (!validarGrupo()) {
            regresar = false;
            if ($('#field_grupo').val()=='') {
                errorSelectGrupo('#field_grupo');  
            } else {
                regresar = true;
            }
        }    
        if (!validarSupervisor()) {
            regresar = false;
            if ($('#field_supervisor').val()=='' || $('#field_supervisor').val()==0) {
                errorSelectGrupo('#field_supervisor');  
            } else {
                regresar = true;
            }
        } 

        if (accion==1) {            
            if ($('#field_password').val()=='') {
                errorInput('#field_password');
                regresar = false;
            }            
        }  else if(accion==2){            
            if ($('#flag_password').prop('checked')) {
                if ($('#field_password').val()=='') {
                    errorInput('#field_password');
                    regresar = false;
                }
            }            
        }  
        
        return regresar;
    } 
    
    function validarGrupo(){
        var sinGrupo = true;
        var permisos = [];
        $("#field_groups option:selected").each(function () {            
            if ($(this).length) {
                permisos.push($.trim($(this).text()));                               
            }
        }); 

        var elementos = permisos.length;        
        for (var i = 0; i < elementos; i++) {           
           if (permisos[i]=="Supervisor") {               
                sinGrupo = false;
                i = elementos; 
           }
        }
        return sinGrupo;    
    }

    function validarSupervisor(){
        var sinSupervisor= true;
        var permisos = [];
        $("#field_groups option:selected").each(function () {            
            if ($(this).length) {
                permisos.push($.trim($(this).text()));                               
            }
        }); 

        var elementos = permisos.length;        
        for (var i = 0; i < elementos; i++) {           
           if (permisos[i]=="Vendedor") {               
                sinSupervisor = false;
                i = elementos; 
           }
        }
        return sinSupervisor;    
    }

    $('#field_user').keypress(function() {
        ocultarErroresInput(this);
        $('#error').fadeOut();         
        $('#error').text(''); 
    });

    $('#field_password').keypress(function() {
        ocultarErroresInput(this);
    });

    $('#field_groups').change(function() {
        ocultarErroresSelect(this);
    });

    $('#field_grupo').change(function() {
        ocultarErroresSelectGrupo(this);
    });

    $('#field_supervisor').change(function() {
        ocultarErroresSelectGrupo(this);
    });


    function errorInput($element){    	
    	$($element).addClass('is-invalid');
    }

    function errorSelect(){
    	$('.select2-selection').css({		  
		  'border-color':'#fe5461',
		  'box-shadow':'0 0 0 0.2rem rgba(254, 84, 97, 0.25)'
		});
    }

    function errorSelectGrupo($element){
        $($element).css({         
          'border-color':'#fe5461',
          'box-shadow':'0 0 0 0.2rem rgba(254, 84, 97, 0.25)'
        });
    }

    function ocultarErroresInput($element){
		$($element).removeClass('is-invalid');
    }

    function ocultarErroresSelect(){
    	$('.select2-selection').css({		  
		  'border-color':'',
		  'box-shadow':''
		});
    }

    function ocultarErroresSelectGrupo($element){
        $($element).css({         
          'border-color':'',
          'box-shadow':''
        });
    }

    function existeUsuario(message){
        $('#field_user').val(''); 
        $('#error').show();   
        $('#error').text(message);  
        errorInput('#field_user');
    }

    

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::: Agregar grupo  o supervisor ::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/ 
    
    $('#field_groups').change(function(){
        showSelect();
    });

    function showSelect(){        
        var opciones = [] ;   
        $("#field_groups option:selected").each(function () {
            opciones.push($.trim($(this).text()));
        });
        // console.log(opciones)   
        // Mostrando select de grupos 
        if(jQuery.inArray("Supervisor", opciones) !== -1){            
            $('#grupos').fadeIn();
            $('#valor').val("1");            
        } else{
            $('#grupos').fadeOut();
            $('#valor').val("");           
        } 
        // Mostrando select de supervisores para vendedores
        if(jQuery.inArray("Vendedor", opciones) !== -1){            
            $('#supervisor').fadeIn();
            $('#valor_supervisor').val("1");            
        } else{
            $('#supervisor').fadeOut();
            $('#valor_supervisor').val("");           
        }
    }
    
    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::: Cambiar contraseña ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/ 
    
    $('#flag_password').change(function(){
        if ($('#flag_password').prop('checked')) {
            $('#field_password').attr('required','true');
            $('#new_password').fadeIn();
        } else {
            $('#new_password').fadeOut();
        }
    });


    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::::: Cambiar empleado ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/ 
    
    $('#flag_empleado').change(function(){
        if ($('#flag_empleado').prop('checked')) {            
            $('#new_empleado').fadeIn();
        } else {
            $('#new_empleado').fadeOut();
        }
    });

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::: Showing alerts :::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/ 

    $( function() {
       if ( sessionStorage.getItem('insert') != 'false' && sessionStorage.getItem('insert') != null) {
           callToaster('toast-top-right', 'El usuario ha sido creado con éxito','Alerta');           
           sessionStorage.setItem('insert',false)
       }
       if ( sessionStorage.getItem('edit') != 'false' && sessionStorage.getItem('edit') != null) {
           callToaster('toast-top-right', 'El usuario ha sido actualizado con éxito','Alerta','warning');           
           sessionStorage.setItem('edit',false)
       }    
    })

});