/*!
* @preserve #jprint plugin
* A jQuery plugin that makes it easier to print cross browser
* Tested in FF/IE/Chrome/Safari/Opera
* Copyright (c) 2012-* Jeremy Bass (jeremybass@cableone.net)
*
* Version 0.1
*
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* Adds the following methods to jQuery:
* $.jprint
* $.fn.jprint
*
* USE LIKE 
* $("#pArea").html($('#directions_area').html()+'<img src="'+baseUrl+'" alt="map" width="700" height="504"/>');
*
*/

(function($) {	
	$.jprint = $.fn.jprint = function() {	
		// Print a given set of elements
		var isNode = function(o) {
			return (typeof Node === "object" ? o instanceof Node : o
					&& typeof o === "object" && typeof o.nodeType === "number"
					&& typeof o.nodeName === "string");
		}

		var options, $this;

		if (isNode(this)) {
			$this = $(this);
		} else {
			if (arguments.length > 0) {
				$this = $(arguments[0]);
				if (isNode($this[0])) {
					if (arguments.length > 1) {
						options = arguments[1];
					}
				} else {
					options = arguments[0];
					$this = $(this);
				}
			} else {
				$this = $(this);
			}
		}

		var defaults = {
			pageStyles : true,
			mediaPrint:false,
			stylesheet : null,
			useWindow : false,
			skip : ".noprint",
			iframe : true,
			preview : true,
			append : null,
			prepend : null,
			strip : null
		};
		options = $.extend(defaults, options);
		if (options.useWindow && $this[0] === window) {
			$this = $(document);
		}
		//Set styles if any to find
		var css = $("");
		if (options.pageStyles) css = $("style, link[type='text/css']");
		if (!options.mediaPrint) $("link[media=print]").remove();
		if (options.stylesheets) {
			var sheetscvs = options.stylesheets.split(',');
			$.each(sheetscvs,function(i,sheet){
				css = $.merge(css, $('<link rel="stylesheet" type="text/css" href="'+ sheet + '">'));
			});
		}
		var style = $("<div>").prepend(css.clone()).html();


		if(options.strip!=null)$this.html($this.html().replace(options.strip, "" ));
		var copy = $this.clone();
		
		copy = $("<span/>").append(copy);
		copy.find(options.skip).remove();
		//copy.prepend(styles.clone());
		
		copy.append($(options.append).clone());
		copy.prepend($(options.prepend).clone());
		var content = copy.html();
		copy.remove();
		
		function newWindow(content){
			w = window.open();
			w.document.write(content);
			w.document.close();
			w.print();
			w.close();
		}
		function printHtml(w,options,strFrameName){
			w.focus();
			w.print();
			window.setTimeout(function() {w.close();}, 3000);
			if ($("#"+strFrameName).length) {
				if(options.preview){
					$("#"+strFrameName).css({ width:"0px",height:"0px",position:"absolute","z-index":999,left:"-9999em",top:"-9999em"});
					$("html,body").css({overflow:"visiable"});
					$("#printingControl").remove();
				}
				setTimeout(function(){$("#"+strFrameName).remove();},(60 * 1000));
			}
		}
		
		var w, wdoc;
		if (options.iframe) {
			// Use an iframe for printing
			try {
				// Create a new iFrame if none is given
				var strFrameName = ("printer-" + (new Date()).getTime());
				// Create an iFrame with the new name.
				$iframe = $( "<iframe name='" + strFrameName + "' id='" + strFrameName + "' src='/' border='0'>" );
				$iframe.css({ width:"0px",height:"0px",position:"absolute","z-index":999,left:"-9999em",top:"-9999em",border:"none"}).appendTo( $( "body:first" ) );

				w = window.frames[ strFrameName ];
				wdoc = w.document;
				if(content.indexOf('<body')<0){
					content = '<!DOCTYPE html><html lang="en" dir="ltr"><head>'+style+'</head><body>'+content+'</body></html>';
				}else{
					$(content).find("head").append(style);
				}
				wdoc.write(content);
				wdoc.close();
				var $iframe = $("#"+strFrameName).contents();
				if(options.preview){
					$("body").prepend('<div id="printingControl" style="background-color: gray; padding-top: 3px; padding-bottom: 3px; padding-left: 5px;height:24px;"><button id="printButton" style="margin-left: 20px;">Print</button><button id="cancelButton" style="margin-left: 20px;">Cancel</button></div>');
					
					$("#"+strFrameName).css({ width:"100%",height:$(window).height()-30,position:"fixed","z-index":9999,left:"0px",top:"30px","background-color":"#fff"});
					$("html,body").css({overflow:"hidden"});

					$("#printButton").click(function(){
						printHtml(w,options,strFrameName);	
					});
					$("#cancelButton").click(function(){
					   $("#"+strFrameName).remove();
					   $("#printingControl").remove();
					   $("html,body").css({overflow:"visiable"});
					   return false;
					});
				}else{
					printHtml(w,options,strFrameName);	
				}
			} catch (e) {
				alert(e.message);
				newWindow(content);
			}
		} else {
			newWindow(content);
		}
		return this;
	};

})(jQuery);
