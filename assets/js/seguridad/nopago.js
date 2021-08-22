jQuery(document).ready(function($){    
	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::: Save formulario ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    $('#btn_insert').click(function(event){
        if (requeridos()) {
            event.preventDefault(); 
             $.ajax({
                type: 'post',
	            dataType: 'json',
	            url: url + 'seguridad/add_nopagos', 
	            data: $("#frm_nopago").serialize(),                           
	            success: function (result) {
                    sessionStorage.setItem('insert',true);
                    window.location.href = result.page;     
                }
            });
        }
    })  

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::: Save formulario ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    $('#btn_edit').click(function(event){
        if (requeridos()) {
            event.preventDefault(); 
             $.ajax({
                type: 'post',
                dataType: 'json',
                url: url + 'seguridad/editTableMotivos', 
                data: $("#frm_nopago").serialize(),                           
                success: function (result) { 
                    sessionStorage.setItem('edit',true);                  
                    window.location.href = result.page;     
                }
            });
        }
    })   
    
    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::: Campos requeridos ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/  

    function requeridos(){
        var regresar = true;  

        if ($('#field_name').val()=='') {
            errorInput('#field_name');
            regresar = false;
        }                 
        
        return regresar;
    } 

    $('#field_name').keypress(function() {
        ocultarErroresInput(this);
        $('#error1').fadeOut();         
        $('#error1').text(''); 
    });   
    

    function errorInput($element){    	
    	$($element).addClass('is-invalid');
    }

    function ocultarErroresInput($element){
		$($element).removeClass('is-invalid');
    }

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::: Showing alerts :::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/ 

    $( function() {
       if ( sessionStorage.getItem('insert') != 'false' && sessionStorage.getItem('insert') != null) {
           callToaster('toast-top-right', 'El motivo ha sido creado con éxito','Alerta');           
           sessionStorage.setItem('insert',false)
       }
       if ( sessionStorage.getItem('edit') != 'false' && sessionStorage.getItem('edit') != null) {
           callToaster('toast-top-right', 'El motivo ha sido actualizado con éxito','Alerta','warning');           
           sessionStorage.setItem('edit',false)
       }    
    })

});