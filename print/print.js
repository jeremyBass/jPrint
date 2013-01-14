/*!
* @preserve jprint plugin addapter
* A jQuery plugin that makes it easier to print cross browser
* Tested in FF/IE/Chrome/Safari/Opera
* Copyright (c) 2012-* Jeremy Bass (jeremybass@cableone.net)
*
* Version 0.1
*
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/

function async_load_js(url){var headID = document.getElementsByTagName("head")[0];var s = document.createElement('script');s.type = 'text/javascript';s.async = true;s.src = url;var x = document.getElementsByTagName('script')[0];headID.appendChild(s);}
var pause = false;
if((typeof(jQuery) === 'undefined'||typeof($) === 'undefined')){
	async_load_js('https://images.wsu.edu/javascripts/jquery-1.8.3.min.js');
	pause = true;
}

function addPrintLink(option) {
	var retVal = false;
	if (option) {
		pause= pause?50:0;
		setTimeout(function(){
			jQuery(document).ready(function() {
				(function($) {
					
					async_load_js('http://images.wsu.edu/javascripts/jPrint.js');
					if(option==true)option={areas:"",settings:{}};
					if($('#toolbar').length && $("#printViewListItem").length==0){
						if($('#toolbar ul:first').length==0){
							$('#toolbar').append('<ul>');
						}
						$('#toolbar ul:first').append('<li id="printViewListItem"><a id="printViewLink" href="#" style="cursor: pointer;">Print</a></li>');
					}
					if($("#hide").length==0)$('body').append('<div id="hide" style="position:absolute;top:-9999em;left:-9999em;" ><div id="pArea"></div></div>');
					
					
					$('#printViewLink').click(function(e){
						if(option.areas=="")option.areas='#logo,#siteID,#main,#secondary,#additional,#localfooter,#wsufooter';
						e.preventDefault();
						e.stopPropagation();
						var html = "";
						$.each(option.areas.split(','),function(i,v){
								html+=$(v).html();
						});
						$("#pArea").html(html);
						
						if(typeof(jprint) === 'undefined')async_load_js('../jPrint.js');//note would be 'http://images.wsu.edu/javascripts/jPrint.js' live
						$("#pArea").jprint($.extend({
							pageStyles : false,
							mediaPrint:true,
							stylesheet : ('https:' == document.location.protocol ? 'https://' : 'http://') + 'images.wsu.edu/css/print2.css',
							useWindow : false,
							skip : ".noprint",
							iframe : true,
							append : null,
							prepend : null
						},option.settings));
					});
				})(jQuery);
			});
		},pause);
		retVal = true;
	}
	return retVal;
}
