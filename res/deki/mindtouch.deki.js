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

//--- Define MindTouch Namespace ---
if(typeof MindTouch == 'undefined') {
	MindTouch = { };
}

//--- Define Deki.Api Namespace ---
if(typeof MindTouch.Deki == 'undefined') {
	MindTouch.Deki = {

		//--- API Version Number ---
		Version: { major: 0, minor: 1 },

		//--- Page Functions ---
		ReadPageContents: function(page_api, params, success, error) {
		
			// build request uri
			page_api = page_api || Deki.Env.PageApi;
			page_api += '/contents';
			if(params) {
				page_api += '?' + $.param(params);
			}
		
			// make GET request to fetch page contents
			var _this = this;
			MindTouch.Web.Get(page_api, null, function(xhr) {
				if(MindTouch.Web.IsSuccessful(xhr)) {
				
					// check if response has XML or text format
					var mimetype = xhr.getResponseHeader('Content-Type');
					if(mimetype && (mimetype.indexOf('xml') >= 0)) {
						_this.CallOrPublish(success, { xml: xhr.responseXML, xhr: xhr });
					} else {
						_this.CallOrPublish(success, { text: xhr.responseText, xhr: xhr });
					}
				} else if(error) {
					_this.CallOrPublish(error, { status: xhr.status, text: MindTouch.Web.GetStatusText(xhr.status), xhr: xhr });
				} else {
					alert('An error occurred trying to read the page at ' + page_api + ' (status: ' + xhr.status + ' - ' + MindTouch.Web.GetStatusText(xhr.status) + ')');
				}
			});
		},

		UpdatePageContents: function(page_api, contents, edittime, success, error) {
		
			// build request uri
			page_api = page_api || Deki.Env.PageApi;			
			page_api += '/contents?edittime=' + (edittime || this.EditTimeNow());
		
			// make GET request to fetch page contents
			var _this = this;
			MindTouch.Web.Post(page_api, contents, 'text/plain; charset=utf-8', null, function(xhr) {
				if(MindTouch.Web.IsSuccessful(xhr)) {
					_this.CallOrPublish(success, { xhr: xhr });
				} else if(error) {
					_this.CallOrPublish(error, { status: xhr.status, text: MindTouch.Web.GetStatusText(xhr.status), xhr: xhr });
				} else {
					alert('An error occurred trying to update the page at ' + page_api + ' (status: ' + xhr.status + ' - ' + MindTouch.Web.GetStatusText(xhr.status) + ')');
				}
			});
		},
		
		Reload: function(dom, params, callback) {
		
			// resolve the dom argument to the appropriate jQuery selection
			if(typeof dom == 'string') dom = $(dom);
			else if(typeof dom.eq != 'function') dom = $(dom);
			
			// set the page_api to the current page
			var page_api = Deki.Env.PageApi + '/contents?format=xhtml&include=true';
			
			// add dummy parameter to avoid caching issues in some browsers (e.g. IE)
			params = params || { };
			params.nocache = new Date().getTime();
			page_api += '&' + $.param(params);
			
			// issue AJAX call to reload part of the page
			var _this = this;
			dom.load(page_api + ' #' + dom.get(0).id + ' > *', null, function() { _this.CallOrPublish(callback, {}); });
		},
	
		CreatePageProperty: function(page_api, name, value, success /* fn({ etag, xhr }) */, error /* fn({ status, text, xhr }) */ ) {
			page_api = page_api || Deki.Env.PageApi;			
			this.CreateProperty(page_api + '/properties', name, value, success, error);
		},

		ReadPageProperty: function(page_api, name, success /* fn({ value, href, etag, xhr }) */, error /* fn({ status, text, xhr }) */) {
			page_api = page_api || Deki.Env.PageApi;
			this.ReadProperty(page_api + '/properties', name, success, error);
		},

		UpdatePageProperty: function(property_api, value, etag, success /* fn({ xhr }) */, error /* fn({ status, text, xhr }) */ ) {			
		
			// NOTE (steveb): use UpdateProperty(); this function is defined only for backwards compatibility
			
			this.UpdateProperty(property_api, value, etag, success, error);
		},
		
		DeletePageProperty: function(property_api, success, error) {
		
			// NOTE (steveb): use DeleteProperty(); this function is defined only for backwards compatibility
			
			this.DeleteProperty(property_api, success, error);
		},

		//--- Property Functions ----
		CreateProperty: function(properties_api, name, value, success /* fn({ etag, xhr }) */, error /* fn({ status, text, xhr }) */ ) {
		
			// validate arguments
			if((typeof name != 'string') || (name == '')) {
				alert('ERROR in CreateProperty(): property name must a non-empty string.');
				return;
			}
			
			// make POST request to create property
			var _this = this;
			MindTouch.Web.Post(properties_api, value, 'text/plain; charset=utf-8', { Slug: name }, function(xhr) {
				if(MindTouch.Web.IsSuccessful(xhr)) {
					_this.CallOrPublish(success, { etag: MindTouch.Web.GetETag(xhr), xhr: xhr });
				} else if(error) {
					_this.CallOrPublish(error, { status: xhr.status, text: MindTouch.Web.GetStatusText(xhr.status), xhr: xhr });
				} else {
					alert('An error occurred trying to create the property \'' + name + '\' (status: ' + xhr.status + ' - ' + MindTouch.Web.GetStatusText(xhr.status) + ')');
				}
			});
		},

		ReadProperty: function(properties_api, name, success /* fn({ value, href, etag, xhr }) */, error /* fn({ status, text, xhr }) */) {
		
			// validate arguments
			if((typeof name != 'string') || (name == '')) {
				alert('ERROR in CreateProperty(): property name must a non-empty string.');
				return;
			}
			
			// make GET request to query properties
			var _this = this;
			MindTouch.Web.Get(properties_api + '?dream.out.format=json&names=' + Deki.url.encode(MindTouch.Text.Utf8Encode(name)), null, function(xhr) {
			
				// check response status code
				if(MindTouch.Web.IsSuccessful(xhr)) {
				
					// evaluate response JSON data
					var data = eval('(' + xhr.responseText + ')');
					
					// read property location
					var href = data.property && data.property.contents['@href']
					
					// check if the property was found
					if(href) {
					
						// read result
						var value = data.property.contents['#text'] || '';
						
						// check if property must be loaded separately because it's too large to fit into the results list
						var length = data.property.contents['@size'];
						if((value.length == 0) && (!length || parseInt(length) > 0)) {
						
							// make GET request on property href
							MindTouch.Web.Get(href, null, function(xhr) {
			
								// check response status code
								if(MindTouch.Web.IsSuccessful(xhr)) {
								
									// read result
									var value = xhr.responseText;
									var etag = MindTouch.Web.GetETag(xhr);
									_this.CallOrPublish(success, { value: value, href: href, etag: etag, xhr: xhr });
								} else if(error) {
									_this.CallOrPublish(error, { status: xhr.status, text: MindTouch.Web.GetStatusText(xhr.status), xhr: xhr });
								} else {
									alert('An error occurred trying to read large property \'' + name + '\' (status: ' + xhr.status + ' - ' + MindTouch.Web.GetStatusText(xhr.status) + ')');
								}
							});
						} else {
							var etag = data.property['@etag'];
							_this.CallOrPublish(success, { value: value, href: href, etag: etag, xhr: xhr });
						}
					} else {
						_this.CallOrPublish(success, { value: null, href: null, etag: null, xhr: xhr });
					}
				} else if(error) {
					_this.CallOrPublish(error, { status: xhr.status, text: MindTouch.Web.GetStatusText(xhr.status), xhr: xhr });
				} else {
					alert('An error occurred trying to read property \'' + name + '\' (status: ' + xhr.status + ' - ' + MindTouch.Web.GetStatusText(xhr.status) + ')');
				}
			});
		},

		UpdateProperty: function(property_api, value, etag, success /* fn({ xhr }) */, error /* fn({ status, text, xhr }) */ ) {
			var _this = this;		
			MindTouch.Web.Put(property_api, value, 'text/plain; charset=utf-8', { ETag: etag }, function(xhr) {
				if(MindTouch.Web.IsSuccessful(xhr)) {
					_this.CallOrPublish(success, { xhr: xhr })
				} else if(error) {
					_this.CallOrPublish(error, { status: xhr.status, text: MindTouch.Web.GetStatusText(xhr.status), xhr: xhr });
				} else {
					alert('An error occurred trying to update the property at ' + property_api + ' (status: ' + xhr.status + ' - ' + MindTouch.Web.GetStatusText(xhr.status) + ')');
				}
			});
		},
		
		DeleteProperty: function(property_api, success, error) {
			var _this = this;
			MindTouch.Web.Delete(property_api, null, function(xhr) {

				// check the response status code
				if(MindTouch.Web.IsSuccessful(xhr)) {
					_this.CallOrPublish(success, { xhr: xhr })
				} else if(error) {
					_this.CallOrPublish(error, { status: xhr.status, text: MindTouch.Web.GetStatusText(xhr.status), xhr: xhr });
				} else {
					alert('An error occurred trying to delete the property at ' + property_api + ' (status: ' + xhr.status + ' - ' + MindTouch.Web.GetStatusText(xhr.status) + ')');
				}
			});
		},

		//--- Utility Functions ---
		CallOrPublish: function(fn, arg) {
			if(typeof fn == 'function') {
				fn.call(null, arg);
			} else if(typeof fn == 'string') {
				Deki.publish(fn, arg);
			}
		},

		EditTimeNow: function() {
			var d = new Date();
			var month = d.getUTCMonth() + 1;
			if(month < 10) month = '0' + month;
			var day = d.getUTCDate();
			if(day < 10) day = '0' + day;
			var hours = d.getUTCHours();
			if(hours < 10) hours = '0' + hours;
			var mins = d.getUTCMinutes();
			if(mins < 10) mins = '0' + mins;
			var secs = d.getUTCSeconds();
			if(secs < 10) secs = '0' + secs;
			return d.getUTCFullYear() + month + day + hours + mins + secs;
		},

		//--- WORK IN PROGRESS (DO NOT USE!!!) ---
		CreatePageFromTemplate: function(path, template, success, error) {
			// fetch template
			// lookup body[not(target)]
			// use as content on UpdatePage
		},

		PostMessage: function(page_api, subchannel, data, success) {
			page_api = page_api || Deki.Env.PageApi;
			$.ajax({
				type: 'POST',
				url: Deki.Env.PageApi + '/message/' + subchannel,
				data: data,
				contentType: 'text/plain; charset=utf-8',
				success: success
			});
		},

		Poll: function(interval, containerId, uri) {
			var _this = this;
			$.get(uri, { containerId: containerId }, function(data) {
				this._callback(interval, containerId, uri, data);
			});
		},

		_callback: function (interval, id, uri, data) {
			var _this = this;
			if(data) {
				$('#' + id).empty().append((new XMLSerializer()).serializeToString(data));
			}
			setTimeout(function() {
				_this.Poll(interval, id, uri);
			}, interval);
		}
	};
}

//--- Define Deki.Api Namespace (for backwards compatibility only) ---
if(typeof Deki.Api == 'undefined') {
	Deki.Api = MindTouch.Deki;
}