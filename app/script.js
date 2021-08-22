(function (){
	navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
    });

 	//REGISTRAR SERVICE WORKER
	if ('serviceWorker' in navigator) {
		// navigator.serviceWorker.register('./sw.js',{useCache:true})
		navigator.serviceWorker.register('./sw.js')
		.then(registration => { 
			console.log("Registro de su SW exitoso", registration);
		    
		    // if(registration.active) {
		    //   // Check if an updated sw.js was found
		    //   registration.addEventListener('updatefound', () => {
		    //     const installingWorker = registration.installing;
		        
		    //     // installingWorker.addEventListener('statechange', () => {
			   //     //  if(installingWorker.state === 'installed') {
			   //     //  	// console.log('Install complete. Triggering update');
			   //     //  	location.reload();
			   //     //  }		        
		    //     // });
		    //   });
		    // }
		})
	  	.catch(err => console.warn('Error al tratar de registrar el sw', err))	  			
	} 
})();