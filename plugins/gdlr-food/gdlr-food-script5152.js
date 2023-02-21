(function($){
	"use strict";
	
	// bind menu item
	function gdlr_bind_menu_item(menu_holder, menu_item){
		if( menu_holder ){
			menu_holder.replaceWith(menu_item);
		}
		
		// hover effects
		menu_item.find('.gdlr-classic-menu .gdlr-menu-thumbnail, .gdlr-menu-modern').hover(function(){
			$(this).find('img').transition({ scale: 1.1, duration: 200 });
		}, function(){
			$(this).find('img').transition({ scale: 1, duration: 200 });
		});
		
		menu_item.slideDown();
		menu_item.find('img').load(function(){ $(window).trigger('resize'); });
	}
	
	// get menu using ajax
	function gdlr_menu_ajax(menu_holder, ajax_info, category, paged){

		var args = new Object();
		args['num-fetch'] = ajax_info.attr('data-num-fetch');
		args['order'] = ajax_info.attr('data-order');
		args['orderby'] = ajax_info.attr('data-orderby');
		args['thumbnail-size'] = ajax_info.attr('data-thumbnail-size');
		args['menu-style'] = ajax_info.attr('data-menu-style');
		args['menu-column'] = ajax_info.attr('data-menu-column');
		args['menu-layout'] = ajax_info.attr('data-menu-layout');
		args['menu-info'] = ajax_info.attr('data-menu-info');
		args['category'] = (category)? category: ajax_info.attr('data-category');
		args['paged'] = (paged)? paged: 1;

		// hide the un-used elements
		var animate_complete = false;
		menu_holder.slideUp(500, function(){
			animate_complete = true;
		});
		menu_holder.siblings('.gdlr-pagination').slideUp(500, function(){
			$(this).remove();
		});
		
		var now_loading = $('<div class="gdlr-now-loading"></div>');
		now_loading.insertBefore(menu_holder);
		now_loading.slideDown();
		
		// call ajax to get menu item
		$.ajax({
			type: 'POST',
			url: ajax_info.attr('data-ajax'),
			data: {'action': 'gdlr_get_menu_ajax', 'args': args},
			error: function(a, b, c){ console.log(a, b, c); },
			success: function(data){
				now_loading.css('background-image','none').slideUp(function(){ $(this).remove(); });	
			
				var menu_item = $(data).hide();
				if( animate_complete ){
					gdlr_bind_menu_item(menu_holder, menu_item);
				}else{
					setTimeout(function() {
						gdlr_bind_menu_item(menu_holder, menu_item);
					}, 500);
				}	
			}
		});		
		
	}
	
	$.fn.gdlr_init_menu_item = function(){
		$(this).find('.gdlr-list-menu .gdlr-menu-item-content').each(function(){
			var item_width = $(this).width();
			var title_width = $(this).children('.menu-title').width();
			var price_width = $(this).children('.menu-price').width();

			if( item_width - title_width - price_width - 30 > 0 ){
				$(this).children('.gdlr-list-menu-gimmick').css({
					width: item_width - title_width - price_width - 30,
					left: title_width + 15
				});
			}else{
				$(this).children('.gdlr-list-menu-gimmick').css('width', 0);
			}
		});
		
	}
	
	function gdlr_set_menu_filter_divider(){
		$('.menu-item-filter').each(function(){
			var item_width = $(this).width();
			var content_width = $(this).children('.menu-item-filter-inner').width();
			if( item_width - content_width - 40 > 0 ){
				$(this).children('.menu-item-filter-divider').width((item_width - content_width - 40) / 2);
			}else{
				$(this).children('.menu-item-filter-divider').width(0);
			}
		});
	}
	
	$(document).ready(function(){
		
		// init item style
		$('.menu-item-holder').gdlr_init_menu_item();
		$(window).resize(function(){ $('.menu-item-holder').gdlr_init_menu_item(); });
		
		gdlr_set_menu_filter_divider();
		$(window).resize(function(){ gdlr_set_menu_filter_divider(); });
		
		// script for calling ajax menu when selecting category
		$('.menu-item-filter a').click(function(){
			if($(this).hasClass('active')) return false;
			$(this).addClass('active').siblings().removeClass('active');
		
			var menu_holder = $(this).closest('.menu-item-filter').siblings('.menu-item-holder');
			var ajax_info = $(this).closest('.menu-item-filter').siblings('.gdlr-ajax-info');

			gdlr_menu_ajax(menu_holder, ajax_info, $(this).attr('data-category'));
			return false;
		});
		
		// hover effects
		$('.menu-item-wrapper .gdlr-classic-menu .gdlr-menu-thumbnail, .menu-item-wrapper .gdlr-menu-modern').hover(function(){
			$(this).find('img').transition({ scale: 1.1, duration: 200 });
		}, function(){
			$(this).find('img').transition({ scale: 1, duration: 200 });
		});
		
		// script for calling ajax menu when using pagination
		$('.menu-item-wrapper').on('click', '.gdlr-pagination.gdlr-ajax .page-numbers', function(){
			if($(this).hasClass('current')) return;
			var menu_holder = $(this).closest('.gdlr-pagination').siblings('.menu-item-holder');
			var ajax_info = $(this).closest('.gdlr-pagination').siblings('.gdlr-ajax-info');
			
			var category = $(this).closest('.gdlr-pagination').siblings('.menu-item-filter');
			if( category ){
				category = category.find('.active').attr('data-category');
			}

			gdlr_menu_ajax(menu_holder, ajax_info, category, $(this).attr('data-paged'));
			return false;			
		});
	});

})(jQuery);