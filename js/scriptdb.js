idb = {
    idbObject: null, // windows indexedDB object.
    idbtran: null, // windows transaction object.
    dbRequest: null, // db creation request.
    db: null, //database
    version: 1, // database version
    tables: null, // collection of object store.
    init: function (options) {
        // idb.pwa();
        if ('indexedDB' in window) {
            idb.idbObject = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
            idb.idbtran = window.IDBTransaction || window.webkitIDBTransaction;
            idb.tables = options.tables;

            var idbRequest = window.indexedDB.open(options.database, options.version); // open/create db with specific version
            idbRequest.onerror = function () {
                console.log("Error opening database.");
            };

            idbRequest.onsuccess = function (e) { // store success db object in order for curd.
                idb.db = this.result;
                idb.version = options.version;
            };

            idbRequest.onupgradeneeded = function (event) { // creation of object store first time on version change.
                var resultDb = event.target.result;
                idb.db = resultDb;
                var optionTables = idb.tables;


                //drop unwanted tables
                for (var i = 0; i < resultDb.objectStoreNames.length; i++) {
                    var needToDrop = true;
                    for (var j = 0; j < optionTables.length; j++) {
                        if (resultDb.objectStoreNames[i] == optionTables[j].name) {
                            needToDrop = false;
                            break;
                        }
                    }
                    if (needToDrop) {
                        idb.db.deleteObjectStore(resultDb.objectStoreNames[i]);
                    }
                }

                //create new tables
                for (var i = 0; i < optionTables.length; i++) {
                    if (!resultDb.objectStoreNames.contains(optionTables[i].name)) {
                        var objectStore = resultDb.createObjectStore(optionTables[i].name, { keyPath: optionTables[i].keyPath, autoIncrement: optionTables[i].autoIncrement });
                        console.log(optionTables[i].name + " Creada.");
                        if (optionTables[i].index != null && optionTables[i].index != 'undefined') {
                            for (var idx = 0; idx < optionTables[i].index.length; idx++) {
                                objectStore.createIndex(optionTables[i].index[idx].name, optionTables[i].index[idx].name, { unique: optionTables[i].index[idx].unique });
                            }
                        }
                    }
                }
            }
        }
        else {
            console.log("This browser doesn't support IndexedDB");
        }
    },
    pwa:function(){
        if ('serviceWorker' in navigator) {  
            navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Registro de Service Worker exitoso', reg))
            .catch(err => console.warn('Error al tratar de registrar el Service Worker', err))
        }
    },
    insert: function (table, data, callback = null) {
        var db = idb.db;

        var isTableExists = false;
        for (var i = 0; i < idb.tables.length; i++) {
            if (idb.tables[i].name == table) {
                isTableExists = true;
                break;
            }
        }

        if (!isTableExists) {
            if (callback && typeof (callback) === "function") {
                callback(false, table + " Table not found.");
            }
        }
        else {
            var tx = db.transaction(table, "readwrite");
            var store = tx.objectStore(table);


            var dataLength = 1;
            if (data.constructor === Array) {
                dataLength = data.length;
                for (var i = 0; i < dataLength; i++) {
                    store.put(data[i]);
                }
            }
            else {
                store.put(data);
            }

            tx.oncomplete = function () {
                if (callback && typeof (callback) === "function") {
                    callback(true, "" + dataLength + " records inserted.");
                }
            };

        }
    },
    delete: function (table, key, callback) {
        var db = idb.db;

        var isTableExists = false;
        for (var i = 0; i < idb.tables.length; i++) {
            if (idb.tables[i].name == table) {
                isTableExists = true;
                break;
            }
        }

        if (!isTableExists) {
            if (callback && typeof (callback) === "function") {
                callback(false, table + " Table not found.");
            }
        }
        else {
            var tx = db.transaction(table, "readwrite");
            var store = tx.objectStore(table);

            var keyLength = -1;
            if (key && typeof (key) === "function") {
                store.clear();
            }
            else {
                if (key.constructor === Array) {
                    keyLength = key.length
                    for (var i = 0; i < keyLength; i++) {
                        store.delete(key[i]);
                    }
                }
                else {
                    keyLength = 1;
                    store.delete(key);
                }
            }


            tx.oncomplete = function (event) {
                //if all argument available
                if (callback && typeof (callback) === "function") {
                    callback(true, "" + keyLength == -1 ? "All" : keyLength + " records deleted.");
                }

                //if only two argument available
                if (key && typeof (key) === "function") {
                    key(true, "" + (keyLength == -1 ? "All" : keyLength) + " records deleted.");
                }
            };

            tx.onerror = function () {
                if (callback && typeof (callback) === "function") {
                    callback(false, tx.error);
                }
            };
        }
    },
    select: function (table, key, callback) {
        setTimeout(function(){ 
            var db = idb.db;
            var isTableExists = false;
            for (var i = 0; i < idb.tables.length; i++) {
                if (idb.tables[i].name == table) {
                    isTableExists = true;
                    break;
                }
            }

            if (!isTableExists) {
                if (callback && typeof (callback) === "function") {
                    callback(false, table + " Table not found.");
                }
            }
            else {
                var tx = db.transaction(table, "readonly");
                var store = tx.objectStore(table);
                var request;
                var keyLength = -1;
                var data;
                if (key && typeof (key) === "function") {
                    request = store.getAll();
                }
                else if (key.constructor === Array) {
                    keyLength = key.length
                    request = store.getAll();
                }
                else if (key && typeof key === 'object' && key.constructor === Object) {
                    keyLength = 1
                    var index = store.index(key.key);
                    request = index.getAll(key.value);
                }
                else {
                    keyLength = 1;
                    request = store.get(key);
                }


                tx.oncomplete = function (event) {
                    //if all argument available
                    var result = request.result;
                    var keypath = request.source.keyPath;
                    var filteredResult = [];

                    //if need to filter key array
                    if (keyLength > 1) {
                        for (var i = 0; i < result.length; i++) {
                            for (var j = 0; j < keyLength; j++) {
                                if (result[i][keypath] == key[j]) {
                                    filteredResult.push(result[i]);
                                    break;
                                }
                            }
                        }
                        result = filteredResult;
                    }


                    if (callback && typeof (callback) === "function") {
                        callback(true, result);

                    }

                    //if only two argument available
                    if (key && typeof (key) === "function") {
                        key(true, request.result);
                    }
                }

                tx.onerror = function () {
                    if (callback && typeof (callback) === "function") {
                        callback(false, request.error);
                    }
                };
            }


        }, 200);
        
    },
    check_alive:function (){
        var response;
        $.ajax({
            // url: 'http://api.smycode.com/public/ping',
            // url: 'https://smycode.com/api/public/ping',
            url: 'https://smycode.com/apioficial/public/ping',
            // url: 'https://smycode.com/apiprueba/public/ping',
            type: 'GET',
            async: false,
            headers: {
                'authorization':'A!&OW%AxAg',
                'Accept-Language':'es-MX,es-SV;q=0.9,es;q=0.8,en-US;q=0.7,en;q=0.6,es-419;q=0.5',
                'Content-Type':'application/json'
            },
            beforeSend:function(request){
            },
            success: function(data){
                //Hay conexion con el servidor  
                response = data.status;
            },
            error: function(data) {
                //No hay conexion con el servidor
                response = data.status;
                // idb.closeLoading();
            }
        });        
        return response;
    },
    inicial: function(){
        var result = idb.select('inicial', function (isSelected, responseData) {
            if (isSelected) {
                if(responseData.length != 0){
                    console.log('esta logeado');
                    $("#fieldInicial").val(responseData[0].inicial);
                    $("#fieldIncremento").val(responseData[0].incremento);
                    $("#fieldIncremento2").val(responseData[0].incremento2);
                } else{
                    console.log('no esta logeado');
                    $("#fieldInicial").val(3);
                    $("#fieldIncremento").val(3);
                    $("#fieldIncremento2").val(6);
                }
            } else {
                console.log("Error: no se pudo leer la tabla");
            }
        })
    },    
    insert_inicial: function(table, data){
        var result = idb.select(table, function (isSelected, responseData) {
            if (isSelected) {
                if(responseData.length != 0){
                    idb.insert(table, data);
                } else{
                    idb.insert(table, data);
                }
            } else {
                console.log("Error: " + responseText);
            }
        })
    },
    limpiar_data: function(table, key){
        // idb.delete(table, key);
        // idb.db.deleteObjectStore(resultDb.objectStoreNames[i]);
        idb.delete(table, key, function (isDeleted, responseText) {
            if (isDeleted) {
                console.log("se borro?");
            }
            else {
                console.log("Error: No se pudo limpiar");
            }
        });
    },
    loadAlert:function(positionClass,message,action, type='error'){        
        toastr.options = {
            closeButton: false,
            debug: false,
            newestOnTop: false,
            progressBar: true,
            positionClass: positionClass,
            preventDuplicates: false,
            onclick: null,
            showDuration: "350",
            hideDuration: "1000",
            timeOut: "6000",
            extendedTimeOut: "1000",
            showEasing: "swing",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut"
        };
        if (type=='error') {
            toastr.error(message, action);    
        } else if (type=='warning') {
            toastr.warning(message, action); 
        } else if (type=='info') {
            toastr.info(message, action); 
        } else if (type=='success') {
            toastr.success(message, action); 
        }              
    },
    closeLoading: function(){
        $('.loader-wrapper').hide();
    },
    peticion: function(exit){
        var result = idb.select("usuario", function (isSelected, responseData) {
            if (isSelected) {
                if(responseData.length != 0){
                    if(responseData[0].actualizado){
                        // console.log('Falta actualizar');
                        idb.actualizarDatos(exit);
                    } else{
                        // console.log('Actualizado');
                        // Esconder div de carga
                        ocultarLoad();
                        idb.loadAlert('toast-top-right', 'No hay cambios pendientes para sincronizar','Información','success');
                    }
                }
            }
            else {
                console.log("Error: " + responseText);
            }
        });
    },
    actualizarDatos: function(exit){        
        var result = idb.select("usuario", function (isSelected, responseData) {
            if (isSelected) {
                if(responseData.length != 0){
                    var json_actualizar = [];
                    json_actualizar[0] = responseData[0].ruta.detalle;
                    json_actualizar[1] = {'rutaId':responseData[0].ruta.rutas_idDb, 'estadoRuta': responseData[0].ruta.estado, 'idUser': responseData[0].usuario.id};

                    var resultToken = idb.select("tokens", function (isSelectedToken, responseDataToken) {
                        if (isSelected) {
                            if(responseDataToken.length != 0){
                                json_actualizar[2] = responseDataToken;
                                var dataUpdate = JSON.stringify({'data': json_actualizar})
                            } else{
                                json_actualizar[2] = {};
                                var dataUpdate = JSON.stringify({'data': json_actualizar})
                            }
                            // console.log(dataUpdate)
                            if(idb.check_alive()) {
                                $.ajax({
                                    // url: 'http://api.smycode.com/public/actualizarRegistros',
                                    // url: 'https://smycode.com/api/public/actualizarRegistros',
                                    // url: 'http://localhost/api/public/actualizarRegistros',
                                    url: 'https://smycode.com/apioficial/public/actualizarRegistros',                                    
                                    // url: 'https://smycode.com/apiprueba/public/actualizarRegistros',                                    
                                    type: 'POST',
                                    dataType: 'json',
                                    async: false,
                                    headers: {
                                        'authorization':'A!&OW%AxAg',
                                        'Accept-Language':'es-MX,es-SV;q=0.9,es;q=0.8,en-US;q=0.7,en;q=0.6,es-419;q=0.5',
                                        'Content-Type':'application/json'
                                    },
                                    data: dataUpdate,
                                    beforeSend:function(request){
                                    },
                                    success: function(data){                                       
                                        var result = idb.select("usuario", function (isSelected, responseData) {
                                            if (isSelected) {
                                                if(responseData.length != 0){
                                                
                                                    responseData[0].ruta.detalle.prestamo = data[0].ruta.detalle.prestamo;
                                                    responseData[0].ruta.detalle.gasto = data[0].ruta.detalle.gasto;

                                                    //Actualizacion de datos de configuracion de la ruta
                                                    responseData[0].ruta.estado = data[0].ruta.estado;
                                                    responseData[0].ruta.monto_ruta = data[0].ruta.monto_ruta;
                                                    responseData[0].ruta.cuota_ruta = data[0].ruta.cuota_ruta;
                                                    responseData[0].ruta.interes_ruta = data[0].ruta.interes_ruta;
                                                    responseData[0].ruta.limite_ventas = data[0].ruta.limite_ventas;
                                                    responseData[0].ruta.limite_cuotas = data[0].ruta.limite_cuotas;
                                                    responseData[0].ruta.flag_cuota = data[0].ruta.flag_cuota;
                                                    responseData[0].ruta.flag_interes = data[0].ruta.flag_interes;
                                                    responseData[0].actualizado = data[0].actualizado;                                                
                                                    // console.log(responseData[0])
                                                    idb.insert('usuario', responseData[0]);
                                                    // Esconder div de carga
                                                    ocultarLoad();                                                     
                                                    if (exit==0) {
                                                        idb.loadAlert('toast-top-right', 'Sincronización completa','Alerta','success');
                                                    }                                                  
                                                }
                                            }
                                            else {
                                                console.log("Error: " + responseText);
                                                // Esconder div de carga
                                                ocultarLoad();
                                            }
                                        });
                                        
                                        for (var i in data[1]) {
                                            var tableUri = i.split('mantenimiento_');
                                            var table = tableUri[tableUri.length-1];
                                            if(data[1][i] != null){
                                                idb.insert_manto(table, data[1][i]);
                                            }
                                        }
                                        if (exit==1) {
                                            window.location.href="login.html";
                                        }
                                    },
                                    error: function(data) {
                                        //No hay conexion con el servidor
                                        response = 0;
                                    }
                                });
                            }
                            else{   
                                idb.closeLoading();                             
                                idb.loadAlert('toast-top-right', 'No hay conexión con el servidor o no tiene internet','Upps!');
                            }
                        } 
                        else{
                            console.log("Error: " + responseText);
                        }
                    });
                }
            }
            else {
                console.log("Error: " + responseText);
            }
        });        
    },
};

var saldoRuta;
var defaultCuota;
var defaultInteres;
var flagCuota;
var flagInteres; 
var idEmpleado;
var limiteVenta;
var limiteCuotas;
var list_clientes = [];
var resultados = [];

var ruta = window.location.search.substring(1)
var pairtmp = ruta.split("&");
ruta2 = pairtmp[0];
var ruta = ruta2;
var url = ruta2;
// console.log(clientes); 
// console.log(url);

idb.init({
    database: "appTemp",
    version: 1,
    tables: [
        {
            name: "inicial",
            keyPath: "ID",
            autoIncrement: true
            // index: [{ name: "title", unique: false}]
        }
    ]
});