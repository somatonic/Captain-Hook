
/**
 * ProcessWire2.+ Cheatsheet 1.1
 * @author Philipp 'Soma Urlich
 *
 */






// // update columnWidth on window resize
// $(window).smartresize(function(){
// 	resizeColumns();
// });

// if($.cookie("cols")){
// 	columns = $.cookie("cols");
// 	$('.cols a').removeClass('active');
// 	$('.cols a[data-cols='+columns+']').addClass('active');
// }

// var colWidth = $container.width() / columns;

// $('#isotope .section').css({ 'width': colWidth  - 12 });

// initialize isotope

	// $container.isotope({
	// // options...
	// 	itemSelector : '.section',
	// 	resizable: false, // disable normal resizing
	// 	// set columnWidth to a percentage of container width
	// 	masonry: { columnWidth: colWidth, gutterWidth: 12 }
	// });




$(function() {

	$('a#toggle-descr').click(function(e){
		e.preventDefault();
		$($(this).attr("href")).slideToggle(300);
	});

	$("body").live('click',function(e) {
		var node = $(e.target);

		if( node.closest('section').length == 0
			&& node.closest('.cols').length == 0
			&& node.closest('.mode').length == 0 ){
			$('input#filter').attr({'value':''});
			resetSheet();
		}
	});





	//$('#filter').liveUpdate('table');
	$('#filter').live('click *',function(e){
		//console.log($(this).val());
		if($(this).val().length < 1){
			resetSheet();
			$(this).keyup();
		}
	});


	$('#filter').liveUpdate('#list');


});


$(window).load(function(){



	// if( getParam('filter') ){
	// 	$('#filter').val(getParam('filter')).trigger('keyup');
	// 	// google analytics event tracking
	// 	_gaq.push(['_trackEvent', 'CheatSheet Search', 'GET filter', getParam('filter')]);
	// }


});


function resetSheet() {
	$('div').removeClass('hidden');
	$('div').show();

	$('h4,li').removeClass('notfiltered');
	$('h4,li').removeClass('filtered');

	// if(advanced){

	// 	$('div.advanced').show();
	// 	$('p.advanced').show();
	// 	$('a.advanced').show();

	// } else {

	// 	$('div.advanced').hide();
	// 	$('p.advanced').hide();
	// 	$('a.advanced').hide();

	// }
	// $container.isotope({ filter: '*' });
	// $container.isotope('reLayout');
};

function getParam(variable){
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++){
		var pair = vars[i].split("=");
		if(pair[0] == variable) return unescape(pair[1]);
	}
	return(false);
}



$.fn.liveUpdate = function(list) {

	list = $(list);

	if ( list.length ) {

	var rows = list.find('h4, li');

	var cache = rows.map(function() {
		return $(this).find('.text').text().toLowerCase().replace("\n","").replace("\t","");
	});

	//console.log(cache);

	resetSheet();

	this
		.keyup(filter).keyup()
		.parents('form').submit(function() {
			return false;
		});
	}

	return this;

	function filter() {

		var term = $.trim( $(this).val().toLowerCase() ), scores = [];

		if ( !term ) {
			resetSheet();

		} else {
			rows.addClass('notfiltered');
			$('div').removeClass('hidden');

			cache.each(function(i){
				var score = this.score(term);
				if (score > 0.4) { scores.push([score, i]); }
			});

			$.each( scores.sort( function(a, b){ return b[0] - a[0]; }), function() {
				$(rows[ this[1] ]).removeClass('notfiltered');
			});

			$('div:not(:has(h4:visible, li:visible))').addClass('hidden');

			$('div::has(h4:visible)').removeClass('hidden').find('li,h4').removeClass('notfiltered');
			$('div::has(li:visible)').removeClass('hidden').find('h4').removeClass('notfiltered');

			//$container.stop().isotope('reLayout');

		}
	}
};