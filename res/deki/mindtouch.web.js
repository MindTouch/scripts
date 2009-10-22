/*
 * MindTouch Core - open source enterprise collaborative networking
 * Copyright (c) 2006-2009 MindTouch Inc.
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
					$.each(headers, function(header, header_value) {
						if((typeof header_value != 'object') && (typeof header_value != 'function')) {
							xhr.setRequestHeader(header, header_value);
						}
					});
				}
				return true;
			},

			// set callback
			complete: callback || function(xhr) { 
				if(!MindTouch.Web.IsSuccessful(xhr)) { 
					alert('AJAX ' + ((headers && headers['X-HTTP-Method-Override']) || 'GET') + ' request failed for ' + uri + ' (status: ' + xhr.status + ' - ' + MindTouch.Web.GetStatusText(xhr.status) + ')'); 
				} 
			}
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
					$.each(headers, function(header, header_value) {
						if((typeof header_value != 'object') && (typeof header_value != 'function')) {
							xhr.setRequestHeader(header, header_value);
						}
					});
				}
				return true;
			},

			// set callback
			complete: callback || function(xhr) { if(!MindTouch.Web.IsSuccessful(xhr)) { alert('AJAX ' + ((headers && headers['X-HTTP-Method-Override']) || 'POST') + ' request failed for ' + uri + ' (status: ' + xhr.status + ' - ' + MindTouch.Web.GetStatusText(xhr.status) + ')'); } }
		});
	};
}

if(typeof MindTouch.Web.Head == 'undefined') {
	MindTouch.Web.Head = function(uri, headers, callback /* fn(xhr) */) {
	
		// set http method override header, which allows us to tunnel the request
		headers = headers || { };
		headers['X-HTTP-Method-Override'] = 'HEAD';

		// tunnel HEAD through a GET request since most browsers don't support HEAD
		this.Get(uri, value, mimetype, headers, callback);
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

if(typeof MindTouch.Web.IsSuccessful == 'undefined') {
	MindTouch.Web.IsSuccessful = function(xhr) {
		return (xhr.status >= 200 && xhr.status < 300) || (xhr.status == 304 /* Not Modified */);
	};
}

if(typeof MindTouch.Web.GetETag == 'undefined') {
	MindTouch.Web.GetETag = function(xhr) {
	    var etag = xhr.getResponseHeader('ETag');
    	
	    // fix etag if content encoding was used
	    var encoding = xhr.getResponseHeader('Content-Encoding');
	    if(encoding && (encoding.length > 0)) {
	        etag = etag.replace('-' + encoding, '');
	    }
	    return etag;
	};
}

if(typeof MindTouch.Web.GetStatusText == 'undefined') {
	MindTouch.Web.GetStatusText = function(status) {
		switch(status) {
		case 100: return 'Continue';
		case 101: return 'Switching Protocols';
		case 200: return 'Ok';
		case 201: return 'Created';
		case 202: return 'Accepted';
		case 203: return 'Non-Authoritative Information';
		case 204: return 'No Content';
		case 205: return 'Reset Content';
		case 206: return 'Partial Content';
		case 207: return 'Multi-Status';
		case 300: return 'Multiple Choices';
		case 301: return 'Moved Permanently';
		case 302: return 'Found';
		case 303: return 'See Other';
		case 304: return 'Not Modified';
		case 305: return 'Use Proxy';
		case 306: return '(Reserved)';
		case 307: return 'Temporary Redirect';
		case 400: return 'Bad Request';
		case 401: return 'Unauthorized';
		case 402: return 'Payment Required';
		case 403: return 'Forbidden';
		case 404: return 'Not Found';
		case 405: return 'Method Not Allowed';
		case 406: return 'Not Acceptable';
		case 407: return 'Proxy Authentication';
		case 408: return 'Request Timeout';
		case 409: return 'Conflict';
		case 410: return 'Gone';
		case 411: return 'Length Required';
		case 412: return 'Precondition Failed';
		case 413: return 'Request Entity Too Large';
		case 414: return 'Request-URI Too Long';
		case 415: return 'Unsupported Media Type';
		case 416: return 'Requested Range Not Satisfiable';
		case 417: return 'Expectation Failed';
		case 422: return 'Unprocessable Entity';
		case 423: return 'Locked';
		case 424: return 'Failed Dependency';
		case 500: return 'Internal Server Error';
		case 501: return 'Not Implemented';
		case 502: return 'Bad Gateway';
		case 503: return 'Service Unavailable';
		case 504: return 'Gateway Timeout';
		case 505: return 'HTTP Version Not Supported';
		case 507: return 'Insufficient Storage';
		}
		return '(Unknown)';
	};
}
