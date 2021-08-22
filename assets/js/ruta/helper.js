    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ::::::::::::::::::::::::::::: Alertas ::::::::::::::::::::::::::
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/  

    function callToaster(positionClass,message,action,type='success') {
        if (document.getElementById("message")) {
            toastr.options = {
                closeButton: true,
                debug: false,
                newestOnTop: false,
                progressBar: true,
                positionClass: positionClass,
                preventDuplicates: false,
                onclick: null,
                showDuration: "500",
                hideDuration: "1000",
                timeOut: "5000",
                extendedTimeOut: "1000",
                showEasing: "swing",
                hideEasing: "linear",
                showMethod: "fadeIn",
                hideMethod: "fadeOut"
            };
            // toastr.success(message, action);
            if (type=='error') {
                toastr.error(message, action);    
            } else if (type=='warning') {
                toastr.warning(message, action); 
            } else if (type=='info') {
                toastr.info(message, action); 
            } else if (type=='success') {
                toastr.success(message, action); 
            }
        }
    }