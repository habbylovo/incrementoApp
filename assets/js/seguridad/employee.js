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
	            url: url + 'seguridad/add_employees', 
	            data: $("#frm_employee").serialize(),                           
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
                url: url + 'seguridad/editTableEmployee', 
                data: $("#frm_employee").serialize(),                           
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

        if ($('#field_lastname').val()=='') {
            errorInput('#field_lastname');
            regresar = false;
        }         
        
        return regresar;
    } 

    $('#field_name').keypress(function() {
        ocultarErroresInput(this);
        $('#error1').fadeOut();         
        $('#error1').text(''); 
    });

    $('#field_lastname').keypress(function() {
        ocultarErroresInput(this);
        $('#error2').fadeOut();         
        $('#error2').text(''); 
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
           callToaster('toast-top-right', 'El empleado ha sido creado con ??xito','Alerta');           
           sessionStorage.setItem('insert',false)
       }
       if ( sessionStorage.getItem('edit') != 'false' && sessionStorage.getItem('edit') != null) {
           callToaster('toast-top-right', 'El empleado ha sido actualizado con ??xito','Alerta','warning');           
           sessionStorage.setItem('edit',false)
       }    
    })

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::::::::: Solo tel??fonos ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

    $('body').on('keypress keyup blur', '.number', function(){    
        $(this).val($(this).val().replace(/[^0-9\.]/g,''));        
        if ((event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });

});