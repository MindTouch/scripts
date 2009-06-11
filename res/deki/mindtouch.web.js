/*
 * MindTouch Deki - enterprise collaboration and integration platform
 * Copyright © 2006-2009 MindTouch, Inc.
 * www.mindtouch.com  oss@mindtouch.com
 *
 * For community documentation and downloads visit www.opengarden.org;
 * please review the licensing section.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 * http://www.gnu.org/copyleft/lesser.html
 */

//--- Define Console (if missing) ---
if(typeof console == 'undefined') {
	console = { log: function() {} };
}

//--- Define MindTouch Namespace ---
if(typeof MindTouch == 'undefined') {
	MindTouch = { };
}

//--- Define MindTouch.Web Namespace ---
if(typeof MindTouch.Web == 'undefined') {
	MindTouch.Web = {
		Version: { major: 0, minor: 1 }
	};
}

//--- Define REST Functions ---
if(typeof MindTouch.Web.Get == 'undefined') {
	MindTouch.Web.Get = function(uri, headers, callback /* fn(xhr) */) {

		// initiate AJAX request
		$.ajax({

			// set the request location
			url: uri,

			// set the request HTTP verb
			type: 'GET',
			cache: false,

			// add custom header which checks if the property was modified since we read it
			beforeSend: function(xhr) {
				if(headers) {
					for(var header in headers) {
						xhr.setRequestHeader(header, headers[header]);
					}
				}
				return true;
			},

			// set callback
			complete: callback
		});
	};
}

if(typeof MindTouch.Web.Post == 'undefined') {
	MindTouch.Web.Post = function(uri, value, mimetype, headers, callback /* fn(xhr) */) {

		// initiate AJAX request
		$.ajax({

			// set the request location
			url: uri,

			// set the request HTTP verb
			type: 'POST',

			// set the value of the updated property
			data: value,
			contentType: mimetype,
			processData: false,

			// add custom header which checks if the property was modified since we read it
			beforeSend: function(xhr) {
				if(headers) {
					for(var header in headers) {
						xhr.setRequestHeader(header, headers[header]);
					}
				}
				return true;
			},

			// set callback
			complete: callback
		});
	};
}

if(typeof MindTouch.Web.Put == 'undefined') {
	MindTouch.Web.Put = function(uri, value, mimetype, headers, callback /* fn(xhr) */) {
	
		// set http method override header, which allows us to tunnel the request
		headers = headers || { };
		headers['X-HTTP-Method-Override'] = 'PUT';

		// tunnel PUT through a POST request since most browsers don't support PUT
		this.Post(uri, value, mimetype, headers, callback);
	};
}

if(typeof MindTouch.Web.Delete == 'undefined') {
	MindTouch.Web.Delete = function(uri, headers, callback /* fn(xhr) */) {
	
		// set http method override header, which allows us to tunnel the request
		headers = headers || { };
		headers['X-HTTP-Method-Override'] = 'DELETE';

		// tunnel DELETE through a POST request since most browsers don't support DELETE
		this.Post(uri, null, null, headers, callback);
	};
}
