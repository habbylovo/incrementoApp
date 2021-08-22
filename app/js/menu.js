jQuery(document).ready(function($){    
	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::: Menú :::::::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    $('#menu_cliente').click(function(event){
        $(this).removeAttr("href");
        $('#template2').load('views/clientes_grid.html');       
        $('#template2').load('views/clientes_grid1.html');
    }) 

});