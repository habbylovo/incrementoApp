jQuery(document).ready(function($){
    var conexionA = true;
    idb.logeado();

	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::::::: Iniciar sesión ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    
    $("#field_password").keyup(function(event){
        if(event.which == 13){
            $('#btn_iniciar').trigger('click');
        }
    })
    $('#btn_iniciar').click(function(event){        
        if (requeridos()) {  
            mostrarLoad();         
            var field_user = $("#field_user").val();
            var field_password = $("#field_password").val();            
            if(field_user != '' && field_password != ''){
                setTimeout(function(){
                    if(idb.check_alive() && conexionA){
                        if(!idb.login(field_user, field_password)){
                            idb.loadAlert("toast-top-right", "Su usuario o contraseña es incorrecto","Upps!"); 
                            $("#field_user").val('');
                            $("#field_password").val('');                            
                        }
                    } else{
                        idb.login_local(field_user, field_password);
                    } 
                },600);                             
            }            
        }
    })
    addEventListener('online', (e) => {
        conexionA = true;
        console.log('hay conexion');
    })
    addEventListener('offline', (e) => {
        conexionA = false;
        console.log('no hay conexion');
    })
    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::: Campos requeridos ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/  

    function requeridos(){
        var regresar = true;  

        if ($('#field_user').val()=='') {
            errorVacio('#field_user');
            regresar = false;
        }  

        if ($('#field_password').val()=='') {
            errorVacio('#field_password');
            regresar = false;
        }                 
        
        return regresar;
    } 

    $('#field_user').keypress(function() {
        ocultarError(this);
        $('#error').fadeOut();         
        $('#error').text(''); 
    });

    $('#field_password').keypress(function() {
        ocultarError(this);
    });    

    function errorVacio($element){    	
    	$($element).addClass('is-invalid');
    }    

    function ocultarError($element){
		$($element).removeClass('is-invalid');
    }   

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::::: Div de carga :::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/  

    function mostrarLoad(){
        $('.loader-wrapper').show();
    }  

});