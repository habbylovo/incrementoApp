jQuery(document).ready(function($){
    
    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::: Edit formulario ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    $('#btn_edit').click(function(event){
        if (requeridos()) {            
            event.preventDefault();            
            var ruta = $('#field_ruta').val();
            var cliente = $('#field_id').val();            
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: url + 'catalogo/edit_clientes/'+cliente+'/'+ruta, 
                data: $("#frm_cliente").serialize(),                           
                success: function (result) {                    
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

        if ($('#field_alias').val()=='') {
            errorInput('#field_alias');
            regresar = false;
        }           
        
        return regresar;
    } 

    $('#field_alias').keypress(function() {
        ocultarErroresInput(this); 
    });
    

    function errorInput($element){    	
    	$($element).addClass('is-invalid');
    }

    function ocultarErroresInput($element){
		$($element).removeClass('is-invalid');
    }

});