jQuery(document).ready(function() {

	//DATATABLE
	jQuery('#basic-data-table').DataTable({
		language: {
			"decimal":        "",
			"emptyTable":     "No hay datos",
			"info":           "Mostrando _START_ a _END_ de _TOTAL_ registros",
			"infoEmpty":      "Mostrando 0 a 0 de 0 registros",
			"infoFiltered":   "(Filtro de _MAX_ total registros)",
			"infoPostFix":    "",
			"thousands":      ",",
			"lengthMenu":     "Mostrar _MENU_ registros",
			"loadingRecords": "Cargando...",
			"processing":     "Procesando...",
			"search":         "Buscar:",
			"zeroRecords":    "No se encontraron coincidencias",
			"paginate": {
			    "first":      "Primero",
			    "last":       "Último",
			    "next":       "Siguiente",
			    "previous":   "Anterior"
			},
			"aria": {
			    "sortAscending":  ": Activar orden de columna ascendente",
			    "sortDescending": ": Activar orden de columna desendente"
			}	
		},
		"dom": '<"row justify-content-between top-information"lf>rt<"row justify-content-between bottom-information"ip><"clear">'
	});

	//DATERANGE
	jQuery('input[name="field_date"]').daterangepicker({
		autoUpdateInput: true,
		singleDatePicker: true,		
		locale: {
			cancelLabel: 'Clear',
			format: 'DD/MM/YYYY',
			daysOfWeek: [
	            'Do',
	            'Lu',
	            'Ma',
	            'Mi',
	            'Ju',
	            'Vi',
	            'Sa'
	        ],
	        monthNames: [
	            'Enero',
	            'Febrero',
	            'Marzo',
	            'Abril',
	            'Mayo',
	            'Junio',
	            'Julio',
	            'Agosto',
	            'Septiembre',
	            'Octubre',
	            'Noviembre',
	            'Diciembre'
        	]
		}
	});	
    jQuery('input[name="field_date"]').on('apply.daterangepicker', function (ev, picker) {
      	jQuery(this).val(picker.startDate.format('DD/MM/YYYY'));		
    });
    jQuery('input[name="field_date"]').on('cancel.daterangepicker', function (ev, picker) {
      	jQuery(this).val('');
    });

});