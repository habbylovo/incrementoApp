jQuery(document).ready(function($){    
	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::: Insert formulario ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    $('#btn_insert').click(function(event){        
        if (requeridos()) {
            event.preventDefault(); 
            console.log("hereddd");
             $.ajax({
                type: 'post',
	            dataType: 'json',
	            url: url + 'seguridad/add_groups', 
	            data: $("#frm_groups").serialize(),                           
	            success: function (result) {
                    sessionStorage.setItem('insert',true); 
                    window.location.href = result.page;                     	            	                    
                }
            });
        }
    })

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::: Edit formulario ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    $('#btn_edit').click(function(event){
        if (requeridos()) {
            event.preventDefault(); 
             $.ajax({
                type: 'post',
                dataType: 'json',
                url: url + 'seguridad/editTableGroups', 
                data: $("#frm_groups").serialize(),                           
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

    function requeridos(accion){
        var regresar = true;  

        if ($('#field_name').val()=='') {
            errorInput('#field_name');
            regresar = false;
        }  
        if ($('#field_rutas').val()=='') {
            errorSelect();      
            regresar = false;
        }             
        
        return regresar;
    } 

    $('#field_name').keypress(function() {
        ocultarErroresInput(this);
        $('#error').fadeOut();         
        $('#error').text(''); 
    }); 

    $('#field_rutas').change(function() {
        ocultarErroresSelect(this);
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

    function ocultarErroresInput($element){
		$($element).removeClass('is-invalid');
    }

    function ocultarErroresSelect(){
    	$('.select2-selection').css({		  
		  'border-color':'',
		  'box-shadow':''
		});
    } 

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::: Showing alerts :::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/ 

    $( function() {
       if ( sessionStorage.getItem('insert') != 'false' && sessionStorage.getItem('insert') != null) {
           callToaster('toast-top-right', 'El grupo ha sido creado con éxito','Alerta');           
           sessionStorage.setItem('insert',false)
       }
       if ( sessionStorage.getItem('edit') != 'false' && sessionStorage.getItem('edit') != null) {
           callToaster('toast-top-right', 'El grupo ha sido actualizado con éxito','Alerta','warning');           
           sessionStorage.setItem('edit',false)
       }       
    })   

});