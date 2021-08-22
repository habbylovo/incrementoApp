route = {
    ruta: null,
    ext: null,
    vistas: null,
    init:function(options){
        route.ruta = options.ruta;
        route.ext = options.ext;
        route.vistas = options.vistas;
    },
    cargar_vista: function(ruta){
        // var ruta = url.split('/');
        var vistaAlias = ruta;
        // var result = $.grep(route.vistas, function(element, index) {
        //     console.log(element);
        //     console.log(vistaAlias);
        //     return (index === vistaAlias);
        // });
        result = (typeof route.vistas[vistaAlias] !== "undefined")?route.vistas[vistaAlias]:route.vistas.default;
        // console.log(route.ruta + result + route.ext);
        var view = '';
        $.ajax({
            url: route.ruta + result + route.ext,
            // async: false,
            beforeSend:function(request){
            },
            success: function(data){
                view = data;
                $("#vista").html(view);
            },
            error: function(data) {
                view = data;
            }
        });
        // return view;
    },
    cargar_js:function(url){
        var js = '<link href="../assets/template/dist/assets/plugins/nprogress/nprogress.css" rel="stylesheet" />';
        return js;
    }
};
//Colocar acá todas las vistas
var vistasDir = {
    clientes: "clientes_grid",
    frm_add_clientes: "add_cliente",
    frm_edit_clientes: "edit_cliente",
    abonar: "abonar_grid",
    frm_add_abonos: "add_abono",
    frm_add_renovacion: "add_renovacion",
    resumen: "resumen_grid",
    test: "test",   
    default: "default"
};

route.init({
    ruta: "./views/",
    ext: ".html",
    vistas: vistasDir
});