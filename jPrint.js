/*!
* @preserve jprint plugin
* A jQuery plugin that makes it easier to print cross browser
* Tested in FF/IE/Chrome/Safari/Opera
* Copyright (c) 2012-* Jeremy Bass (jeremybass@cableone.net)
* NOTE - FOR HTML5 you must have the html5shiv w/ printshiv 
* directly or thru Modernizr or tag will not print in IE6-8
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
		//implement the settings
		var defaults = {
			pageStyles : true,
			mediaPrint:false,
			stylesheets : null,
			useWindow : false,
			skip : false,
			iframe : true,
			append : false,
			prepend : false
		};
		options = $.extend(defaults, options);
		
		//lets get under the right namespace
		if (options.useWindow && $this[0] === window) $this = $(document);
		
		//Set styles if any to find
		var styles = $("");
		if (options.pageStyles) styles = $("style, link");
		if (!options.mediaPrint) $("link[media=print]").remove();

		if (options.stylesheets) {
			var sheets = options.stylesheets.split(',');
			$.each(sheets,function(){
				styles = $.merge(styles, $('<link rel="stylesheet" href="'+ sheets + '">'));
			});
		}

		//Make the content to print
		var copy = $this.clone();
		
		copy = $("<span/>").append(copy);
		
		if(options.skip)copy.find(options.skip).remove();
		
		copy.find('head').length ? copy.find('head').append(styles.clone()) : copy.append(styles.clone());
		
		if(options.append)copy.append($(options.append).clone());
		
		if(options.prepend)copy.prepend($(options.prepend).clone());
		
		var content = copy.html();
		if(content.indexOf('<head>')<0 && content.indexOf('<body')<0)content = '<!DOCTYPE html><html lang="en" dir="ltr"><head></head><body>'+content+'</body></html>';
		copy.remove();
		
		
		//Lets put the copy to print
		function newWindow(content){
			w = window.open();
			w.document.write(content);
			w.document.close();
			w.print();
			w.close();
		}

		var w, wdoc;
		if (options.iframe) {
			// Use an iframe for printing
			try {
				var strFrameName = ("printer-" + (new Date()).getTime());
				$iframe = $( "<iframe name='" + strFrameName + "' src='/' style='width:0px;height:0px;position:absolute;eft:-9999em;top:-9999em' />" );
				$iframe.appendTo( $( "body:first" ) );

				w = window.frames[ strFrameName ];
				wdoc = w.document;
				wdoc.write(content);
				wdoc.close();
				$iframe.load(function(){ w.focus(); w.print(); });
				window.setTimeout(function() {w.close();}, 3000);
				if ($iframe.length) {
					setTimeout(function(){$iframe.remove();},(60 * 1000));
				}
			} catch (e) {
				// fail quite and pust a backup
				newWindow(content);
			}
		} else {
			newWindow(content);
		}
		return this;
	};

})(jQuery);
