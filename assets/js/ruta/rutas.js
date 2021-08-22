jQuery(document).ready(function($){   
	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::: Insert formulario ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    $('#btn_insert').click(function(event){        
        if (requeridos(0)) {
            event.preventDefault(); 
             $.ajax({
                type: 'post',
	            dataType: 'json',
	            url: url + 'catalogo/add_unidades', 
	            data: $("#frm_ruta").serialize(),                           
	            success: function (result) {                                            
                    sessionStorage.setItem('insert',true); 
                    window.location.href = result.page; 
                }
            });
        }
    })    
    
    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::: Edit formulario ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    $('#btn_edit').click(function(event){
        if (requeridos(1)) {            
            event.preventDefault(); 
             $.ajax({
                type: 'post',
                dataType: 'json',
                url: url + 'catalogo/updateTableUnidades', 
                data: $("#frm_ruta").serialize(),                           
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

    function requeridos(form){
        //0 : Agregando
        //1 : Editando        
        var regresar = true;  

        if ($('#field_nombre').val()=='') {
            errorInput('#field_nombre');
            regresar = false;
        }
        var selectPais = (form==1)?'#field_pais1':'#field_pais';
        var selectEstado = (form==1)?'#field_estado1':'#field_estado';
        
        if (!$(selectPais).val()) {            
            errorInput(selectPais);
            regresar = false;
        }
        if (!$(selectEstado).val()) {
            errorInput(selectEstado);
            regresar = false;
        }                   
        
        return regresar;
    } 

    $('#field_nombre').keypress(function() {
        ocultarErroresInput(this); 
    });

    $('#field_pais').change(function() {
        ocultarErroresInput(this); 
    });
    
    $('#field_estado').change(function() {
        ocultarErroresInput(this); 
    });  

    $('#field_pais1').change(function() {
        ocultarErroresInput(this); 
    });
    
    $('#field_estado1').change(function() {
        ocultarErroresInput(this); 
    });  

    function errorInput($element){    	
    	$($element).addClass('is-invalid');
    }

    function ocultarErroresInput($element){
		$($element).removeClass('is-invalid');
    }

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::::: Cambio monto ruta :::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

    $("#field_money").keyup(function(){
      $("#money").val($(this).val());
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
    ::::::::::::::::::::::::: SELECT ESTADO X PAIS ::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/  
    
    estados('#field_pais','#field_estado');

    $('#field_pais').change(function(){
        estados('#field_pais','#field_estado');
    })

    $('#field_pais1').change(function(){
        estados('#field_pais1','#field_estado1');
    })

    function estados(select,element){        
        var pais = $(select).val();       
        $.ajax({
            type: 'post',
            url: url + 'catalogo/estados',
            data: {'pais': pais},            
            success: function (result) {
                $(element).html(result);
            }
        });
    }

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::: FLAG CUOTA/INTERES ::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/ 

    flags('#field_variable1','#value1');
    flags('#field_variable2','#value2');    

    $('#field_variable1').change(function(){        
       flags(this, '#value1');
    });

    $('#field_variable2').change(function(){        
       flags(this, '#value2');
    });
    
    function flags(element1,element2){
        if (!$(element1).prop('checked')) { 
            $(element2).val(1);
        } else {
            $(element2).val(0);
        }
    }
    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::::::: Cambiar Vendedor ::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/  

    $('.chk').bind('click',function(){
      var input = $(this).find('input');  
      if(input.prop('checked')){        
        input.prop('checked',false);
        $("#new").css("display","none");
      }else{
        input.prop('checked',true);
        $("#new").css("display","");
      }
    });

    $("#new").css("display","none");

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::::::: Abrir unidad ::::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/  
    var id;
    $('a[href$="#Modal"]').click(function(){
        event.preventDefault(); 
        $('#openModal').modal('toggle');
        $('.modal-title').html('Alerta');
        $('.modal-body').html('¿Está seguro de abrir la unidad?');
        id = $(this).data("id");
        //console.log(id)
    })

    $('#abrirUnidad').click(function(){    
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: url + 'catalogo/open_unidad',
            data: { id : id },                             
            success: function (result) {
                if (result.ok==1) {                               
                    $('#openModal').modal('hide');  
                    sessionStorage.setItem('open',true);
                    window.location.href = result.page;                
                }
            }
                
        });    
    }) 

    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::: Showing alerts :::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

    $( function() {

       if ( sessionStorage.getItem('insert') != 'false' && sessionStorage.getItem('insert') != null) {
           callToaster('toast-top-right', 'La unidad ha sido creada con éxito','Alerta');           
           sessionStorage.setItem('insert',false);
       }
       if ( sessionStorage.getItem('edit') != 'false' && sessionStorage.getItem('edit') != null) {
           callToaster('toast-top-right', 'La unidad ha sido actualizada con éxito','Alerta','warning');           
           sessionStorage.setItem('edit',false);
       }
       if ( sessionStorage.getItem('open') != 'false' && sessionStorage.getItem('open') != null) {
           callToaster('toast-top-right', 'La unidad está abierta','Alerta','warning');           
           sessionStorage.setItem('open',false);
       }
    })
});