//<script>
/**
 *  Open Source Social Network
 *
 * @package   (softlab24.com).ossn
 * @author    OSSN Core Team <info@softlab24.com>
 * @copyright (C) SOFTLAB24 LIMITED
 * @license   Open Source Social Network License (OSSN LICENSE)  http://www.opensource-socialnetwork.org/licence
 * @link      https://www.opensource-socialnetwork.org/
 */
var Ossn = Ossn || {};
Ossn.Startups = new Array();
Ossn.hooks = new Array();
Ossn.events = new Array();
/**
 * Register a startup function
 *
 * @return void
 */
Ossn.RegisterStartupFunction = function($func) {
	Ossn.Startups.push($func);
};
/**
 * Click on element
 *
 * @param $elem = element;
 *
 * @return void
 */
Ossn.Clk = function($elem) {
	$($elem).click();
};
/**
 * Ossn.str_replace
 * 
 * Replace all occurrences of the search string with the replacement string
 * See https://www.php.net/manual/en/function.str-replace.php
 *
 * @author original by https://locutus.io/php/str_replace/
 * 
 * @param string  search   The value being searched for, otherwise known as the needle. An array may be used to designate multiple needles.
 * @param string  replace  The replacement value that replaces found search values. An array may be used to designate multiple replacements.
 * @param string  subject  The string or array being searched and replaced on, otherwise known as the haystack.
 * @param integer countObj If passed, this will be set to the number of replacements performed.
 *
 * @return boolean
 */
Ossn.str_replace = function(search, replace, subject, countObj){
	var i = 0
	var j = 0
	var temp = ''
	var repl = ''
	var sl = 0
	var fl = 0
	var f = [].concat(search)
	var r = [].concat(replace)
	var s = subject
	var ra = Object.prototype.toString.call(r) === '[object Array]'
	var sa = Object.prototype.toString.call(s) === '[object Array]'
	s = [].concat(s)

	var $global = (typeof window !== 'undefined' ? window : global)
	$global.$locutus = $global.$locutus || {}
	var $locutus = $global.$locutus
	$locutus.php = $locutus.php || {}

	if (typeof(search) === 'object' && typeof(replace) === 'string') {
		temp = replace
		replace = []
		for (i = 0; i < search.length; i += 1) {
			replace[i] = temp
		}
		temp = ''
		r = [].concat(replace)
		ra = Object.prototype.toString.call(r) === '[object Array]'
	}

	if (typeof countObj !== 'undefined') {
		countObj.value = 0
	}

	for (i = 0, sl = s.length; i < sl; i++) {
		if (s[i] === '') {
			continue
		}
		for (j = 0, fl = f.length; j < fl; j++) {
			temp = s[i] + ''
			repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0]
			s[i] = (temp).split(f[j]).join(repl)
			if (typeof countObj !== 'undefined') {
				countObj.value += ((temp.split(f[j])).length - 1)
			}
		}
	}
	return sa ? s : s[0];
};
/**
 * Redirect user to other page
 *
 * @param $url path
 *
 * @return void
 */
Ossn.redirect = function($url) {
	window.location = Ossn.site_url + $url;
};
/**
 * Get url paramter
 *
 * @param name Parameter name;
 * @param url complete url
 *
 * @return string
 */
Ossn.UrlParams = function(name, url) {
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);
	if (!results) {
		return 0;
	}
	return results[1] || 0;
};
/**
 * Returns an object with key/values of the parsed query string.
 *
 * @param  {String} string The string to parse
 * @return {Object} The parsed object string
 */
Ossn.ParseStr = function(string) {
	var params = {},
		result,
		key,
		value,
		re = /([^&=]+)=?([^&]*)/g,
		re2 = /\[\]$/;

	while (result = re.exec(string)) {
		key = decodeURIComponent(result[1].replace(/\+/g, ' '));
		value = decodeURIComponent(result[2].replace(/\+/g, ' '));

		if (re2.test(key)) {
			key = key.replace(re2, '');
			if (!params[key]) {
				params[key] = [];
			}
			params[key].push(value);
		} else {
			params[key] = value;
		}
	}

	return params;
};
/**
 * Parse a URL into its parts. Mimicks http://php.net/parse_url
 *
 * @param {String} url       The URL to parse
 * @param {Int}    component A component to return
 * @param {Bool}   expand    Expand the query into an object? Else it's a string.
 *
 * @return {Object} The parsed URL
 */
Ossn.ParseUrl = function(url, component, expand) {
	// Adapted from http://blog.stevenlevithan.com/archives/parseuri
	// which was release under the MIT
	// It was modified to fix mailto: and javascript: support.
	expand = expand || false;
	component = component || false;

	var re_str =
		// scheme (and user@ testing)
		'^(?:(?![^:@]+:[^:@/]*@)([^:/?#.]+):)?(?://)?'

		// possibly a user[:password]@
		+ '((?:(([^:@]*)(?::([^:@]*))?)?@)?'
		// host and port
		+ '([^:/?#]*)(?::(\\d*))?)'
		// path
		+ '(((/(?:[^?#](?![^?#/]*\\.[^?#/.]+(?:[?#]|$)))*/?)?([^?#/]*))'
		// query string
		+ '(?:\\?([^#]*))?'
		// fragment
		+ '(?:#(.*))?)',
		keys = {
			1: "scheme",
			4: "user",
			5: "pass",
			6: "host",
			7: "port",
			9: "path",
			12: "query",
			13: "fragment"
		},
		results = {};

	if (url.indexOf('mailto:') === 0) {
		results['scheme'] = 'mailto';
		results['path'] = url.replace('mailto:', '');
		return results;
	}

	if (url.indexOf('javascript:') === 0) {
		results['scheme'] = 'javascript';
		results['path'] = url.replace('javascript:', '');
		return results;
	}

	var re = new RegExp(re_str);
	var matches = re.exec(url);

	for (var i in keys) {
		if (matches[i]) {
			results[keys[i]] = matches[i];
		}
	}

	if (expand && typeof(results['query']) != 'undefined') {
		results['query'] = ParseStr(results['query']);
	}

	if (component) {
		if (typeof(results[component]) != 'undefined') {
			return results[component];
		} else {
			return false;
		}
	}
	return results;
};
/**
 * Ossn.isset
 * 
 * Checks if the variable isset or not
 * 
 * @param int|bool|func|object $variable Any variable
 * 
 * @return boolean
 */
Ossn.isset = function($variable){
	if(typeof $variable !== 'undefined'){
		return true;
	}
	return false;
};
/**
 * Ossn.call_user_func_array
 * 
 * Checks if the variable isset or not
 * See https://www.php.net/manual/en/function.call-user-func-array.php
 *
 * @author original by Thiago Mata (https://thiagomata.blog.com)
 * @author original by revised by: Jon Hohle
 * @author original byimproved by: Brett Zamir (https://brett-zamir.me)
 * @author original byimproved by: Diplom@t (https://difane.com/)
 * @author original byimproved by: Brett Zamir (https://brett-zamir.me)
 * 
 * @param string 	cb		A callback function
 * @param array|object  parameters	A option values
 * 
 * @return mixed
 */
Ossn.call_user_func_array = function(cb, parameters){
	var $global = (typeof window !== 'undefined' ? window : global)
	var func
	var scope = null

	var validJSFunctionNamePattern = /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/;

	if(typeof cb === 'string'){
		if(typeof $global[cb] === 'function'){
			func = $global[cb]
		} else if(cb.match(validJSFunctionNamePattern)){
			func = (new Function(null, 'return ' + cb)()) // eslint-disable-line no-new-func
		}
	} else if(Object.prototype.toString.call(cb) === '[object Array]'){
		if(typeof cb[0] === 'string'){
			if(cb[0].match(validJSFunctionNamePattern)){
				func = eval(cb[0] + "['" + cb[1] + "']") // eslint-disable-line no-eval
			}
		} else {
			func = cb[0][cb[1]]
		}

		if(typeof cb[0] === 'string'){
			if(typeof $global[cb[0]] === 'function'){
				scope = $global[cb[0]]
			} else if(cb[0].match(validJSFunctionNamePattern)){
				scope = eval(cb[0]) // eslint-disable-line no-eval
			}
		} else if(typeof cb[0] === 'object'){
			scope = cb[0]
		}
	} else if(typeof cb === 'function'){
		func = cb
	}

	if(typeof func !== 'function'){
		throw new Error(func + ' is not a valid function')
	}

	return func.apply(scope, parameters)
};
/**
 * Ossn.is_callable
 * 
 * Checks if the variable isset or not
 * See https://www.php.net/manual/en/function.is-callable.php
 *
 * @author original by Thiago Mata (https://thiagomata.blog.com)
 * @author original by revised by: Jon Hohle
 * @author original byimproved by: Brett Zamir (https://brett-zamir.me)
 * @author original byimproved by: Diplom@t (https://difane.com/)
 * @author original byimproved by: Brett Zamir (https://brett-zamir.me)
 * 
 * @param variable|function 	mixedVar 	A function or callback name
 * @param boolean             	syntaxOnly 	If set to TRUE the function only verifies that var might be a function or method. It will only reject simple variables that are not strings, or an array that does not have a valid structure to be used as a callback. The valid ones are supposed to have only 2 entries, the first of which is an object or a string, and the second a string.
 *
 * @return boolean
 */
Ossn.is_callable = function(mixedVar, syntaxOnly, callableName){
	var $global = (typeof window !== 'undefined' ? window : global)

	var validJSFunctionNamePattern = /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/;

	var name = ''
	var obj = {}
	var method = ''
	var validFunctionName = false

	var getFuncName = function(fn){
		var name = (/\W*function\s+([\w$]+)\s*\(/).exec(fn)
		if(!name){
			return '(Anonymous)'
		}
		return name[1]
	}

	// eslint-disable-next-line no-useless-escape
	if(/(^class|\(this\,)/.test(mixedVar.toString())){
		return false
	}

	if(typeof mixedVar === 'string'){
		obj = $global
		method = mixedVar
		name = mixedVar
		validFunctionName = !!name.match(validJSFunctionNamePattern)
	} else if(typeof mixedVar === 'function'){
		return true
	} else if(Object.prototype.toString.call(mixedVar) === '[object Array]' &&
		mixedVar.length === 2 &&
		typeof mixedVar[0] === 'object' &&
		typeof mixedVar[1] === 'string'){
		obj = mixedVar[0]
		method = mixedVar[1]
		name = (obj.constructor && getFuncName(obj.constructor)) + '::' + method
	}

	if(syntaxOnly || typeof obj[method] === 'function'){
		if(callableName){
			$global[callableName] = name
		}
		return true
	}

	if(validFunctionName && typeof eval(method) === 'function'){ // eslint-disable-line no-eval
		if(callableName){
			$global[callableName] = name
		}
		return true
	}

	return false
}
/**
 * Check if hook exists or not
 *
 * @param string $hook 	The name of the hook
 * @param string $type 	The type of the hook
 *
 * @return boolean
 */
Ossn.is_hook = function($hook, $type){
	if(Ossn.isset(Ossn.hooks[$hook][$type])){
		return true;
	}
	return false;
}
/**
 * Unset a hook to system, hooks are usefull for callback returns
 *
 * @param string	$hook		The name of the hook
 * @param string	$type		The type of the hook
 * @param callable	$callback	The name of a valid function or an array with object and method
 *
 * @return boolean
 */
Ossn.unset_hook = function($hook, $type, $callback){
	if($hook == '' || $type == '' || $callback == ''){
		return false;
	}
	if(Ossn.is_hook($hook, $type)){
		for (i = 0; i <= Ossn.hooks[$hook][$type].length; i++){
			if(Ossn.isset(Ossn.hooks[$hook][$type][i])){
				if(Ossn.isset(Ossn.hooks[$hook][$type][i].hook)){
					if(Ossn.hooks[$hook][$type][i].hook == $callback){
						Ossn.hooks[$hook][$type].splice(i, 1);
						break;
					}
				}
			}
		}
	}
};
/**
 * Add a hook to system, hooks are usefull for callback returns
 *
 * @param string	$hook		The name of the hook
 * @param string	$type		The type of the hook
 * @param callable 	$callback	The name of a valid function or an array with object and method
 * @param int		$priority	The priority - 200 is default, lower numbers called first
 *
 * @return boolean
 */
Ossn.add_hook = function($hook, $type, $callback, $priority = 200){
	if($hook == '' || $type == ''){
		return false;
	}
	if(!Ossn.isset(Ossn.hooks)){
		Ossn.hooks = new Array();
	}
	if(!Ossn.isset(Ossn.hooks[$hook])){
		Ossn.hooks[$hook] = new Array();
	}
	if(!Ossn.isset(Ossn.hooks[$hook][$type])){
		Ossn.hooks[$hook][$type] = new Array();
	}
	if(!Ossn.is_callable($callback, true)){
		return false;
	}

	$priority = Math.max(parseInt($priority), 0);
	Ossn.hooks[$hook][$type].push({
		'hook': $callback,
		'priority': $priority,
	});
	return true;
};
/**
 * Call a hook
 *
 * @param string	$hook		The name of the hook
 * @param string	$type		The type of the hook
 * @param array|object  $params		Additional parameters to pass to the handlers
 * @param mixed		$returnvalue 	An initial return value
 *
 * @return mixed
 */
Ossn.call_hook = function($hook, $type, $params = null, $returnvalue = null){
	$hooks = new Array();
	hookspush = Array.prototype.push

	if(Ossn.isset(Ossn.hooks[$hook]) && Ossn.isset(Ossn.hooks[$hook][$type])){
		hookspush.apply($hooks, Ossn.hooks[$hook][$type]);
	}
	$hooks.sort(function(a, b){
		if(a.priority < b.priority){
			return -1;
		}
		if(a.priority > b.priority){
			return 1;
		}
		return (a.index < b.index) ? -1 : 1;
	});
	$.each($hooks, function(index, $item){
		$value = Ossn.call_user_func_array($item.hook, [$hook, $type, $returnvalue, $params]);
		if(Ossn.isset($value)){
			$returnvalue = $value;
		}
	});
	return $returnvalue;
};
/**
 * Check if callback exists or not
 *
 * @param string $callback 	The name of the callback
 * @param string $type 	The type of the callback
 *
 * @return boolean
 */
Ossn.is_callback = function($event, $type){
	if(Ossn.isset(Ossn.events[$event][$type])){
		return true;
	}
	return false;
}
/**
 * Add a callback to system, callbacks are usefull for do something when some event occurs
 *
 * @param string	$event		The name of the callback
 * @param string	$type		The type of the callback
 * @param callable 	$callback	The name of a valid function
 * @param int		$priority	The priority - 200 is default, lower numbers called first
 *
 * @return boolean
 */
Ossn.register_callback = function($event, $type, $callback, $priority = 200){
	if($event == '' || $type == ''){
		return false;
	}
	if(!Ossn.isset(Ossn.events)){
		Ossn.events = new Array();
	}
	if(!Ossn.isset(Ossn.events[$event])){
		Ossn.events[$event] = new Array();
	}
	if(!Ossn.isset(Ossn.events[$event][$type])){
		Ossn.events[$event][$type] = new Array();
	}
	if(!Ossn.is_callable($callback, true)){
		return false;
	}
	$priority = Math.max(parseInt($priority), 0);
	Ossn.events[$event][$type].push({
		'callback': $callback,
		'priority': $priority,
	});
	return true;
};
/**
 * Unset a event callback to system
 *
 * @param string 	$event		The name of the callback
 * @param string	$type		The type of the callback
 * @param callable	$callback	The name of a valid function
 *
 * @return boolean
 */
Ossn.unset_callback = function($event, $type, $callback){
	if($event == '' || $type == '' || $callback == ''){
		return false;
	}
	if(Ossn.is_callback($event, $type)){
		for (i = 0; i <= Ossn.events[$event][$type].length; i++){
			if(Ossn.isset(Ossn.events[$event][$type][i])){
				if(Ossn.isset(Ossn.events[$event][$type][i].callback)){
					if(Ossn.events[$event][$type][i].callback == $callback){
						Ossn.events[$event][$type].splice(i, 1);
						break;
					}
				}
			}
		}
	}
};
/**
 * Trigger a callback
 *
 * @param string	$callback	The name of the callback
 * @param string	$type		The type of the callback
 * @param array|object  $params		Additional parameters to pass to the handlers
 * @param mixed		$returnvalue 	An initial return value
 *
 * @return mixed
 */
Ossn.trigger_callback = function($event, $type, $params = null){
	$events = new Array();
	eventspush = Array.prototype.push

	if(Ossn.isset(Ossn.events[$event]) && Ossn.isset(Ossn.events[$event][$type])){
		eventspush.apply($events, Ossn.events[$event][$type]);
	} else {
		return false;
	}
	$events.sort(function(a, b){
		if(a.priority < b.priority){
			return -1;
		}
		if(a.priority > b.priority){
			return 1;
		}
		return (a.index < b.index) ? -1 : 1;
	});
	$tempvalue = null;
	$.each($events, function(index, $item){
		if(Ossn.is_callable($item.callback) && (Ossn.call_user_func_array($item.callback, [$event, $type, $params]) == false)){
			return false;
		}
	});
	return true;
};
//<script>
/**
 * Register a ajax request
 *
 * @param $datap['form'] = form id
 * @param $datap['callback'] = call back function
 * @param $datap['error'] = on error function
 * @param $datap['beforeSend'] = before send function
 * @param $datap['url'] = form action url
 *
 * @return bool
 */
Ossn.ajaxRequest = function($datap){
    $(function(){
		
        var $form_name = $datap['form'];
        $('body').on("submit", $form_name, function(event){
													
			var $data = Ossn.call_hook('ajax', 'request:settings', null, $datap);	
        	var url = $data['url'];
        	var callback = $data['callback'];
        	var error = $data['error'];
       	 	var befsend = $data['beforeSend'];
        	var action = $data['action'];
        	var containMedia = $data['containMedia'];
        	var $xhr = $data['xhr'];
			
        	if(url == true){
            	url = $($form_name).attr('action');
        	}
            event.preventDefault();
            event.stopImmediatePropagation();

            if(!callback){
                return false;
            }
            if(!befsend){
                befsend = function(){}
            }
            if(!action){
                action = false;
            }
            if(action == true){
                url = Ossn.AddTokenToUrl(url);
            }

            if(!error){
                error = function(xhr, status, error){
                    if(error == 'Internal Server Error' || error !== ''){
                        Ossn.MessageBox('syserror/unknown');
                    }
                };
            }
            if(!$xhr){
                $xhr = function(){
                    var xhr = new window.XMLHttpRequest();
                    return xhr;
                };
            }
            var $form = $(this);
            if(containMedia == true){
                $requestData = new FormData($form[0]);
                $removeNullFile = function(formData){
                    if(formData.keys){
                        for (var key of formData.keys()){
                            var fileName = null || formData.get(key)['name'];
                            var fileSize = null || formData.get(key)['size'];
                            if(fileName != null && fileSize != null && fileName == '' && fileSize == 0){
                                formData.delete(key);
                            }
                        }
                    }
                };
                //Some Iphone devices unable to post #1295
                $removeNullFile($requestData);
                $vars = {
                    xhr: $xhr,
                    async: true,
                    cache: false,
                    contentType: false,
                    type: 'post',
                    beforeSend: befsend,
                    url: url,
                    error: error,
                    data: $requestData,
                    processData: false,
                    success: callback,
                };
            } else {
                $vars = {
                    xhr: $xhr,
                    async: true,
                    type: 'post',
                    beforeSend: befsend,
                    url: url,
                    error: error,
                    data: $form.serialize(),
                    success: callback,
                };
            }

            $.ajax($vars);
        });
    });
};
/**
 * Register a post request
 *
 * @param $datap['callback'] = call back function
 * @param $datap['error'] = on error function
 * @param $datap['beforeSend'] = before send function
 * @param $datap['url'] = form action url
 *
 * @return bool
 */
Ossn.PostRequest = function($datap){
	var $data = Ossn.call_hook('ajax:post', 'request:settings', null, $datap);
	var url = $data['url'];
	var callback = $data['callback'];
	var error = $data['error'];

	var befsend = $data['beforeSend'];
	var $fdata = $data['params'];
	var async = $data['async'];
	var action = $data['action'];
	var $xhr = $data['xhr'];
	if(!callback){
		return false;
	}
	if(!befsend){
		befsend = function(){}
	}
	if(typeof async === 'undefined'){
		async = true;
	}
	if(!action){
		action = true;
	}
	if(action == true){
		url = Ossn.AddTokenToUrl(url);
	}
	if(!error){
		error = function(){};
	}
	if(!$xhr){
		$xhr = function(){
			var xhr = new window.XMLHttpRequest();
			return xhr;
		};
	}
	$.ajax({
		xhr: $xhr,
		async: async,
		type: 'post',
		beforeSend: befsend,
		url: url,
		error: error,
		data: $fdata,
		success: callback,
	});
};//<script>
/**
 * Add action token to url
 *
 * @param string data Full complete url
 */
Ossn.AddTokenToUrl = function(data) {
	// 'http://example.com?data=sofar'
	if (typeof data === 'string') {
		// is this a full URL, relative URL, or just the query string?
		var parts = Ossn.ParseUrl(data),
			args = {},
			base = '';

		if (parts['host'] === undefined) {
			if (data.indexOf('?') === 0) {
				// query string
				base = '?';
				args = Ossn.ParseStr(parts['query']);
			}
		} else {
			// full or relative URL
			if (parts['query'] !== undefined) {
				// with query string
				args = Ossn.ParseStr(parts['query']);
			}
			var split = data.split('?');
			base = split[0] + '?';
		}
		args["ossn_ts"] = Ossn.Config.token.ossn_ts;
		args["ossn_token"] = Ossn.Config.token.ossn_token;

		return base + jQuery.param(args);
	}
};//<script>
/**
 * sprintf() for JavaScript 0.7-beta1
 * http://www.diveintojavascript.com/projects/javascript-sprintf
 */
var sprintf = (function() {
	function get_type(variable) {
		return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
	}

	function str_repeat(input, multiplier) {
		for (var output = []; multiplier > 0; output[--multiplier] = input) { /* do nothing */ }
		return output.join('');
	}

	var str_format = function() {
		if (!str_format.cache.hasOwnProperty(arguments[0])) {
			str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
		}
		return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
	};

	str_format.format = function(parse_tree, argv) {
		var cursor = 1,
			tree_length = parse_tree.length,
			node_type = '',
			arg, output = [],
			i, k, match, pad, pad_character, pad_length;
		for (i = 0; i < tree_length; i++) {
			node_type = get_type(parse_tree[i]);
			if (node_type === 'string') {
				output.push(parse_tree[i]);
			} else if (node_type === 'array') {
				match = parse_tree[i]; // convenience purposes only
				if (match[2]) { // keyword argument
					arg = argv[cursor];
					for (k = 0; k < match[2].length; k++) {
						if (!arg.hasOwnProperty(match[2][k])) {
							throw (sprintf('[sprintf] property "%s" does not exist', match[2][k]));
						}
						arg = arg[match[2][k]];
					}
				} else if (match[1]) { // positional argument (explicit)
					arg = argv[match[1]];
				} else { // positional argument (implicit)
					arg = argv[cursor++];
				}

				if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
					throw (sprintf('[sprintf] expecting number but found %s', get_type(arg)));
				}
				switch (match[8]) {
					case 'b':
						arg = arg.toString(2);
						break;
					case 'c':
						arg = String.fromCharCode(arg);
						break;
					case 'd':
						arg = parseInt(arg, 10);
						break;
					case 'e':
						arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential();
						break;
					case 'f':
						arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg);
						break;
					case 'o':
						arg = arg.toString(8);
						break;
					case 's':
						arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg);
						break;
					case 'u':
						arg = Math.abs(arg);
						break;
					case 'x':
						arg = arg.toString(16);
						break;
					case 'X':
						arg = arg.toString(16).toUpperCase();
						break;
				}
				arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+' + arg : arg);
				pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
				pad_length = match[6] - String(arg).length;
				pad = match[6] ? str_repeat(pad_character, pad_length) : '';
				output.push(match[5] ? arg + pad : pad + arg);
			}
		}
		return output.join('');
	};

	str_format.cache = {};

	str_format.parse = function(fmt) {
		var _fmt = fmt,
			match = [],
			parse_tree = [],
			arg_names = 0;
		while (_fmt) {
			if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
				parse_tree.push(match[0]);
			} else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
				parse_tree.push('%');
			} else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
				if (match[2]) {
					arg_names |= 1;
					var field_list = [],
						replacement_field = match[2],
						field_match = [];
					if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
						field_list.push(field_match[1]);
						while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
							if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
								field_list.push(field_match[1]);
							} else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
								field_list.push(field_match[1]);
							} else {
								throw ('[sprintf] huh?');
							}
						}
					} else {
						throw ('[sprintf] huh?');
					}
					match[2] = field_list;
				} else {
					arg_names |= 2;
				}
				if (arg_names === 3) {
					throw ('[sprintf] mixing positional and named placeholders is not (yet) supported');
				}
				parse_tree.push(match);
			} else {
				throw ('[sprintf] huh?');
			}
			_fmt = _fmt.substring(match[0].length);
		}
		return parse_tree;
	};

	return str_format;
})();

var vsprintf = function(fmt, argv) {
	argv.unshift(fmt);
	return sprintf.apply(null, argv);
};
/**
 * Ossn Print
 * Print a langauge string
 */
Ossn.Print = function(str, args) {
	if (OssnLocale[str]) {
		if (!args) {
			return OssnLocale[str];
		} else {
			return vsprintf(OssnLocale[str], args);
		}
	}
	return str;
};
/**
 * Check if the language string is avaialble or not
 *
 * @return boolean
 */
Ossn.isLangString = function(str, args) {
	if (OssnLocale[str]) {
		return true;
	}
	return false;
};//<script>
/**
 * Close a Ossn message box
 *
 * @return void
 */
Ossn.MessageBoxClose = function() {
	$('.ossn-message-box').hide();
	$('.ossn-halt').removeClass('ossn-light').hide();
	$('.ossn-halt').attr('style', '');

};
/**
 * Load Message box
 *
 * @return void
 */
Ossn.MessageBox = function($url) {
	Ossn.PostRequest({
		url: Ossn.site_url + $url,
		beforeSend: function() {
			$('.ossn-halt').addClass('ossn-light');
			$('.ossn-halt').attr('style', 'height:' + $(document).height() + 'px;');
			$('.ossn-halt').show();
			$('.ossn-message-box').html('<div class="ossn-loading ossn-box-loading"></div>');
			$('.ossn-message-box').fadeIn('slow');
		},
		callback: function(callback) {
			$('.ossn-message-box').html(callback).fadeIn();
		},
	});

};
/**
 * Load a media viewer
 *
 * @return void
 */
Ossn.Viewer = function($url) {
	Ossn.PostRequest({
		url: Ossn.site_url + $url,

		beforeSend: function() {
			$('.ossn-halt').removeClass('ossn-light');
			$('.ossn-halt').show();
			$('.ossn-viewer').html('<table class="ossn-container"><tr><td class="image-block" style="text-align: center;width:100%;"><div class="ossn-viewer-loding">Loading...</div></td></tr></table>');
			$('.ossn-viewer').show();
		},
		callback: function(callback) {
			$('.ossn-viewer').html(callback).show();
		},
	});
};
/**
 * Close a media viewer
 *
 * @return void
 */
Ossn.ViewerClose = function($url) {
	$('.ossn-halt').addClass('ossn-light');
	$('.ossn-halt').hide();
	$('.ossn-viewer').html('');
	$('.ossn-viewer').hide();
};
/**
 * Add a system messages for users
 *
 * @param string $messages Message for user
 * @param string $type Message type success (default) or error
 *
 * @return void
 */
Ossn.trigger_message = function($message, $type) {
	$type = $type || 'success';
	if ($type == 'error') {
		//compitable to bootstrap framework
		$type = 'danger';
	}
	if ($message == '') {
		return false;
	}
	$html = "<div class='alert alert-" + $type + "'><a href=\"#\" class=\"close\" data-dismiss=\"alert\">&times;</a>" + $message + "</div>";
	$('.ossn-system-messages').find('.ossn-system-messages-inner').append($html);
	if ($('.ossn-system-messages').find('.ossn-system-messages-inner').is(":not(:visible)")) {
		$('.ossn-system-messages').find('.ossn-system-messages-inner').slideDown('slow');
	}
	setTimeout(function(){ 
		$('.ossn-system-messages').find('.ossn-system-messages-inner').empty().hide()
	}, 10000);
};
/**
 * Dragging support of images
 * currently used by OssnProfile and OssnGroups
 *
 * @return void
 */
Ossn.Drag = function() {
	// some sanitizing to work with fluid themes and covers eventually resized according to screen width
	const default_cover_width  = 1040;
	const default_cover_height = 200;
	var image_width  = document.querySelector("#draggable").naturalWidth;
	var image_height = document.querySelector("#draggable").naturalHeight;
	var cover_width  = $("#container").width();
	var cover_height = $("#container").height();
	var drag_width   = 0;
	var drag_height  = 0;
	// TODO: get rid of hardcoded dimensions
	// the calculation below relies on current cover images HAVE a minimum width of 1040px
	// which shouldn't be a must-have for every other theme
	if(image_width > cover_width && image_width + cover_width > default_cover_width * 2) {
		drag_width = image_width - default_cover_width;
	}
	if(image_height > cover_height && image_height + cover_height > default_cover_height * 2) {
		drag_height = image_height - default_cover_height;
	}
	$.globalVars = {
		originalTop: 0,
		originalLeft: 0,
		maxHeight: drag_height,
		maxWidth: drag_width
	};
	$("#draggable").draggable({
		start: function(event, ui) {
			if (ui.position != undefined) {
				$.globalVars.originalTop = ui.position.top;
				$.globalVars.originalLeft = ui.position.left;
			}
		},
		drag: function(event, ui) {
			var newTop = ui.position.top;
			var newLeft = ui.position.left;
			if (ui.position.top < 0 && ui.position.top * -1 > $.globalVars.maxHeight) {
				newTop = $.globalVars.maxHeight * -1;
			}
			if (ui.position.top > 0) {
				newTop = 0;
			}
			if (ui.position.left < 0 && ui.position.left * -1 > $.globalVars.maxWidth) {
				newLeft = $.globalVars.maxWidth * -1;
			}
			if (ui.position.left > 0) {
				newLeft = 0;
			}
			ui.position.top = newTop;
			ui.position.left = newLeft;
		}
	});
};	
/**
 * Message done
 *
 * @param $message = message
 *
 * @return mix data
 */
Ossn.MessageDone = function($message) {
	return "<div class='ossn-message-done'>" + $message + "</div>";
};//<script>
/**
 * Register some init functionality
 * Example user signup,  update check, message boxes etc
 */
Ossn.register_callback('ossn', 'init', 'ossn_startup_functions_compatibility');
Ossn.register_callback('ossn', 'init', 'ossn_image_url_cache');
Ossn.register_callback('ossn', 'init', 'ossn_administrator_update_widget');
Ossn.register_callback('ossn', 'init', 'ossn_administrator_user_delete');
Ossn.register_callback('ossn', 'init', 'ossn_makesure_confirmation');
Ossn.register_callback('ossn', 'init', 'ossn_component_delelte_confirmation');
Ossn.register_callback('ossn', 'init', 'ossn_system_messages');
Ossn.register_callback('ossn', 'init', 'ossn_user_signup_form');
Ossn.register_callback('ossn', 'init', 'ossn_topbar_dropdown');	
/**
 * Setup ajax request for user register
 *
 * @return void
 */
function ossn_user_signup_form(){
	Ossn.ajaxRequest({
		url: Ossn.site_url + "action/user/register",
		form: '#ossn-home-signup',

		beforeSend: function(request){
			var failedValidate = false;
			$('#ossn-submit-button').show();
			$('#ossn-home-signup .ossn-loading').addClass("ossn-hidden");

			$('#ossn-home-signup').find('#ossn-signup-errors').hide();
			$('#ossn-home-signup input').filter(function(){
				$(this).closest('span').removeClass('ossn-required');
				if(this.type == 'radio' && !$(this).hasClass('ossn-field-not-required')){
					if(!$("input[name='gender']:checked").val()){
						$(this).closest('span').addClass('ossn-required');
						failedValidate = true;
					}
				}
				if(this.value == "" && !$(this).hasClass('ossn-field-not-required')){
					$(this).addClass('ossn-red-borders');
					failedValidate = true;
					request.abort();
					return false;
				}
			});
			if(failedValidate == false){
				$('#ossn-submit-button').hide();
				$('#ossn-home-signup .ossn-loading').removeClass("ossn-hidden");
			}
		},
		callback: function(callback){
			if(callback['dataerr']){
				$('#ossn-home-signup').find('#ossn-signup-errors').html(callback['dataerr']).fadeIn();
				$('#ossn-submit-button').show();
				$('#ossn-home-signup .ossn-loading').addClass("ossn-hidden");
			} else if(callback['success'] == 1){
				$('#ossn-home-signup').html(Ossn.MessageDone(callback['datasuccess']));
			} else {
				$('#ossn-home-signup .ossn-loading').addClass("ossn-hidden");
				$('#ossn-submit-button').attr('type', 'submit')
				$('#ossn-submit-button').attr('style', 'opacity:1;');
			}
		}
	});
}
/**
 * Setup system messages
 *
 * @return void
 */
function ossn_system_messages(){
	$(document).ready(function(){
		if($('.ossn-system-messages').find('a').length){
			$('.ossn-system-messages').find('.ossn-system-messages-inner').show();

			setTimeout(function(){
				$('.ossn-system-messages').find('.ossn-system-messages-inner').hide().empty();
			}, 10000);
		}
		//Clicking close in system messages should close it complete #1137
		$('body').on('click', '.ossn-system-messages .close', function(){
			$('.ossn-system-messages').find('.ossn-system-messages-inner').hide().empty();
		});
	});
}
/**
 * Topbar dropdown button
 *
 * @return void
 */
function ossn_topbar_dropdown(){
	$(document).ready(function(){
		$('.ossn-topbar-dropdown-menu-button').click(function(){
			if($('.ossn-topbar-dropdown-menu-content').is(":not(:visible)")){
				$('.ossn-topbar-dropdown-menu-content').show();
			} else {
				$('.ossn-topbar-dropdown-menu-content').hide();
			}
		});

	});
}
/**
 * Show exception on component delete
 *
 * @return void
 */
function ossn_component_delelte_confirmation(){
	$(document).ready(function(){
		//show a confirmation mssage before delete component #444
		$('.ossn-com-delete-button').click(function(e){
			e.preventDefault();
			var del = confirm(Ossn.Print('ossn:component:delete:exception'));
			if(del == true){
				var actionurl = $(this).attr('href');
				window.location = actionurl;
			}
		});
	});
}
/**
 * Show exception , are you sure?
 *
 * @return void
 */
function ossn_makesure_confirmation(){
	$(document).ready(function(){
		$('.ossn-make-sure').click(function(e){
			e.preventDefault();
			var del = confirm(Ossn.Print('ossn:exception:make:sure'));
			if(del == true){
				var actionurl = $(this).attr('href');
				window.location = actionurl;
			}
		});
	});
}
/**
 * Show exception on user delete
 *
 * @return void
 */
function ossn_administrator_user_delete(){
	$(document).ready(function(){
		$('.userdelete').click(function(e){
			e.preventDefault();
			var del = confirm(Ossn.Print('ossn:user:delete:exception'));
			if(del == true){
				var actionurl = $(this).attr('href');
				window.location = actionurl;
			}

		});
	});
}
/**
 * Checks for the updates in administrator panel
 *
 * @return void
 */
function ossn_administrator_update_widget(){
	$(document).ready(function(){
		if($('.avaiable-updates').length){
			Ossn.PostRequest({
				url: Ossn.site_url + "administrator/version",
				action: false,
				callback: function(callback){
					if(callback['version']){
						$('.avaiable-updates').html(callback['version']);
					}
				}
			});
		}
	});
}
/**
 * Add cache tag to the local images
 * 
 * @param string		$callback	ossn
 * @param string		$type		init
 * @param array|object 	$params		null
 *
 * @added in v5.0 
 * @return void
 */
function ossn_image_url_cache($callback, $type, $params){
	$(document).ready(function(){
		if(Ossn.Config.cache.ossn_cache == 1){
			$('img').each(function(){
				var data = $(this).attr('src');
				$site_url = Ossn.ParseUrl(Ossn.site_url);
				var parts = Ossn.ParseUrl(data),
					args = {},
					base = '';
				if(parts['host'] == $site_url['host']){
					if(parts['host'] === undefined){
						if(data.indexOf('?') === 0){
							// query string
							base = '?';
							args = Ossn.ParseStr(parts['query']);
						}
					} else {
						// full or relative URL
						if(parts['query'] !== undefined){
							// with query string
							args = Ossn.ParseStr(parts['query']);
						}
						var split = data.split('?');
						base = split[0] + '?';
					}
					args["ossn_cache"] = Ossn.Config.cache.last_cache;
					$(this).attr('src', base + jQuery.param(args));
				}
			});
		}
	});
}
/**
 * Startup functions support
 * 
 * @param string		$callback	ossn
 * @param string		$type		init
 * @param array|object 	$params		null
 * 
 * @return void
 */
function ossn_startup_functions_compatibility($callback, $type, $params){
	for (var i = 0; i <= Ossn.Startups.length; i++){
		if(typeof Ossn.Startups[i] !== "undefined"){
			Ossn.Startups[i]();
		}
	}
}
/**
 * Initialize ossn startup functions
 *
 * @return void
 */
Ossn.Init = function(){
	Ossn.trigger_callback('ossn', 'init');
};
//<script>
$(document).ready(function() {
	$('[data-toggle="tooltip"]').tooltip({
		placement:'left',										  
	}); 
	$(document).on('click', '#sidebar-toggle', function() {
		var $toggle = $(this).attr('data-toggle');
		if ($toggle == 0) {
			$(this).attr('data-toggle', 1);
			if($(document).innerWidth() >= 1300 && $('.ossn-page-loading-annimation').is(':visible')){
				$('.sidebar').addClass('sidebar-open-no-annimation');	
				$('.ossn-page-container').addClass('sidebar-open-page-container-no-annimation');
			} else {
				$('.sidebar').addClass('sidebar-open');
				$('.ossn-page-container').addClass('sidebar-open-page-container');
			}			
			$('.topbar .right-side').addClass('right-side-space');
			$('.topbar .right-side').addClass('sidebar-hide-contents-xs');
			$('.ossn-inner-page').addClass('sidebar-hide-contents-xs');
		}
		if ($toggle == 1) {
			$(this).attr('data-toggle', 0);
			
			$('.sidebar').removeClass('sidebar-open');
			$('.sidebar').removeClass('sidebar-open-no-annimation');
			
			$('.ossn-page-container').removeClass('sidebar-open-page-container');
			$('.ossn-page-container').removeClass('sidebar-open-page-container-no-annimation');
			$('.topbar .right-side').removeClass('right-side-space');
			$('.topbar .right-side').removeClass('sidebar-hide-contents-xs');
			$('.ossn-inner-page').removeClass('sidebar-hide-contents-xs');

			$('.topbar .right-side').addClass('right-side-nospace');
			$('.sidebar').addClass('sidebar-close');
			$('.ossn-page-container').addClass('sidebar-close-page-container');

		}
		var document_height = $(document).height();
		$(".sidebar").height(document_height);
	});
	var $chatsidebar = $('.ossn-chat-windows-long .inner');
	if($chatsidebar.length){
		$chatsidebar.css('height', $(window).height() - 45);
	}
	$(document).scroll(function() {
		$document_height = $(document).height();						
		$(".sidebar").height($document_height);
		
		if($chatsidebar.length){
			if ($(document).scrollTop() >= 50) {
				$chatsidebar.addClass('ossnchat-scroll-top');
				$chatsidebar.css('height', $(window).height());
			} else if ($(document).scrollTop() == 0) {
				$chatsidebar.removeClass('ossnchat-scroll-top');
				$chatsidebar.css('height', $(window).height() - 45);
			}
		}
	});
	if($(document).innerWidth() >= 1300){
		$('#sidebar-toggle').click();
	}
});
//https://www.opensource-socialnetwork.org/component/view/3657/optimize-pre-loader
$(document).ready(function() {
	   $(".ossn-page-loading-annimation").fadeOut("slow");
});
$(window).on('load resize', function () {
	if (document.querySelector("#draggable")) {
		if (($('.ossn-group-cover').height() + $('.profile-cover').height()) < 481) {
			// we're on mobile and have a group cover image
			const desktop_cover_width  = 1040;
			const desktop_cover_height = 200;
			var mobile_cover_height  = $('.ossn-group-cover').height() + $('.profile-cover').height();
			var real_image_width  = document.querySelector("#draggable").naturalWidth;
			var real_image_height = document.querySelector("#draggable").naturalHeight;
			// 1. how many mobile heights would we need to hold the image?
			var mobile_height_factor = real_image_height / mobile_cover_height;
			// 2. how many pixels wide would be the scaled mobile image in comparison to fix desktop_cover_width?
			var mobile_pixel_width = desktop_cover_width / mobile_height_factor;
			// 3. how often would these pixels fit into the current coverwidth?
			var current_cover_width = $('.ossn-group-cover').width() + $('.profile-cover').width();
			var mobile_width_factor = current_cover_width / mobile_pixel_width;
			// 4. how many pixels do we get with the current mobile cover height?
			var mobile_pixel_height = mobile_width_factor * mobile_cover_height;
			// setting the new height already here allows us to retrieve the new scaled image width calculated by the browser
			$('#draggable').css('height', mobile_pixel_height);
			mobile_pixel_width = parseInt($('#draggable').css('width'));
			
			// 5. calculate the height-scaling factor for dragging - get maximum possible scroll top position
			var desktop_scroll_top_max = real_image_height - desktop_cover_height;
			var mobile_scroll_top_max  = mobile_pixel_height - mobile_cover_height;
			var height_scaling_factor  = desktop_scroll_top_max / mobile_scroll_top_max;
			// 6. calculate the width-scaling factor for dragging - get maximum possible scroll left position
			var desktop_scroll_left_max = real_image_width - desktop_cover_width;
			var mobile_scroll_left_max  = mobile_pixel_width - current_cover_width;
			var width_scaling_factor  = desktop_scroll_left_max / mobile_scroll_left_max;
			// 7. retrieve the saved dragging positions and scale accordingly
			var cover_top    = parseInt($('#draggable').data('top'));
			var cover_left   = parseInt($('#draggable').data('left'));
			var mobile_pixel_top  = cover_top / height_scaling_factor;
			var mobile_pixel_left = cover_left / width_scaling_factor;
			$('#draggable').css('top', mobile_pixel_top);
			$('#draggable').css('left', mobile_pixel_left);
		}
	// don't display cover images before final scale and position is known
	$('#draggable').fadeIn();
	}
});
//<script>
/**
 * Open Source Social Network
 *
 * @package   (softlab24.com).ossn
 * @author    OSSN Core Team <info@softlab24.com>
 * @copyright (C) SOFTLAB24 LIMITED
 * @license   Open Source Social Network License (OSSN LICENSE)  http://www.opensource-socialnetwork.org/licence
 * @link      https://www.opensource-socialnetwork.org/
 */
Ossn.RegisterStartupFunction(function() {
	$(document).ready(function() {
		var cYear = (new Date).getFullYear();
		var alldays = Ossn.Print('datepicker:days');
		var shortdays = alldays.split(",");
		var allmonths = Ossn.Print('datepicker:months');
		var shortmonths = allmonths.split(",");

		var datepick_args = {
			changeMonth: true,
			changeYear: true,
			dateFormat: 'dd/mm/yy',
			yearRange: '1900:' + cYear,
		};

		if (Ossn.isLangString('datepicker:days')) {
			datepick_args['dayNamesMin'] = shortdays;
		}
		if (Ossn.isLangString('datepicker:months')) {
			datepick_args['monthNamesShort'] = shortmonths;
		}
		$("input[name='birthdate']").datepicker(datepick_args);

		/**
		 * Reposition cover
		 */
		$('#reposition-profile-cover').click(function() {
			$('#profile-menu').hide();
			$('#cover-menu').show();
			$('.profile-cover-controls').hide();
			$('.profile-cover').unbind('mouseenter').unbind('mouseleave');
			Ossn.Drag();
		});
		$("#upload-photo").submit(function(event) {
			event.preventDefault();
			var formData = new FormData($(this)[0]);
			var $url = Ossn.site_url + 'action/profile/photo/upload';
			$.ajax({
				url: Ossn.AddTokenToUrl($url),
				type: 'POST',
				data: formData,
				async: true,
				beforeSend: function() {
					$('.upload-photo').attr('class', 'user-photo-uploading');
				},
				error: function(xhr, status, error) {
					if (error == 'Internal Server Error' || error !== '') {
						Ossn.MessageBox('syserror/unknown');
					}
				},
				cache: false,
				contentType: false,
				processData: false,
				success: function(callback) {
					$time = $.now();
					$('.user-photo-uploading').attr('class', 'upload-photo').hide();
					$imageurl = $('.profile-photo').find('img').attr('src') + '?' + $time;
					$('.profile-photo').find('img').attr('src', $imageurl);
					$topbar_icon_url = $('.ossn-topbar-menu').find('img').attr('src') + '?' + $time;
					$('.ossn-topbar-menu').find('img').attr('src', $topbar_icon_url);
				}
			});

			return false;
		});

		$("#upload-cover").submit(function(event) {
			event.preventDefault();
			//console.log('no');
			var formData = new FormData($(this)[0]);
			var $url = Ossn.site_url + 'action/profile/cover/upload';
			var fileInput = $('#upload-cover').find("input[type=file]")[0],
				file = fileInput.files && fileInput.files[0];

			if (file) {
				var img = new Image();
				img.src = window.URL.createObjectURL(file);

				img.onload = function() {
					var width = img.naturalWidth,
						height = img.naturalHeight;

					window.URL.revokeObjectURL(img.src);
					if (width < 1040 || height < 300) {
						Ossn.trigger_message(Ossn.Print('profile:cover:err1:detail'), 'error');
						return false;
					} else {
						$.ajax({
							url: Ossn.AddTokenToUrl($url),
							type: 'POST',
							data: formData,
							async: true,
							cache: false,
							contentType: false,
							processData: false,
							beforeSend: function(xhr, obj) {
								$('.profile-cover').prepend('<div class="ossn-covers-uploading-annimation"> <div class="ossn-loading"></div></div>');
								$('.profile-cover-img').attr('class', 'user-cover-uploading');
							},
							success: function(callback) {
								$time = $.now();
								$('.profile-cover').find('img').removeClass('user-cover-uploading');
								$('.profile-cover').find('img').addClass('profile-cover-img');
								$imageurl = $('.profile-cover').find('img').attr('src') + '?' + $time;
								$('.profile-cover').find('img').attr('src', $imageurl);
								$('.profile-cover').find('img').attr('style', '');
								$('.profile-cover').find('img').show();
								$('.ossn-covers-uploading-annimation').remove();
							},
						});
					}
				};
			}

			return false;
		});

		/* Profile extra menu */
		$('#profile-extra-menu').on('click', function() {
			$div = $('.ossn-profile-extra-menu').find('div');
			if ($div.is(":not(:visible)")) {
				$div.show();
			} else {
				$div.hide();
			}
		});
	});

});

Ossn.repositionCOVER = function() {
	var $pcover_top = $('.profile-cover-img').css('top');
	var $pcover_left = $('.profile-cover-img').css('left');
	$url = Ossn.site_url + "action/profile/cover/reposition";
	$.ajax({
		async: true,
		type: 'post',
		data: '&top=' + $pcover_top + '&left=' + $pcover_left,
		url: Ossn.AddTokenToUrl($url),
		success: function(callback) {
			$("#draggable").draggable('destroy');
			$('#profile-menu').show();
			$('#cover-menu').hide();
			$('.profile-cover').hover(function() {
				$('.profile-cover-controls').show();
			}, function() {
				$('.profile-cover-controls').hide();
			});
		},
	});
};
/**
 * Setup a profile photo buttons
 *
 * @return void
 */
Ossn.RegisterStartupFunction(function() {
	$(document).ready(function() {
		$('.profile-photo').hover(function() {
			$('.upload-photo').slideDown();
		}, function() {
			$('.upload-photo').slideUp();
		});
	});
});
/**
 * Setup a profile cover buttons
 *
 * @return void
 */
Ossn.RegisterStartupFunction(function() {
	$(document).ready(function() {
		$('.profile-cover').hover(function() {
			$('.profile-cover-controls').show();
		}, function() {
			$('.profile-cover-controls').hide();
		});
	});
});//<script>
/**
 * Open Source Social Network
 *
 * @package   (softlab24.com).ossn
 * @author    OSSN Core Team <info@softlab24.com>
 * @copyright (C) SOFTLAB24 LIMITED
 * @license   Open Source Social Network License (OSSN LICENSE)  http://www.opensource-socialnetwork.org/licence 
 * @link      https://www.opensource-socialnetwork.org/
 */
Ossn.register_callback('ossn', 'init', 'ossn_wall_init');
Ossn.register_callback('ossn', 'init', 'ossn_wall_postform');
Ossn.register_callback('ossn', 'init', 'ossn_wall_post_edit');
Ossn.register_callback('ossn', 'init', 'ossn_wall_select_friends');
Ossn.register_callback('ossn', 'init', 'ossn_wall_location');
Ossn.register_callback('ossn', 'init', 'ossn_wall_privacy');
function ossn_wall_post_edit(){
	$(document).ready(function(){
		//post edit
		Ossn.ajaxRequest({
			url: Ossn.site_url + "action/wall/post/edit",
			containMedia: true,
			form: '#ossn-post-edit-form',
			beforeSend: function(){
				$('#ossn-post-edit-form').find('textarea').hide();
				$('#ossn-post-edit-form').append('<div class="ossn-loading ossn-box-loading"></div>');
			},
			callback: function(callback){
				if(callback['success']){
					$text = $('#ossn-post-edit-form').find('#post-edit').val();
					$guid = $('#ossn-post-edit-form').find('input[name="guid"]').val();
					$elem = $("#activity-item-" + $guid).find('.post-contents').find('p:first');
					/* LinkPreview support */
					var preview_url = '';
					$preview_block = $("#activity-item-" + $guid).find('.post-contents').find('.link-preview-item');
					$preview_link = $("#activity-item-" + $guid).find('.post-contents').find('.link-preview-item').find('a');
					if($preview_link.length){
						// if available, get old preview link to be passed to and compared with edited text in embed action
						preview_url = $preview_link[0].href;
					}

					if($elem.length){
						$elem.text('');
						Ossn.PostRequest({
							url: Ossn.site_url + "action/wall/post/embed",
							params: 'text=' + encodeURIComponent($text) + '&preview=' + preview_url + '&guid=' + $guid,
							callback: function(return_data){
								$elem.append(return_data['text']);
								// handle existing/changed/removed/new preview according to action result
								if((return_data['preview_state'] == 'removed') || (return_data['preview_state'] == 'changed')){
									$preview_block.remove();
								}
								if((return_data['preview_state'] == 'created') || (return_data['preview_state'] == 'changed')){
									$("#activity-item-" + $guid).find('.post-contents').append(return_data['preview']);
								}
							}
						});
					}
					Ossn.trigger_message(callback['success']);
				}
				if(callback['error']){
					Ossn.trigger_message(callback['error'], 'error');
				}
				Ossn.MessageBoxClose();
			}
		});
		//post-edit />	
	});
}

function ossn_wall_postform(){
	$(document).ready(function(){
		//ajax post
		$url = $('#ossn-wall-form').attr('action');
		Ossn.ajaxRequest({
			url: $url,
			action: true,
			containMedia: true,
			form: '#ossn-wall-form',

			beforeSend: function(request){
				$('#ossn-wall-form').find('input[type=submit]').hide();
				$('#ossn-wall-form').find('.ossn-loading').removeClass('ossn-hidden');
			},
			callback: function(callback){
				if(callback['success']){
					//[E] Hide a success message when post is added #1745
					//Ossn.trigger_message(callback['success']);
					if(callback['data']['post']){
						var new_post = callback['data']['post'];
						$('.user-activity').prepend($(callback['data']['post']).hide().fadeIn('slow'));
						// mark post as 'new' in order to distinguish it on deleting
						// new posts must not trigger inserts on deleting !!
						$('.user-activity div').first().attr('post', 'new');
					}
				}
				if(callback['error']){
					Ossn.trigger_message(callback['error'], 'error');
				}

				//need to clear file path after uploading the file #626
				var $file = $("#ossn-wall-form").find("input[type='file']");
				$file.replaceWith($file.val('').clone(true));
				$('#ossn-wall-photo').hide();

				//Tagged friend(s) and location should be cleared, too - after posting #641
				$("#ossn-wall-location-input").val('');
				$('#ossn-wall-location').hide();

				$('#ossn-wall-friend-input').val('');
				if($('#ossn-wall-friend-input').length){
					$("#ossn-wall-friend-input").tokenInput("clear");
					$('#ossn-wall-friend').hide();
				}

				$('#ossn-wall-form').find('input[type=submit]').show();
				$('#ossn-wall-form').find('.ossn-loading').addClass('ossn-hidden');
				$('#ossn-wall-form').find('textarea').val("");
			}
		});
	});
}

function ossn_wall_init(){
	$(document).ready(function(){
		$('.ossn-wall-container').find('.ossn-wall-friend').click(function(){
			$('#ossn-wall-location').hide();
			$('#ossn-wall-photo').hide();
			$('#ossn-wall-friend').show();
		});
		$('.ossn-wall-container').find('.ossn-wall-location').click(function(){
			$('#ossn-wall-friend').hide();
			$('#ossn-wall-photo').hide();
			$('#ossn-wall-location').show();
		});
		$('.ossn-wall-container').find('.ossn-wall-photo').click(function(){
			$('#ossn-wall-friend').hide();
			$('#ossn-wall-location').hide();
			$('#ossn-wall-photo').show();

		});
		$('body').on('click', '.ossn-wall-container-menu-post', function(e){
			e.preventDefault();
			$('.ossn-wall-container-data-post').hide();
			$('.ossn-wall-container-data-post').show();
		});
		$('body').on('click', '.ossn-wall-post-delete', function(e){
			$url = $(this);
			e.preventDefault();

			// new code to insert the first posting from next page,
			// if a posting of the current page has been deleted

			// make it work with /home, /u/USERNAME, /group/GROUP_ID
			var ossn_site_url_parse = Ossn.ParseUrl(Ossn.site_url);
			var $page_url_path = $(location).attr('pathname').substr(1);
			
			//we need to check if OSSN is installed in subdirectory?
			//[B] Wall post delete issue when installation in subdirectory #1717
			if(Ossn.isset(ossn_site_url_parse['path'])){
				$page_url_path = $(location).attr('pathname');
				$page_url_path = Ossn.str_replace(ossn_site_url_parse['path'], '', $page_url_path);
			}
			var base_page_url = Ossn.site_url + $page_url_path;
			// ignore new posts which have just been added
			// because they don't have an impact on the current pagination
			// so first check, whether the to be deleted posting has a 'new' attribute
			// see line #357 for marker setting
			$to_be_deleted = $('#activity-item-' + $url.attr('data-guid'));
			var post_attribute = $to_be_deleted.attr('post');
			var old_posting_deleted = false;
			var last_page_posting_deleted = false;
			var $element = '';
			if(typeof post_attribute === 'undefined'){
				// no attribute found - so this is an already existing older post
				// check for existance of next page
				$next = $('.user-activity .ossn-pagination').find('.active').next();
				if($next.length){
					// this page HAS a paginator !
					var next_url = $next.find('a').attr('href');
					var results = new RegExp('[\?&]' + 'offset' + '=([0-9]*)').exec(next_url);
					$next_offset = results[1] || false;
					next_url = '?offset=' + $next_offset;

					// remember the current page's offset we're on ...
					// - to rebuild paginator if necessary when AutoPagination is disabled
					// - to compare with last page offset, because there's nothing to insert on the last page
					var current_url = $(location).attr('href');
					var results = new RegExp('[\?&]' + 'offset' + '=([0-9]*)').exec(current_url);
					if(results){
						var $current_offset = results[1] || false;
					} else {
						// pages without explicite included offset are assumed to be page 1
						var $current_offset = 1;
					}

					// and get the last page's offset
					$last = $('.user-activity .ossn-pagination').find('li:last');
					var last_url = $last.find('a').attr('href');
					var results = new RegExp('[\?&]' + 'offset' + '=([0-9]*)').exec(last_url);
					$last_offset = results[1] || false;
					
					if($current_offset < $last_offset){
						Ossn.PostRequest({
							// IMPORTANT: we must run the next 3 (4) XHR posts with async set to FALSE
							// otherwise we're getting unpredictable results from the callbacks here
							// like sometimes not the first posting is returned but a random other one,
							// or record is still available althought already deleted
							async: false, // !!!
							action: false,
							url: base_page_url + next_url,
							beforeSend: function(){},
							callback: function(callback){
								// try to get the first posting of the next page
								$element = $(callback).find('.ossn-wall-item').first();
								if($element.length){
									//append the posting at the bottom, right before pagination
									$element.insertBefore('.user-activity .container-table-pagination');
									// temporarely hide inserted element, to allow deleting of old posting first in next step to avoid flickering
									$element.hide();
									old_posting_deleted = true;
								}
							},
						});
					} else {
						// we're on the last page
						last_page_posting_deleted = true;
					}
				}
			}

			// remove post from wall
			Ossn.PostRequest({
				url: $url.attr('href'),
				async: false,
				beforeSend: function(request){
					$('#activity-item-' + $url.attr('data-guid')).attr('style', 'opacity:0.5;');
				},
				callback: function(callback){
					if(callback == 1){
						$('#activity-item-' + $url.attr('data-guid')).fadeOut();
						$('#activity-item-' + $url.attr('data-guid')).remove();
					} else {
						$('#activity-item-' + $url.attr('data-guid')).attr('style', 'opacity:1;');
					}
				}
			});

			if($element.length){
				// make inserted element visible
				$element.show();
			}

			// needed for manual pagination only!
					});

		$('body').delegate('.ossn-wall-post-edit', 'click', function(){
			var $dataguid = $(this).attr('data-guid');
			Ossn.MessageBox('post/edit/' + $dataguid);
		});
		//Change the privacy button as per the privacy value #1289
		$('body').on('input', '#ossn-wall-privacy', function(){
			switch (parseInt($(this).val())){
				case 3:
					$('.ossn-wall-privacy-lock').removeClass('fa-lock');
					$('.ossn-wall-privacy-lock').removeClass('fa-globe');
					$('.ossn-wall-privacy-lock').removeClass('fa-users');
					$('.ossn-wall-privacy-lock').addClass('fa-users');
					break;
				case 2:
					$('.ossn-wall-privacy-lock').removeClass('fa-lock');
					$('.ossn-wall-privacy-lock').removeClass('fa-globe');
					$('.ossn-wall-privacy-lock').removeClass('fa-users');
					$('.ossn-wall-privacy-lock').addClass('fa-globe');
					break;
			}
		});
		if($('#ossn-wall-privacy').length){
			$('#ossn-wall-privacy').trigger('input');
		}
	});
}

function ossn_wall_select_friends(){
	$(document).ready(function(){
		if($.isFunction($.fn.tokenInput)){
			$("#ossn-wall-friend-input").tokenInput(Ossn.site_url + "friendpicker", {
				placeholder: Ossn.Print('tag:friends'),
				hintText: false,
				propertyToSearch: "first_name",
				resultsFormatter: function(item){
					return "<li>" + "<img src='" + item.imageurl + "' title='" + item.first_name + " " + item.last_name + "' height='25px' width='25px' />" + "<div style='display: inline-block; padding-left: 10px;'><div class='full_name' style='font-weight:bold;color:#2B5470;'>" + item.first_name + " " + item.last_name + "</div></div></li>"
				},
				tokenFormatter: function(item){
					return "<li><p>" + item.first_name + " " + item.last_name + "</p></li>"
				},
			});
		}
	});
}
Ossn.PostMenu = function($id){
	$element = $($id).find('.menu-links');
	if($element.is(":not(:visible)")){
		$element.show();
	} else {
		$element.hide();
	}
};
function ossn_wall_privacy(){
	$(document).ready(function(){
		$('.ossn-wall-privacy').on('click', function(e){
			Ossn.MessageBox('post/privacy');
		});
		$('#ossn-wall-privacy').on('click', function(e){
			var wallprivacy = $('#ossn-wall-privacy-container').find('input[name="privacy"]:checked').val();
			$('#ossn-wall-privacy').val(wallprivacy);
			$('#ossn-wall-privacy').trigger("input");
			Ossn.MessageBoxClose();
		});
	});

}
/**
 * Setup Google Location input
 *
 * Remove google map search API as it requires API #906 
 * 
 * @return void
 */
function ossn_wall_location(){
	$(document).ready(function(){
		if($('#ossn-wall-location-input').length){
			//Location autocomplete not working over https #1043
			//Change to places js
			var placesAutocomplete = places({
				container: document.querySelector('#ossn-wall-location-input')
			});
			$('#ossn-wall-location-input').keypress(function(event){
				if(event.keyCode == 13){
					event.preventDefault();
					return false;
				}
			});
		}
	});
}
//<script>
/**
 * Open Source Social Network
 *
 * @package   Open Source Social Network
 * @author    Open Social Website Core Team <info@softlab24.com>
 * @copyright (C) SOFTLAB24 LIMITED
 * @license   Open Source Social Network License (OSSN LICENSE)  http://www.opensource-socialnetwork.org/licence
 * @link      https://www.opensource-socialnetwork.org/
 */
Ossn.register_callback('ossn', 'init', 'ossn_comment_init');
Ossn.register_callback('ossn', 'init', 'ossn_comment_delete_handler');
Ossn.register_callback('ossn', 'init', 'ossn_comment_edit');
Ossn.PostComment = function($container){
	$('#comment-box-p' + $container).keypress(function(e){
		if(e.which == 13){
			if(e.shiftKey === false){
				//Postings and comments with same behaviour #924
				$replace_tags = function(input, allowed){
					allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('')
					var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
					var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>|&nbsp;/gi
					return input.replace(commentsAndPhpTags, '').replace(tags, function($0, $1){
						return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''
					})
				};

				$text = $('#comment-box-p' + $container).html();
				$text = $replace_tags($text, '<br>').replace(/\<br\\?>/g, "\n");
				$('#comment-container-p' + $container).append("<textarea name='comment' class='hidden'>" + $text + "</textarea>");
				$('#comment-container-p' + $container).submit();
			}
		}
	});
	$('#comment-box-p' + $container).on('paste', function(e){
		e.preventDefault();
		var text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('Paste something..');
		window.document.execCommand('insertText', false, text);
	});
	Ossn.ajaxRequest({
		url: Ossn.site_url + 'action/post/comment',
		form: '#comment-container-p' + $container,
		beforeSend: function(request){
			$('#comment-box-p' + $container).attr('readonly', 'readonly');
			$('#comment-box-p' + $container).attr('contenteditable', false);
		},
		callback: function(callback){
			if(callback['process'] == 1){
				$('#comment-box-p' + $container).removeAttr('readonly');
				$('#comment-box-p' + $container).val('');
				$('.ossn-comments-list-p' + $container).append(callback['comment']);
				$('#comment-attachment-container-p' + $container).hide();
				$('#ossn-comment-attachment-p' + $container).find('.image-data').html('');
				//commenting pic followed by text gives warnings #664 $dev.githubertus
				$('#comment-container-p' + $container).find('input[name="comment-attachment"]').val('');
			}
			if(callback['process'] == 0){
				$('#comment-box-p' + $container).removeAttr('readonly');
				Ossn.MessageBox('syserror/unknown');
			}
			$('#comment-box-p' + $container).attr('contenteditable', true);
			$('#comment-box-p' + $container).html("");
			Ossn.trigger_callback('comment', 'post:callback', {
				guid: $container,
				response: callback,
			});
		}
	});
};
Ossn.EntityComment = function($container){
	$('#comment-box-e' + $container).keypress(function(e){
		if(e.which == 13){
			if(e.shiftKey === false){
				//Postings and comments with same behaviour #924
				$replace_tags = function(input, allowed){
					allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('')
					var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
					var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>|&nbsp;/gi
					return input.replace(commentsAndPhpTags, '').replace(tags, function($0, $1){
						return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''
					})
				};

				$text = $('#comment-box-e' + $container).html();
				$text = $replace_tags($text, '<br>').replace(/\<br\\?>/g, "\n");
				$('#comment-container-e' + $container).append("<textarea name='comment' class='hidden'>" + $text + "</textarea>");
				$('#comment-container-e' + $container).submit();
			}
		}
	});
	$('#comment-box-e' + $container).on('paste', function(e){

		e.preventDefault();
		var text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('Paste something..');
		window.document.execCommand('insertText', false, text);
	});
	Ossn.ajaxRequest({
		url: Ossn.site_url + 'action/post/entity/comment',
		form: '#comment-container-e' + $container,
		beforeSend: function(request){
			$('#comment-box-e' + $container).attr('readonly', 'readonly');
			$('#comment-box-e' + $container).attr('contenteditable', false);

		},
		callback: function(callback){
			if(callback['process'] == 1){
				$('#comment-box-e' + $container).removeAttr('readonly');
				$('#comment-box-e' + $container).val('');
				$('.ossn-comments-list-e' + $container).append(callback['comment']);
				$('#comment-attachment-container-e' + $container).hide();
				$('#ossn-comment-attachment-e' + $container).find('.image-data').html('');
				$('#comment-container-e' + $container).find('input[name="comment-attachment"]').val('');
			}
			if(callback['process'] == 0){
				$('#comment-box-e' + $container).removeAttr('readonly');
				Ossn.MessageBox('syserror/unknown');
			}
			$('#comment-box-e' + $container).attr('contenteditable', true);
			$('#comment-box-e' + $container).html("");
			Ossn.trigger_callback('comment', 'entity:callback', {
				guid: $container,
				response: callback,
			});
		}
	});
};
Ossn.CommentMenu = function($id){
	$element = $($id).find('.menu-links');
	if($element.is(":not(:visible)")){
		$element.show();
		$($id).find('.drop-down-arrow').attr('style', 'display:block;');
	} else {
		$element.hide();
		$($id).find('.drop-down-arrow').attr('style', '');
	}
};

function ossn_comment_delete_handler(){
	$(document).ready(function(){
		$(document).delegate('.ossn-delete-comment', 'click', function(e){
			e.preventDefault();
			$comment = $(this);
			$url = $comment.attr('href');
			$comment_id = Ossn.UrlParams('comment', $url);

			Ossn.PostRequest({
				url: $url,
				action: false,
				beforeSend: function(){
					$('#comments-item-' + $comment_id).attr('style', 'opacity:0.6;');
				},
				callback: function(callback){
					if(callback == 1){
						$('#comments-item-' + $comment_id).fadeOut().remove();
					}
					if(callback == 0){
						$('#comments-item-' + $comment_id).attr('style', 'opacity:0.6;');
					}
					Ossn.trigger_callback('comment', 'delete:callback', {
						id: $comment_id,
						response: callback,
					});					
				}
			});
		});
	});
}
Ossn.CommentImage = function($container, $ftype){
	if($ftype == 'post'){
		$ftype = 'p';
	}
	if($ftype == 'entity'){
		$ftype = 'e';
	}
	$(document).ready(function(){
		$("#ossn-comment-image-file-" + $ftype + "" + $container).on('change', function(event){
			event.preventDefault();
			var formData = new FormData($('#ossn-comment-attachment-' + $ftype + '' + $container)[0]);
			$.ajax({
				url: Ossn.site_url + 'comment/attachment',
				type: 'POST',
				data: formData,
				async: true,
				beforeSend: function(){
					$('#ossn-comment-attachment-' + $ftype + '' + $container).find('.image-data')
						.html('<img src="' + Ossn.site_url + 'components/OssnComments/images/loading.gif" style="width:30px;border:none;height: initial;" />');
					$('#comment-attachment-container-' + $ftype + '' + $container).show();

				},
				cache: false,
				contentType: false,
				processData: false,
				success: function(callback){
					if(callback['type'] == 1){
						$('#comment-container-' + $ftype + '' + $container).find('input[name="comment-attachment"]').val(callback['file']);
						$('#ossn-comment-attachment-' + $ftype + '' + $container).find('.image-data')
							.html('<img src="' + Ossn.site_url + 'comment/staticimage?image=' + callback['file'] + '" />');
					}
					if(callback['type'] == 0){
						$('#comment-container-' + $ftype + '' + $container).find('input[name="comment-attachment"]').val('');
						$('#comment-attachment-container-' + $ftype + '' + $container).hide();
						Ossn.MessageBox('syserror/unknown');
					}
					Ossn.trigger_callback('comment', 'attachment:image:callback', {
						guid: $container,
						type: $ftype,
						response: callback,
					});
				},
			});

		});
	});

};
function ossn_comment_edit(){
	$(document).ready(function(){
		$('body').delegate('.ossn-edit-comment', 'click', function(){
			var $dataguid = $(this).attr('data-guid');
			Ossn.MessageBox('comment/edit/' + $dataguid);
		});
		//comment edit
		Ossn.ajaxRequest({
			url: Ossn.site_url + "action/comment/edit",
			containMedia: true,
			form: '#ossn-comment-edit-form',
			beforeSend: function(){
				$('#ossn-comment-edit-form').find('textarea').hide();
				$('#ossn-comment-edit-form').append('<div class="ossn-loading ossn-box-loading"></div>');
			},
			callback: function(callback){
				if(callback['success']){
					$text = $('#ossn-comment-edit-form').find('#comment-edit').val();
					$guid = $('#ossn-comment-edit-form').find('input[name="guid"]').val();
					$elem = $("#comments-item-" + $guid).find('.comment-contents').find('.comment-text:first');
					if($elem){
						$elem.text('');
						Ossn.PostRequest({
							url: Ossn.site_url + "action/comment/embed",
							// params: 'content=' + $text,
							// make '+' characters work
							// see https://stackoverflow.com/questions/1373414/ajax-post-and-plus-sign-how-to-encode
							params: 'content=' + encodeURIComponent($text) + '&guid=' + $guid,
							callback: function(return_data){
								$elem.append(return_data['data']);
								Ossn.trigger_callback('comment', 'edit:callback', {
									guid: $guid,
									response: return_data,
								});								
							}
						});
					}
					Ossn.trigger_message(callback['success']);
				}
				if(callback['error']){
					Ossn.trigger_message(callback['error'], 'error');
				}
				Ossn.MessageBoxClose();
			}
		});
		//comment-edit />									
	});
}
function ossn_comment_init(){
	$(document).ready(function(){
		$('body').delegate('.comment-post', 'click', function(){
			var $guid = $(this).attr('data-guid');
			if($guid){
				$("#comment-box-p" + $guid).focus();
			}
		});
		$('body').delegate('.comment-entity', 'click', function(){
			var $guid = $(this).attr('data-guid');
			if($guid){
				$("#comment-box-e" + $guid).focus();
			}
		});
	});
}
//<script>
/**
 * Open Source Social Network
 *
 * @package   Open Source Social Network
 * @author    Open Social Website Core Team <info@softlab24.com>
 * @copyright (C) SOFTLAB24 LIMITED
 * @license   Open Source Social Network License (OSSN LICENSE)  http://www.opensource-socialnetwork.org/licence
 * @link      https://www.opensource-socialnetwork.org/
 */
Ossn.ViewLikes = function($post, $type) {
    if (!$type) {
        $type = 'post';
    }
    Ossn.MessageBox('likes/view?guid=' + $post + '&type=' + $type);
};

Ossn.PostUnlike = function(post) {
    Ossn.PostRequest({
        url: Ossn.site_url + 'action/post/unlike',
        beforeSend: function() {
            $('#ossn-like-' + post).html('<img src="' + Ossn.site_url + 'components/OssnComments/images/loading.gif" />');
        },
        params: '&post=' + post,
        callback: function(callback) {
            if (callback['done'] !== 0) {
                $('#ossn-like-' + post).html(callback['button']);
                $('#ossn-like-' + post).attr('data-reaction', 'Ossn.PostLike(' + post + ', "<<reaction_type>>");');
				$('#ossn-like-' + post).removeAttr('onclick'); 
				//reactions
				$parent = $('#ossn-like-' + post).parent().parent().parent();				
				if(callback['container']){
						$parent.find('.like-share').remove();
						$parent.find('.menu-likes-comments-share').after(callback['container']);
				}
				if(!callback['container']){
						$parent.find('.like-share').remove();	
				}				
            } else {
                $('#ossn-like-' + post).html(Ossn.Print('unlike'));
            }
        },
    });

};
Ossn.PostLike = function(post, $reaction_type = '') {
    Ossn.PostRequest({
        url: Ossn.site_url + 'action/post/like',
        beforeSend: function() {
            $('#ossn-like-' + post).html('<img src="' + Ossn.site_url + 'components/OssnComments/images/loading.gif" />');
        },
        params: '&post=' + post + '&reaction_type='+$reaction_type,
        callback: function(callback) {
            if (callback['done'] !== 0) {
                $('#ossn-like-' + post).html(callback['button']);
                $('#ossn-like-' + post).attr('onClick', 'Ossn.PostUnlike(' + post + ');');
				$('#ossn-like-' + post).removeAttr('data-reaction'); 
				//reactions				
				if(callback['container']){
						$parent = $('#ossn-like-' + post).parent().parent().parent();
						$parent.find('.like-share').remove();
						$parent.find('.menu-likes-comments-share').after(callback['container']);
				}
            } else {
                $('#ossn-like-' + post).html(Ossn.Print('like'));
            }
        },
    });

};

Ossn.EntityUnlike = function(entity) {
    Ossn.PostRequest({
        url: Ossn.site_url + 'action/post/unlike',
        beforeSend: function() {
            $('#ossn-elike-' + entity).html('<img src="' + Ossn.site_url + 'components/OssnComments/images/loading.gif" />');
        },
        params: '&entity=' + entity,
        callback: function(callback) {
            if (callback['done'] !== 0) {
                $('#ossn-elike-' + entity).html(callback['button']);
                $('#ossn-elike-' + entity).attr('data-reaction', 'Ossn.EntityLike(' + entity + ', "<<reaction_type>>");');
				$('#ossn-elike-' + entity).removeAttr('onclick'); 
				//reactions				
				$parent = $('#ossn-elike-' + entity).parent().parent().parent();				
				if(callback['container']){
						$parent.find('.like-share').remove();
						$parent.find('.menu-likes-comments-share').after(callback['container']);
				}
				if(!callback['container']){
						$parent.find('.like-share').remove();	
				}
            } else {
                $('#ossn-elike-' + entity).html(Ossn.Print('unlike'));
            }
        },
    });

};
Ossn.EntityLike = function(entity, $reaction_type = '') {
    Ossn.PostRequest({
        url: Ossn.site_url + 'action/post/like',
        beforeSend: function() {
            $('#ossn-elike-' + entity).html('<img src="' + Ossn.site_url + 'components/OssnComments/images/loading.gif" />');
        },
        params: '&entity=' + entity + '&reaction_type='+$reaction_type,
        callback: function(callback) {
            if (callback['done'] !== 0) {
                $('#ossn-elike-' + entity).html(callback['button']);
                $('#ossn-elike-' + entity).attr('onClick', 'Ossn.EntityUnlike(' + entity + ');');
				$('#ossn-elike-' + entity).removeAttr('data-reaction'); 
				//reactions				
				if(callback['container']){
						$parent = $('#ossn-elike-' + entity).parent().parent().parent();
						$parent.find('.like-share').remove();
						$parent.find('.menu-likes-comments-share').after(callback['container']);
				}				
            } else {
                $('#ossn-elike-' + post).html(Ossn.Print('like'));
            }
        },
    });

};

Ossn.RegisterStartupFunction(function() {								  
    $(document).ready(function(){
	var $htmlreactions = '<div class="ossn-like-reactions-panel"> <li class="ossn-like-reaction-like"> <div class="emoji  emoji--like"> <div class="emoji__hand"> <div class="emoji__thumb"></div> </div> </div> </li> <li class="ossn-like-reaction-dislike"> <div class="emoji  emoji--dislike"> <div class="emoji__hand"> <div class="emoji__thumb"></div> </div> </div> </li> <li class="ossn-like-reaction-love"> <div class="emoji  emoji--love"> <div class="emoji__heart"></div> </div> </li> <li class="ossn-like-reaction-haha"> <div class="emoji  emoji--haha"> <div class="emoji__face"> <div class="emoji__eyes"></div> <div class="emoji__mouth"> <div class="emoji__tongue"></div> </div> </div> </div> </li> <li class="ossn-like-reaction-yay"> <div class="emoji  emoji--yay"> <div class="emoji__face"> <div class="emoji__eyebrows"></div> <div class="emoji__mouth"></div> </div> </div> </li> <li class="ossn-like-reaction-wow"> <div class="emoji  emoji--wow"> <div class="emoji__face"> <div class="emoji__eyebrows"></div> <div class="emoji__eyes"></div> <div class="emoji__mouth"></div> </div> </div> </li> <li class="ossn-like-reaction-sad"> <div class="emoji  emoji--sad"> <div class="emoji__face"> <div class="emoji__eyebrows"></div> <div class="emoji__eyes"></div> <div class="emoji__mouth"></div> </div> </div> </li> <li class="ossn-like-reaction-angry"> <div class="emoji  emoji--angry"> <div class="emoji__face"> <div class="emoji__eyebrows"></div> <div class="emoji__eyes"></div> <div class="emoji__mouth"></div> </div> </div> </li> </div>';					   
	$('body').on('click',function(e){
			$class = $(e.target).attr('class');
			//console.log($class);
			if($class && !$(e.target).hasClass('post-control-like') && !$(e.target).hasClass('entity-menu-extra-like') && !$(e.target).hasClass('ossn-like-comment') && !$(e.target).hasClass('ossn-like-reactions-panel')){					
				$('.ossn-like-reactions-panel').remove();
			}
	});
	$MenuReactions = function($elem){
			 $parent = $($elem).parent();
			 $('.ossn-like-reactions-panel').remove(); //remove from all places , remove panel.
			 $onclick = $($elem).attr('data-reaction');
			 if(!$onclick || $parent.find('.ossn-like-reactions-panel').length > 0){
					return false; 
			 }
			 $parent.append($htmlreactions);			 
			 $like	  = $onclick.replace("<<reaction_type>>", 'like');
			 $dislike	  = $onclick.replace("<<reaction_type>>", 'dislike');
			 $love	  = $onclick.replace("<<reaction_type>>", 'love');
			 $haha	  = $onclick.replace("<<reaction_type>>", 'haha');
			 $yay	  = $onclick.replace("<<reaction_type>>", 'yay');
			 $wow	  = $onclick.replace("<<reaction_type>>", 'wow');
			 $sad	  = $onclick.replace("<<reaction_type>>", 'sad');
			 $angry	  = $onclick.replace("<<reaction_type>>", 'angry');
			 
			 $parent.find('.ossn-like-reaction-like').attr('onclick', $like);
			 $parent.find('.ossn-like-reaction-dislike').attr('onclick', $dislike);
			 $parent.find('.ossn-like-reaction-love').attr('onclick', $love);
			 $parent.find('.ossn-like-reaction-haha').attr('onclick', $haha);
			 $parent.find('.ossn-like-reaction-yay').attr('onclick', $yay);
			 $parent.find('.ossn-like-reaction-wow').attr('onclick', $wow);
			 $parent.find('.ossn-like-reaction-sad').attr('onclick', $sad);
			 $parent.find('.ossn-like-reaction-angry').attr('onclick', $angry);
   	};
	$("body").on('mouseenter touchstart', '.post-control-like, .entity-menu-extra-like',function(){
			 $MenuReactions($(this));
	});		
	/*** for comments ***/
	$("body ").on('mouseenter touchstart', '.ossn-like-comment', function(){
			 $parent = $(this).parent().parent();
			 $('.ossn-like-reactions-panel').remove(); //remove from all places , remove panel.
			 if($(this).attr('data-type') == 'Unlike' ||  $parent.find('.ossn-like-reactions-panel').length > 0 || !$(this).attr('data-id')){
					return true; 
			 }
			 $parent.append($htmlreactions);
			 $parent.find('.ossn-like-reaction-like')
			 					.addClass('ossn-like-comment-react')
								.attr('data-reaction', 'like')
								.attr('data-id', $(this).attr('data-id'))
								.attr('data-type', 'Like')
								.attr('href', $(this).attr('href'));
			 $parent.find('.ossn-like-reaction-dislike')
			 					.addClass('ossn-like-comment-react')
								.attr('data-reaction', 'dislike')
								.attr('data-id', $(this).attr('data-id'))
								.attr('data-type', 'Like')
								.attr('href', $(this).attr('href'));								
			 $parent.find('.ossn-like-reaction-love')
			 					.addClass('ossn-like-comment-react')
								.attr('data-reaction', 'love')
								.attr('data-id', $(this).attr('data-id'))
								.attr('data-type', 'Like')
								.attr('href', $(this).attr('href'));
								
			 $parent.find('.ossn-like-reaction-haha')
			 					.addClass('ossn-like-comment-react')
								.attr('data-reaction', 'haha')
								.attr('data-id', $(this).attr('data-id'))
								.attr('data-type', 'Like')
								.attr('href', $(this).attr('href'));
								
			 $parent.find('.ossn-like-reaction-yay')
			 					.addClass('ossn-like-comment-react')
								.attr('data-reaction', 'yay')
								.attr('data-id', $(this).attr('data-id')).
								attr('data-type', 'Like')
								.attr('href', $(this).attr('href'));
								
			 $parent.find('.ossn-like-reaction-wow')
			 					.addClass('ossn-like-comment-react')
								.attr('data-reaction', 'wow')
								.attr('data-id', $(this).attr('data-id'))
								.attr('data-type', 'Like')
								.attr('href', $(this).attr('href'));
								
			 $parent.find('.ossn-like-reaction-sad')
			 					.addClass('ossn-like-comment-react')
								.attr('data-reaction', 'sad')
								.attr('data-id', $(this).attr('data-id'))
								.attr('data-type', 'Like')
								.attr('href', $(this).attr('href'));
								
			 $parent.find('.ossn-like-reaction-angry')
			 					.addClass('ossn-like-comment-react')
								.attr('data-reaction', 'angry')
								.attr('data-id', $(this).attr('data-id'))
								.attr('data-type', 'Like')
								.attr('href', $(this).attr('href'));
	});			
    $(document).delegate('.ossn-like-comment-react, .ossn-like-comment', 'click', function(e) {
            e.preventDefault();
            var $item = $(this);
            var $type = $.trim($item.attr('data-type'));
            var $url = $item.attr('href');
			if($(this).attr('class') == 'ossn-like-comment' && $type == 'Like'){
				return false;	
			}
            Ossn.PostRequest({
                url: $url,
                action: false,
				params: '&reaction_type='+$item.attr('data-reaction'),
                beforeSend: function() {
                    $item.html('<img src="' + Ossn.site_url + 'components/OssnComments/images/loading.gif" />');
                },
                callback: function(callback) {
                    if (callback['done'] == 1) {
                        $total_guid = Ossn.UrlParams('annotation', $url);
                        $total = $('.ossn-total-likes-' + $total_guid).attr('data-likes');
                        if ($type == 'Like') {
                            $('#ossn-like-comment-'+$total_guid).html(Ossn.Print('unlike'));
                            $('#ossn-like-comment-'+$total_guid).attr('data-type', 'Unlike');                            
                           
						    var unlike = $url.replace("like", "unlike");
                            $('#ossn-like-comment-'+$total_guid).attr('href', unlike);
                            
							$total_likes = $total;
                            
							/**$total_likes++;
                            $('.ossn-total-likes-' + $total_guid).attr('data-likes', $total_likes);
                            $('.ossn-total-likes-' + $total_guid).html('<i class="fa fa-thumbs-up"></i>' + $total_likes); */
							$('.ossn-like-reactions-panel').remove(); //remove from all places , remove panel.
                        }
                        if ($type == 'Unlike') {
                           $('#ossn-like-comment-'+$total_guid).html(Ossn.Print('like'));
                            $('#ossn-like-comment-'+$total_guid).attr('data-type', 'Like');                            
                            var like = $url.replace("unlike", "like");
							
                           $('#ossn-like-comment-'+$total_guid).attr('href', like);
                           
						   /*if ($total > 1) {
                                $like_remove = $total;
                                0
                                $like_remove--;
                                $('.ossn-total-likes-' + $total_guid).attr('data-likes', $like_remove);
                                $('.ossn-total-likes-' + $total_guid).html('<i class="fa fa-thumbs-up"></i>' + $like_remove);
                            }
                            if ($total == 1) {
                                $('.ossn-total-likes-' + $total_guid).attr('data-likes', 0);
                                $('.ossn-total-likes-' + $total_guid).html('');

                            }*/
                        }
						//update total likes
						if(callback['container']){
								$('#comments-item-'+$total_guid).find('.ossn-likes-annotation-total').remove();
								$('#comments-item-'+$total_guid).find('.ossn-reaction-list').remove();
								$('#comments-item-'+$total_guid).find('.comment-metadata').append(callback['container']);
						}						
                    }
                    if (callback['done'] == 0) {
                        if ($type == 'Like') {
                            $('#ossn-like-comment-'+$total_guid).html(Ossn.Print('like'));
                            $('#ossn-like-comment-'+$total_guid).attr('data-type', 'Like');
                            Ossn.MessageBox('syserror/unknown');
                        }
                        if ($type == 'Unlike') {
                            $('#ossn-like-comment-'+$total_guid).html(Ossn.Print('unlike'));
                            $('#ossn-like-comment-'+$total_guid).attr('data-type', 'Unlike');
                            Ossn.MessageBox('syserror/unknown');
                        }
                    }
                },
            });
        });
    });
});
/**
 * 	Open Source Social Network
 *
 * @package   (softlab24.com).ossn
 * @author    OSSN Core Team <info@softlab24.com>
 * @copyright (C) SOFTLAB24 LIMITED
 * @license   Open Source Social Network License (OSSN LICENSE)  http://www.opensource-socialnetwork.org/licence 
 * @link      https://www.opensource-socialnetwork.org/
 */
//<script>
Ossn.RegisterStartupFunction(function() {
    $(document).ready(function() {
        $('#ossn-add-album').click(function() {
            Ossn.MessageBox('album/add');
        });
        $('#album-add').click(function() {
            Ossn.MessageBox('album/add');
        });
        $('body').on('click', '#ossn-photos-edit-album', function(){
			$guid = $(this).attr('data-guid');
            Ossn.MessageBox("album/edit/"+$guid);
        });		
        $('#ossn-add-photos').click(function() {
            $dataurl = $(this).attr('data-url');
            Ossn.MessageBox('photos/add' + $dataurl);
        });
        $("#ossn-photos-show-gallery").click(function(e) {
            	e.preventDefault();
            	$(".ossn-gallery").eq(0).trigger("click");
        })
        if($('.ossn-gallery').length){
	        $(".ossn-gallery").fancybox();
        }
        $('body').delegate('#ossn-photos-add-button-inner', 'click', function(e){
        	e.preventDefault();
		$('.ossn-photos-add-button').find('input').click();
        });
	$('body').delegate('.ossn-photos-add-button input', 'change', function(e){
		$length = $(this)[0].files.length;
		$('.ossn-photos-add-button').find('.images').show();
		$('.ossn-photos-add-button').find('.images .count').html($length);
		$('#ossn-photos-add-button-inner').blur();
	});
    });
});
//<script>
/**
 * 	Open Source Social Network
 *
 * @package   (softlab24.com).ossn
 * @author    OSSN Core Team <info@softlab24.com>
 * @copyright (C) SOFTLAB24 LIMITED
 * @license   Open Source Social Network License (OSSN LICENSE)  http://www.opensource-socialnetwork.org/licence
 * @link      https://www.opensource-socialnetwork.org/
 */
Ossn.NotificationBox = function($title, $meta, $type, height, $extra) {
	//trigger notification box again:
  	Ossn.NotificationsCheck();
    
    $extra = $extra || '';
    if (height == '') {
        //height = '540px';
    }
    if ($type) {
        $('.selected').addClass($type);
    }
    if ($title) {
        $('.ossn-notifications-box').show()
        $('.ossn-notifications-box').find('.type-name').html($title+$extra);
    }
    if ($meta) {
        $('.ossn-notifications-box').find('.metadata').html($meta);
        $('.ossn-notifications-box').css('height', height);
    }
};
Ossn.NotificationBoxClose = function() {
    $('.ossn-notifications-box').hide()
    $('.ossn-notifications-box').find('.type-name').html('');
    $('.ossn-notifications-box').find('.metadata').html('<div><div class="ossn-loading ossn-notification-box-loading"></div></div><div class="bottom-all">---</div>');
    //$('.ossn-notifications-box').css('height', '140px');
    $('.selected').attr('class', 'selected');

};
Ossn.NotificationShow = function($div) {
    $($div).attr('onClick', 'Ossn.NotificationClose(this)');
    Ossn.PostRequest({
        url: Ossn.site_url + "notification/notification",
        action:false,
        beforeSend: function(request) {
            Ossn.NotificationBoxClose();
            $('.ossn-notifications-friends').attr('onClick', 'Ossn.NotificationFriendsShow(this)');
            $('.ossn-notifications-messages').attr('onClick', 'Ossn.NotificationMessagesShow(this)');
            Ossn.NotificationBox(Ossn.Print('notifications'), false, 'notifications');
        },
        callback: function(callback) {
            var data = '';
            var height = '';
            if (callback['type'] == 1) {
                data = callback['data'];
               // height = '540px';
            }
            if (callback['type'] == 0) {
                data = callback['data'];
                //height = '100px';
            }
            Ossn.NotificationBox(Ossn.Print('notifications'), data, 'notifications', height,  callback['extra']);
        }
    });
};


Ossn.NotificationClose = function($div) {
    Ossn.NotificationBoxClose();
    $($div).attr('onClick', 'Ossn.NotificationShow(this)');
};

Ossn.NotificationFriendsShow = function($div) {
    $($div).attr('onClick', 'Ossn.NotificationFriendsClose(this)');
    Ossn.PostRequest({
        url: Ossn.site_url + "notification/friends",
        action:false,
        beforeSend: function(request) {
            Ossn.NotificationBoxClose();
            $('.ossn-notifications-notification').attr('onClick', 'Ossn.NotificationShow(this)');
            $('.ossn-notifications-messages').attr('onClick', 'Ossn.NotificationMessagesShow(this)');
            Ossn.NotificationBox(Ossn.Print('friend:requests'), false, 'firends');

        },
        callback: function(callback) {
            var data = '';
            var height = '';
            if (callback['type'] == 1) {
                data = callback['data'];
            }
            if (callback['type'] == 0) {
                data = callback['data'];
                //height = '100px';
            }
            Ossn.NotificationBox(Ossn.Print('friend:requests'), data, 'firends', height);
        }
    });
};


Ossn.NotificationFriendsClose = function($div) {
    Ossn.NotificationBoxClose();
    $($div).attr('onClick', 'Ossn.NotificationFriendsShow(this)');
};

Ossn.AddFriend = function($guid) {
    action = Ossn.site_url + "action/friend/add?user=" + $guid;
    Ossn.ajaxRequest({
        url: action,
        form: '#add-friend-' + $guid,
        action:true,

        beforeSend: function(request) {
            $('#notification-friend-item-' + $guid).find('form').hide();
            $('#ossn-nfriends-' + $guid).append('<div class="ossn-loading"></div>');
        },
        callback: function(callback) {
            if (callback['type'] == 1) {
                $('#notification-friend-item-' + $guid).addClass("ossn-notification-friend-submit");
                $('#ossn-nfriends-' + $guid).addClass('friends-added-text').html(callback['text']);
            }
            if (callback['type'] == 0) {
                $('#notification-friend-item-' + $guid).find('form').show();
                $('#ossn-nfriends-' + $guid).find('.ossn-loading').remove();
            }
            Ossn.NotificationsCheck();
        }
    });
};

Ossn.removeFriendRequset = function($guid) {
    action = Ossn.site_url + "action/friend/remove?user=" + $guid;
    Ossn.ajaxRequest({
        url: action,
        form: '#remove-friend-' + $guid,
        action:true,

        beforeSend: function(request) {
            $('#notification-friend-item-' + $guid).find('form').hide();
            $('#ossn-nfriends-' + $guid).append('<div class="ossn-loading"></div>');
        },
        callback: function(callback) {
            if (callback['type'] == 1) {
                $('#notification-friend-item-' + $guid).addClass("ossn-notification-friend-submit");
                $('#ossn-nfriends-' + $guid).addClass('friends-added-text').html(callback['text']);
            }
            if (callback['type'] == 0) {
                $('#notification-friend-item-' + $guid).find('form').show();
                $('#ossn-nfriends-' + $guid).find('.ossn-loading').remove();
            }
            Ossn.NotificationsCheck();
        }
    });
};

Ossn.NotificationMessagesShow = function($div) {
    $($div).attr('onClick', 'Ossn.NotificationMessagesClose(this)');
    Ossn.PostRequest({
        url: Ossn.site_url + "notification/messages",
        action:false,
        beforeSend: function(request) {
            Ossn.NotificationBoxClose();
            $('.ossn-notifications-notification').attr('onClick', 'Ossn.NotificationShow(this)');
            $('.ossn-notifications-friends').attr('onClick', 'Ossn.NotificationFriendsShow(this)');
	    Ossn.NotificationBox(Ossn.Print('messages'), false, 'messages');
        },
        callback: function(callback) {
            var data = '';
            var height = '';
            if (callback['type'] == 1) {
                data = callback['data'];
                height = '';
            }
            if (callback['type'] == 0) {
                data = callback['data'];
               // height = '100px';
            }
            Ossn.NotificationBox(Ossn.Print('messages'), data, 'messages', height);
        }
    });
};


Ossn.NotificationMessagesClose = function($div) {
    Ossn.NotificationBoxClose();
    $($div).attr('onClick', 'Ossn.NotificationMessagesShow(this)');
};
Ossn.NotificationsCheck = function() {
    Ossn.PostRequest({
        url: Ossn.site_url + "notification/count",
        action:false,
        callback: function(callback) {
            $notification = $('#ossn-notif-notification');
            $notification_count = $notification.find('.ossn-notification-container');

            $friends = $('#ossn-notif-friends');
            $friends_count = $friends.find('.ossn-notification-container');

            $messages = $('#ossn-notif-messages');
            $messages_count = $messages.find('.ossn-notification-container');

            if (callback['notifications'] > 0) {
                $notification_count.html(callback['notifications']);
                $notification.find('.ossn-icon').addClass('ossn-icons-topbar-notifications-new');
                $notification_count.attr('style', 'display:inline-block !important;');
            }
            if (callback['notifications'] <= 0) {
                $notification_count.html('');
                $notification.find('.ossn-icon').removeClass('ossn-icons-topbar-notifications-new');
                $notification.find('.ossn-icon').addClass('ossn-icons-topbar-notification');
                $notification_count.hide();
            }

            if (callback['messages'] > 0) {
                $messages_count.html(callback['messages']);
                $messages.find('.ossn-icon').addClass('ossn-icons-topbar-messages-new');
                $messages_count.attr('style', 'display:inline-block !important;');
            }
            if (callback['messages'] <= 0) {
                $messages_count.html('');
                $messages.find('.ossn-icon').removeClass('ossn-icons-topbar-messages-new');
                $messages.find('.ossn-icon').addClass('ossn-icons-topbar-messages');
                $messages_count.hide();
            }

            if (callback['friends'] > 0) {
                $friends_count.html(callback['friends']);
                $friends.find('.ossn-icon').addClass('ossn-icons-topbar-friends-new');
                $friends_count.attr('style', 'display:inline-block !important;');
            }
            if (callback['friends'] <= 0) {
                $friends_count.html('');
                $friends.find('.ossn-icon').removeClass('ossn-icons-topbar-friends-new');
                $friends.find('.ossn-icon').addClass('ossn-icons-topbar-friends');
                $friends_count.hide();
            }
        }
    });
};
Ossn.RegisterStartupFunction(function() {
    $(document).ready(function() {
    		$('.ossn-topbar-dropdown-menu').click(function(){
                    Ossn.NotificationBoxClose();
        	});
		$(document).on('click','.ossn-notification-mark-read', function(e){
				e.preventDefault();
   				Ossn.PostRequest({
        				url: Ossn.site_url + "action/notification/mark/allread",
        				action:false,
        				beforeSend: function(request) {
							$('.ossn-notification-mark-read').attr('style', 'opacity:0.5;');
 	       				},
        				callback: function(callback) {
           					if(callback['success']){
								Ossn.trigger_message(callback['success']);
							}
							if(callback['error']){
								Ossn.trigger_message(callback['error']);								
							}
							$('.ossn-notification-mark-read').attr('style', '1;');								
        				}
    			 });
		});
    });
});
/**
 * 	Open Source Social Network
 *
 * @package   (softlab24.com).ossn
 * @author    OSSN Core Team <info@softlab24.com>
 * @copyright (C) SOFTLAB24 LIMITED
 * @license   Open Source Social Network License (OSSN LICENSE)  http://www.opensource-socialnetwork.org/licence
 * @link      https://www.opensource-socialnetwork.org/
 */
//<script> 
jQuery.fn.visibleInScroll = function (goDeep) {
    var parent = $(this[0]).scrollParent()[0],
        elRect = this[0].getBoundingClientRect(),
        rects = [ parent.getBoundingClientRect() ];
    elRect = {
        left: elRect.left, 
        top: elRect.top, 
        right: elRect.right, 
        bottom: elRect.bottom,
        width: elRect.width,
        height: elRect.height,
        visibleWidth: elRect.width,
        visibleHeight: elRect.height,
        isVisible: true,
        isContained: true
    };
    var elWidth = elRect.width,
        elHeight = elRect.height;
    if (parent === this[0].ownerDocument) {
        return elRect;
    }
    
    while (parent !== this[0].ownerDocument && parent !== null) {
        if (parent.scrollWidth > parent.clientWidth || parent.scrollHeight > parent.clientHeight) {
            rects.push(parent.getBoundingClientRect());
        }
        if (rects.length && goDeep) { break; }
        parent = $(parent).scrollParent()[0];
    }
    if (!goDeep) {
        rects.length = 1;
    }
    for (var i = 0; i < rects.length; i += 1) {
        var rect = rects[i];
        elRect.left = Math.max(elRect.left, rect.left);
        elRect.top = Math.max(elRect.top, rect.top);
        elRect.right = Math.min(elRect.right, rect.right);
        elRect.bottom = Math.min(elRect.bottom, rect.bottom);
    }
    elRect.visibleWidth = Math.max(0, elRect.right - elRect.left);
    elRect.visibleHeight = elRect.visibleWidth && Math.max(0, elRect.bottom - elRect.top);
    if (!elRect.visibleHeight) { elRect.visibleWidth = 0; }
    elRect.isVisible = elRect.visibleWidth > 0 && elRect.visibleHeight > 0;
    elRect.isContained = elRect.visibleWidth === elRect.width && elRect.visibleHeight === elRect.height;
    return elRect;
}; 
Ossn.MessagesURLparam = function(name, url){
	if(!name || !url){
		return false;	
	}
	//console.log(' url: ' + url);
    // var results = new RegExp('[\?&]' + name + '=([^]*)').exec(url);
	var results = new RegExp('[\?&]' + name + '=([0-9]*)').exec(url);
    if (results == null){
       return null;
    } else{
		//console.log('RESULTS' + JSON.stringify(results));
       return results[1] || false;
    }
};
Ossn.SendMessage = function($user) {
    Ossn.ajaxRequest({
        url: Ossn.site_url + "action/message/send",
        form: '#message-send-' + $user,
        action:true,
        beforeSend: function(request) {
            $('#message-send-' + $user).find('input[type=submit]').hide();
            $('#message-send-' + $user).find('.ossn-loading').removeClass('ossn-hidden');
        },
        callback: function(callback) {
	    if(callback !== '0'){
	          $('#message-append-' + $user).append(callback);
	    }
    	    $('#message-send-' + $user).find('textarea').val('');
       	    $('#message-send-' + $user).find('input[type=submit]').show();
            $('#message-send-' + $user).find('.ossn-loading').addClass('ossn-hidden');
            Ossn.message_scrollMove($user);
        }
    });

};
Ossn.getMessages = function($user, $guid) {
    Ossn.PostRequest({
        url: Ossn.site_url + "messages/getnew/" + $user,
        action: false,
        callback: function(callback) {
            $('#message-append-' + $guid).append(callback);
            if(callback){
            	//Unwanted refresh in message window #416 , there is no need to scroll if no new message.
	            Ossn.message_scrollMove($guid);
            }
        }
    });
};
Ossn.getRecent = function($user) {
    Ossn.PostRequest({
        url: Ossn.site_url + "messages/getrecent/" + $user,
        action: false,
        callback: function(callback) {
            $('#get-recent').html(callback);
            $('#get-recent').addClass('inner');
            $('.messages-from').find('.inner').remove();
            $('#get-recent').appendTo('.messages-from');
            $('#get-recent').show();
        }
    });
};
Ossn.playSound = function() {
    document.getElementById('ossn-chat-sound').play();
};
Ossn.message_scrollMove = function(fid) {
    var message = document.getElementById('message-append-' + fid);
    if (message) {
        message.scrollTop = message.scrollHeight;
        return message.scrollTop;
    }
};
/**<script>*/
$(document).ready(function() {
	$calledOnce = [];
	$('.ossn-messages .messages-recent .messages-from').scroll(function() {
		if ($('.ossn-pagination').visibleInScroll().isVisible) {
			$element = $('.ossn-messages .messages-recent .messages-from .inner .container-table-pagination');
			$next = $element.find('.ossn-pagination .active').next();
			$last = $element.find('.ossn-pagination').find('li:last');
			$last_url = $last.find('a').attr('href');
			$last_offset = Ossn.MessagesURLparam('offset_message_xhr_recent', $last_url);
			var selfElement = $element;
			if ($next) {
				$url = $next.find('a').attr('href');
				$offset = Ossn.MessagesURLparam('offset_message_xhr_recent', $url);
				$url = '?offset_message_xhr_recent=' + $offset;

				//console.log('A R R A Y ' + JSON.stringify($calledOnce));
				//console.log('OFFSET: ' + $offset);
				if ($.inArray($url, $calledOnce) == -1 && $offset > 0) {
					//console.log('BEFORE' + JSON.stringify($calledOnce));
					$calledOnce.push($url); //push to array so we don't need to call ajax request again for processed offset

					Ossn.PostRequest({
						url: Ossn.site_url + 'messages/xhr/recent' + $url,
						beforeSend: function() {
							$('.ossn-messages .messages-recent .messages-from .inner').append('<div class="ossn-messages-pagination-loading"><div class="ossn-loading"></div></div>');
						},
						callback: function(callback) {
							//return false;
							$element = $(callback).find('.inner'); //make callback to jquery object
							if ($element.length) {
								$clone = $element.find('.container-table-pagination').html();
								$element.find('.container-table-pagination').remove(); //remove pagination from contents as we'll replace contents of already existing pagination.

								$('.ossn-messages .messages-recent .messages-from .inner').append($element.html()); //append the new data
								selfElement.html($clone); //set pagination content with new pagination contents
								selfElement.appendTo('.ossn-messages .messages-recent .messages-from .inner'); //append the pagnation back to at end
								$('.ossn-messages .messages-recent .messages-from .inner .ossn-messages-pagination-loading').remove();
								if($offset == $last_offset) {
									$('.ossn-messages .messages-recent .messages-from .inner .container-table-pagination').fadeOut();
								}
							}
							return;
						},
					});
				} //if not in array
			}
		}
	});
});
Ossn.MessageNotifcationPagination = function(event, $calledOnce){
		if ($('.ossn-notification-messages .ossn-pagination').visibleInScroll().isVisible) {
			$element = $('.ossn-notification-messages .container-table-pagination');
			$next = $element.find('.ossn-pagination .active').next();
			$last = $element.find('.ossn-pagination').find('li:last');
			$last_url = $last.find('a').attr('href');
			$last_offset = Ossn.MessagesURLparam('offset_message_xhr_recent', $last_url);
			var selfElement = $element;
			if ($next) {
				$url = $next.find('a').attr('href');
				$offset = Ossn.MessagesURLparam('offset_message_xhr_recent', $url);
				$url = '?offset_message_xhr_recent=' + $offset;

				//console.log('A R R A Y ' + JSON.stringify($calledOnce));
				//console.log('OFFSET: ' + $offset);	
				if ($.inArray($url, $calledOnce) == -1 && $offset > 0) {
					//console.log('BEFORE' + JSON.stringify($calledOnce));
					$calledOnce.push($url); //push to array so we don't need to call ajax request again for processed offset

					Ossn.PostRequest({
						url: Ossn.site_url + 'messages/xhr/notification' + $url,
						beforeSend: function() {
							$('.ossn-notification-messages').append('<div class="ossn-messages-notification-pagination-loading"><div class="ossn-loading"></div></div>');
						},
						callback: function(callback) {
							$element = $(callback).find('.ossn-notification-messages'); //make callback to jquery object
							if ($element.length) {
								$clone = $element.find('.container-table-pagination').html();
								$element.find('.container-table-pagination').remove(); //remove pagination from contents as we'll replace contents of already existing pagination.

								$('.ossn-notification-messages').append($element.html()); //append the new data
								selfElement.html($clone); //set pagination content with new pagination contents
								selfElement.appendTo('.ossn-notification-messages'); //append the pagnation back to at end
								$('.ossn-notification-messages .ossn-messages-notification-pagination-loading').remove();
								if($offset == $last_offset) {
									$('.ossn-notification-messages .container-table-pagination').fadeOut();
								}
							}
							return;
						},
					});
				} //if not in array				
			}
		}
};
$(document).ready(function(e) {
	e.preventDefault;
	// initially, set vars like there's no pagination available on message page loading
	var offset      = 1;
	var old_offset  = offset;
	var last_offset = 0;
	var msg_window  = $('.ossn-messages .ossn-widget .message-with .message-inner');
	var pagination  = $('.ossn-messages .ossn-widget .message-with .message-inner .container-table-pagination');
	if(pagination.length) {
		// if a pagination is found, the next page we're going to load must be page 2
		offset = 2;
		// go find the last page offset, too
		$last = pagination.find('.ossn-pagination').find('li:last');
		$last_url = $last.find('a').attr('href');
		last_offset = Ossn.MessagesURLparam('offset_message_xhr_with', $last_url);
	} else {
		return;
	}
	//  number of pixels to move the scrollbar back after a new page has been loaded
	const SCROLLBAR_ADJUSTMENT = 290;
	//  client_height is the height of visible messages window div definded by css (in this case 400)
	var client_height;
	//  scroll_height is the complete height of messages window div (visible part plus scrolled away part)
	var scroll_height;
	//  scroll_top is the number of pixels the content of a <div> element is scrolled vertically
	var scroll_top;
	//  scroll_pos is the computed absolute position of the scrollbar (0 = bottom end)
	var scroll_pos = 0;
	var old_scroll_pos = 0;
	
	//  some vars for handling xhr inserted new messages
	const MAX_MESSAGES_PER_LOAD = 10;
	var messages_loaded;
	var messages_displayed;
	var messages_xhr_inserted;
	
	msg_window.scroll(function(event) {
		event.stopImmediatePropagation();
		client_height  = parseInt(msg_window[0].clientHeight);
		scroll_height  = parseInt(msg_window[0].scrollHeight);
		scroll_top     = parseInt(msg_window[0].scrollTop);
		scroll_pos     = scroll_height - client_height - scroll_top;
		old_scroll_pos = scroll_height - client_height; // max old scroll position (topmost bar position)
		
		if (scroll_pos >= old_scroll_pos && offset > old_offset && offset <= last_offset) {
			// start loading next page only if scrollbar is reaching the top position and next page available
			// console.log('scrollTopMax: ', scroll_height - client_height, ' scroll_top: ', scroll_top, ' scroll_height: ', scroll_height, ' page: ' , offset, ' scroll_pos: ', scroll_pos, ' client_height: ',client_height);
			old_scroll_pos = scroll_pos;
			old_offset     = offset;
			
			// verify whether new messages have been inserted meanwhile
			// based on the fact that each complete message page we're currently looking at
			// comes with 10 records already loaded, any difference must give us the number of newly inserted messages
			// so get the number of theoretical possible records (10 * page number) first
			messages_loaded = (offset - 1) * MAX_MESSAGES_PER_LOAD;
			// and then get the real number of displayed messages
			messages_displayed  = msg_window.find("[id^=message-item-]").length;
			// this way messages_xhr_inserted comes true if there is a difference
			messages_xhr_inserted = messages_displayed - messages_loaded;
			// the tricky part:
			// since 1 newly xhr inserted message will result in an out-of-sync pagination view by 1 position
			// one record of the waiting to be added bunch must be a duplicate that needs to be removed
			// thus in the end not 10 records will be added, but only 9.
			// so when returning here, we're back to a clean multiple of 10 without rest
			// the difference is 0 and messages_xhr_inserted will become false again
			// the logic is working correctly even across page boundaries
			// i.e. with 43 new messages we would get 4 page loads without adding anything (4 * 10 messages removed)
			// plus the fifths page adding 7 messages, bringing us in sync finally 
			// console.log('MSG_LOADED: ', messages_loaded, ' MSG_DISPALYED: ', messages_displayed, ' UNPROCESSED: ', messages_xhr_inserted);
			
			$url = '?offset_message_xhr_with=' + offset;
			$user_guid = msg_window.attr('data-guid');
			Ossn.PostRequest({
				url: Ossn.site_url + 'messages/xhr/with' + $url + '&guid=' + $user_guid,
				beforeSend: function() {
					msg_window.prepend('<div class="ossn-messages-with-pagination-loading"><div class="ossn-loading"></div></div>').fadeIn();
				},
				callback: function(callback) {
					$element = $(callback).find('.message-inner'); //make callback to jquery object
					if ($element.length) {
						offset++;

						// we need to check last_offset here again
						// because it will increase if the chat partner has sent more than 10 new messages in the meantime
						$last = $element.find('.ossn-pagination').find('li:last');
						$last_url = $last.find('a').attr('href');
						// so update last_offset
						last_offset = Ossn.MessagesURLparam('offset_message_xhr_with', $last_url);
						// console.log('LAST_OFFSET: ', last_offset);

						// Actually, ANY newly inserted message will change the database pagination 'view'
						// resulting in already displayed records to be fetched again
						// so we need to find and remove duplicate message records in $element
						// before appending the block to the message window (see #1393 for example)
						if(messages_xhr_inserted) {
							var messages = $element.find("[id^=message-item-]");
							// loop through ready to be appended records and search for duplicates
							for (var i = 0; i < messages.length; i++) {
								var msg_id = $(messages[i]).attr('id');
								if(msg_window.find('#' + msg_id).length) {
									// this message is already shown in message window - don't display in twice
									// so remove it from the block to be appended
									$element.find('#' + msg_id).remove();
									// console.log('REMOVED: ', msg_id);
								}
							}
						}

						$clone = $element.find('.container-table-pagination').html();
						$element.find('.container-table-pagination').remove(); //remove pagination from contents as we'll replace contents of already existing pagination.
						msg_window.prepend($element.html()); //append the new data
						pagination.html($clone); //set pagination content with new pagination contents
						pagination.prependTo(msg_window); //append the pagnation back to at end
					}
					msg_window.find('.ossn-messages-with-pagination-loading').remove();
					if(offset > last_offset) {
							// last page reached, remove blank pagination part above oldest message on top
							pagination.remove();
					} else {
							// next page available
							// move the scrollbar a little backward to get some headrooom to scroll up again and trigger loading
							msg_window.animate({scrollTop: SCROLLBAR_ADJUSTMENT}, 0);
					}
				},
			});
		}
	});
});
Ossn.RegisterStartupFunction(function() {
    $(document).ready(function() {
		$('body').on('click', '.ossn-message-delete', function(e){
				var id = $(this).attr('data-id');
				Ossn.MessageBox('messages/delete?id=' + id);
		});
		Ossn.ajaxRequest({
                    form: '#ossn-message-delete-form',
					url: Ossn.site_url+'action/message/delete',
					beforeSend: function(){
							$('#ossn-message-delete-form').html('<div class="ossn-loading"></div>');	
					},
                    callback: function(callback) {
                        if (callback['status'] == true){
							var $parent = $('#message-item-'+callback['id']);
                            
							if(callback['type'] == 'all'){
								$parent = $parent.find('.message-box-sent');
								$text = "<i class='fa fa-times-circle'></i>" + Ossn.Print('ossnmessages:deleted');
                                $parent.find('span').html($text);
								$parent.find('.time-created').hide();
                                $parent.addClass('ossn-message-deleted');
                                Ossn.MessageBoxClose();
                            }
							if(callback['type'] == 'me'){
								Ossn.MessageBoxClose();
								$parent.css({'opacity': 0.5});
								setTimeout(function(){
									$parent.fadeOut('slow').remove();					
								}, 1000);
							}
                        } else {
							Ossn.MessageBoxClose();	
						}
				}
        });		
        $('body').on('click', '.ossn-message-deletes', function(e) {
            e.preventDefault();
            $text = "<i class='fa fa-times-circle'></i>" + Ossn.Print('ossnmessages:deleted');
            $self   = $(this);
			$parent = $(this).parent();
            $action = $(this).attr('href');
            if ($action) {
                Ossn.PostRequest({
                    url: $action,
                    action: false,
                    callback: function(callback) {
                        if (callback == 1) {
							console.log($parent.attr('class'));
                            if ($parent.hasClass('message-box-sent')) {
                                $parent.find('span').html($text);
								$parent.find('.time-created').hide();
                                $parent.addClass('ossn-message-deleted');
                                $self.remove();
                            }
                        }
                    }
                });
            }
        });
    });
});
$(document).ready(function() {
	var $MessageNotifcationPagination = [];	
	$('body').on('click', '#ossn-notif-messages', function(){
			$MessageNotifcationPagination = [];	//reset the array on reopening the messages box
	});
	document.addEventListener('scroll',function(event){
        var $elm = $(event.target);
		if($elm.attr('class') == 'messages-inner' && $elm.parent().parent().hasClass('ossn-notifications-box')){
				Ossn.MessageNotifcationPagination(event, $MessageNotifcationPagination);
		}
		
	},true);	
});
//<script>
Ossn.RegisterStartupFunction(function() {
	$(document).ready(function() {
		$('#ossn-group-add').click(function() {
			Ossn.MessageBox('groups/add');
		});
	});
});
Ossn.RegisterStartupFunction(function() {
	$(document).ready(function() {
		$("#group-upload-cover").submit(function(event) {
			event.preventDefault();
			var formData = new FormData($(this)[0]);
			var $url = Ossn.site_url + 'action/group/cover/upload';
			var fileInput = $('#group-upload-cover').find("input[type='file']")[0],
				file = fileInput.files && fileInput.files[0];

			if (file) {
				var img = new Image();

				img.src = window.URL.createObjectURL(file);

				img.onload = function() {
					var width = img.naturalWidth,
						height = img.naturalHeight;

					window.URL.revokeObjectURL(img.src);
					if (width < 1040 || height < 300) {
						Ossn.trigger_message(Ossn.Print('profile:cover:err1:detail'), 'error');
						return false;
					} else {
						$.ajax({
							url: Ossn.AddTokenToUrl($url),
							type: 'POST',
							data: formData,
							async: true,
							beforeSend: function(xhr, obj) {
								if ($('.ossn-group-cover').length == 0) {
									$('.header-users').attr('style', 'opacity:0.7;');
								} else {
									$('.ossn-group-cover').attr('style', 'opacity:0.7;');
								}
								$('.ossn-group-profile').find('.groups-buttons').find('a').hide();
								$('.ossn-group-cover').prepend('<div class="ossn-covers-uploading-annimation"> <div class="ossn-loading"></div></div>');
							},
							cache: false,
							contentType: false,
							processData: false,
							success: function(callback) {
								if (callback['type'] == 1) {
									if ($('.ossn-group-cover').length == 0) {
										location.reload();
									} else {
										$('.ossn-group-cover').attr('style', '');
										$('.ossn-covers-uploading-annimation').remove();
										$('.ossn-group-profile').find('.groups-buttons').find('a').show();
										$('.ossn-group-cover').find('img').attr('style', '');
										$('.ossn-group-cover').find('img').show();
										$('.ossn-group-cover').find('img').attr('src', callback['url']);
									}
								}
								if (callback['type'] == 0) {
									Ossn.MessageBox('syserror/unknown');
								}
							}
						});
					}
				};
			}
			return false;
		});

		$('#add-cover-group').click(function(e) {
			e.preventDefault();
			$('#group-upload-cover').find('.coverfile').click();
		});
	});
});

Ossn.RegisterStartupFunction(function() {
	$(document).ready(function() {
		$('#reposition-group-cover').click(function() {
			$('.group-c-position').attr('style', 'display:inline-block !important;');
			$('.ossn-group-cover-button').hide();
			$('.ossn-group-cover').unbind('mouseenter').unbind('mouseleave');
			Ossn.Drag();
		});
	});
});

Ossn.RegisterStartupFunction(function() {
	$(document).ready(function() {
		$('.ossn-group-cover').hover(function() {
			$('.ossn-group-cover-button').show();
		}, function() {
			$('.ossn-group-cover-button').hide();
		});
	});
});

Ossn.repositionGroupCOVER = function($group) {
	var cover_top  = parseInt($('.ossn-group-cover').find('img').css('top'));
	var cover_left = parseInt($('.ossn-group-cover').find('img').css('left'));
	var $url = Ossn.site_url + "action/group/cover/reposition";
	$.ajax({
		async: true,
		type: 'post',
		data: '&top=' + cover_top + '&left=' + cover_left + '&group=' + $group,
		url: Ossn.AddTokenToUrl($url),
		success: function(callback) {
			$("#draggable").draggable('destroy');
			$('.group-c-position').attr('style', 'display:none !important;');
			$('.ossn-group-cover').hover(function() {
				$('.ossn-group-cover-button').show();
			}, function() {
				$('.ossn-group-cover-button').hide();
			});
		},
	});
};
							
Ossn.RegisterStartupFunction(function() {
	$(document).ready(function() {
		$('.ossn-group-change-owner').click(function(e) {
			e.preventDefault();
			var new_owner = $(this).attr('data-new-owner');
			var is_admin  = $(this).attr('data-is-admin');
			if (is_admin) {
				var del = confirm(Ossn.Print('group:memb:make:owner:admin:confirm', [new_owner]));
			} else {
				var del = confirm(Ossn.Print('group:memb:make:owner:confirm', [new_owner]));
			}
			if (del == true) {
				var actionurl = $(this).attr('href');
				window.location = actionurl;
			}
		});
	});
});
Ossn.RegisterStartupFunction(function() {

	$(document).ready(function() {

		var EmojiiArray = {
			"emoticons": ["1f600", "1f603", "1f604", "1f601", "1f606", "1f605", "1f923", "1f602", "1f642", "1f643", "1f609", "1f60a", "1f607", "1f970", "1f60d", "1f929", "1f618", "1f617", "1f61a", "1f619", "1f60b", "1f61b", "1f61c", "1f92a", "1f61d", "1f911", "1f917", "1f92d", "1f92b", "1f914", "1f910", "1f928", "1f610", "1f611", "1f636", "1f60f", "1f612", "1f644", "1f62c", "1f925", "1f60c", "1f614", "1f62a", "1f924", "1f634", "1f637", "1f912", "1f915", "1f922", "1f92e", "1f927", "1f975", "1f976", "1f974", "1f635", "1f92f", "1f920", "1f973", "1f60e", "1f913", "1f9d0", "1f615", "1f61f", "1f641", "1f62e", "1f62f", "1f632", "1f633", "1f97a", "1f626", "1f627", "1f628", "1f630", "1f625", "1f622", "1f62d", "1f631", "1f616", "1f623", "1f61e", "1f613", "1f629", "1f62b", "1f971", "1f624", "1f621", "1f620", "1f92c", "1f608", "1f47f", "1f480", "1f4a9", "1f921", "1f479", "1f47a", "1f47b", "1f47d", "1f47e", "1f916", "1f63a", "1f638", "1f639", "1f63b", "1f63c", "1f63d", "1f640", "1f63f", "1f63e", "1f648", "1f649", "1f64a", "1f476", "1f466", "1f467", "1f468", "1f469", "1f474", "1f475", "1f46e", "1f575", "1f482", "1f477", "1f934", "1f478", "1f473", "1f472", "1f471", "1f935", "1f470", "1f930", "1f47c", "1f385", "1f936", "1f64d", "1f64e", "1f645", "1f646", "1f481", "1f64b", "1f647", "1f926", "1f937", "1f486", "1f487", "1f6b6", "1f3c3", "1f483", "1f57a", "1f46f", "1f6c0", "1f6cc", "1f574", "1f5e3", "1f464", "1f465", "1f93a", "1f3c7", "26f7", "1f3c2", "1f3cc", "1f3c4", "1f6a3", "1f3ca", "26f9", "1f3cb", "1f6b4", "1f6b5", "1f3ce", "1f3cd", "1f938", "1f93c", "1f93d", "1f93e", "1f939", "1f46b", "1f46c", "1f46d", "1f48f", "1f491", "1f46a", "1f933", "1f4aa", "1f448", "1f449", "261d", "1f446", "1f595", "1f447", "270c", "1f91e", "1f596", "1f918", "1f919", "1f590", "270b", "1f44c", "1f44d", "1f44e", "270a", "1f44a", "1f91b", "1f91c", "1f91a", "1f44b", "270d", "1f44f", "1f450", "1f64c", "1f64f", "1f91d", "1f485", "1f442", "1f443", "1f463", "1f440", "1f441", "1f445", "1f444", "1f48b", "1f498", "2764", "1f493", "1f494", "1f495", "1f496", "1f497", "1f499", "1f49a", "1f49b", "1f49c", "1f5a4", "1f90d", "1f49d", "1f49e", "1f49f", "2763", "1f48c", "1f4a4", "1f4a2", "1f4a3", "1f4a5", "1f4a6", "1f4a8", "1f4ab", "1f4ac", "1f5e8", "1f5ef", "1f4ad", "1f573", "1f453", "1f576", "1f454", "1f455", "1f456", "1f457", "1f458", "1f459", "1f45a", "1f45b", "1f45c", "1f45d", "1f6cd", "1f392", "1f45e", "1f45f", "1f460", "1f461", "1f462", "1f451", "1f452", "1f3a9", "1f393", "26d1", "1f4ff", "1f484", "1f48d", "1f48e"],
			"animals": ["1f435", "1f412", "1f98d", "1f9a7", "1f436", "1f415", "1f429", "1f43a", "1f98a", "1f431", "1f408", "1f981", "1f42f", "1f405", "1f406", "1f434", "1f40e", "1f984", "1f98c", "1f42e", "1f402", "1f403", "1f404", "1f437", "1f416", "1f417", "1f43d", "1f40f", "1f411", "1f410", "1f42a", "1f42b", "1f418", "1f98f", "1f42d", "1f401", "1f400", "1f439", "1f430", "1f407", "1f43f", "1f987", "1f43b", "1f428", "1f43c", "1f43e", "1f983", "1f414", "1f413", "1f423", "1f424", "1f425", "1f426", "1f427", "1f54a", "1f985", "1f986", "1f989", "1f438", "1f40a", "1f422", "1f98e", "1f40d", "1f432", "1f409", "1f433", "1f40b", "1f42c", "1f41f", "1f420", "1f421", "1f988", "1f419", "1f41a", "1f980", "1f990", "1f991", "1f40c", "1f98b", "1f41b", "1f41c", "1f41d", "1f41e", "1f577", "1f578", "1f982", "1f490", "1f338", "1f4ae", "1f3f5", "1f339", "1f940", "1f33a", "1f33b", "1f33c", "1f337", "1f331", "1f332", "1f333", "1f334", "1f335", "1f33e", "1f33f", "2618", "1f340", "1f341", "1f342", "1f343"],
			"food": ["1f374", "1f347", "1f348", "1f349", "1f34a", "1f34b", "1f34c", "1f34d", "1f34e", "1f34f", "1f350", "1f351", "1f352", "1f353", "1f95d", "1f345", "1f951", "1f346", "1f954", "1f955", "1f33d", "1f336", "1f952", "1f344", "1f95c", "1f330", "1f35e", "1f950", "1f956", "1f95e", "1f9c0", "1f356", "1f357", "1f953", "1f354", "1f35f", "1f355", "1f32d", "1f32e", "1f32f", "1f959", "1f95a", "1f373", "1f958", "1f372", "1f957", "1f37f", "1f371", "1f358", "1f359", "1f35a", "1f35b", "1f35c", "1f35d", "1f360", "1f362", "1f363", "1f364", "1f365", "1f361", "1f366", "1f367", "1f368", "1f369", "1f36a", "1f382", "1f370", "1f36b", "1f36c", "1f36d", "1f36e", "1f36f", "1f37c", "1f95b", "2615", "1f375", "1f376", "1f37e", "1f377", "1f378", "1f379", "1f37a", "1f37b", "1f942", "1f943", "1f37d", "1f944", "1f52a", "1f3fa"],
			"travelplaces": ["1f30d", "1f30e", "1f30f", "1f310", "1f5fa", "1f5fe", "1f3d4", "26f0", "1f30b", "1f5fb", "1f3d5", "1f3d6", "1f3dc", "1f3dd", "1f3de", "1f3df", "1f3db", "1f3d7", "1f3d8", "1f3da", "1f3e0", "1f3e1", "1f3e2", "1f3e3", "1f3e4", "1f3e5", "1f3e6", "1f3e8", "1f3e9", "1f3ea", "1f3eb", "1f3ec", "1f3ed", "1f3ef", "1f3f0", "1f492", "1f5fc", "1f5fd", "26ea", "1f54c", "1f54d", "26e9", "1f54b", "26f2", "26fa", "1f301", "1f303", "1f3d9", "1f304", "1f305", "1f306", "1f307", "1f309", "2668", "1f30c", "1f3a0", "1f3a1", "1f3a2", "1f488", "1f3aa", "1f682", "1f683", "1f684", "1f685", "1f686", "1f687", "1f688", "1f689", "1f68a", "1f69d", "1f69e", "1f68b", "1f68c", "1f68d", "1f68e", "1f690", "1f691", "1f692", "1f693", "1f694", "1f695", "1f696", "1f697", "1f698", "1f699", "1f69a", "1f69b", "1f69c", "1f6b2", "1f6f4", "1f6f5", "1f68f", "1f6e3", "1f6e4", "1f6e2", "26fd", "1f6a8", "1f6a5", "1f6a6", "1f6d1", "1f6a7", "2693", "26f5", "1f6f6", "1f6a4", "1f6f3", "26f4", "1f6e5", "1f6a2", "2708", "1f6e9", "1f6eb", "1f6ec", "1f4ba", "1f681", "1f69f", "1f6a0", "1f6a1", "1f6f0", "1f680", "1f6ce"],
			"activities": ["231a", "231b", "23f3", "23f0", "23f1", "23f2", "1f55b", "1f567", "1f550", "1f55c", "1f551", "1f55d", "1f552", "1f55e", "1f553", "1f55f", "1f554", "1f560", "1f555", "1f561", "1f556", "1f562", "1f557", "1f563", "1f558", "1f564", "1f559", "1f565", "1f55a", "1f566", "1f311", "1f312", "1f313", "1f314", "1f315", "1f316", "1f317", "1f318", "1f319", "1f31a", "1f31b", "1f31c", "1f321", "2600", "1f31d", "1f31e", "2b50", "1f31f", "1f320", "2601", "26c5", "26c8", "1f324", "1f325", "1f326", "1f327", "1f328", "1f329", "1f32a", "1f32b", "1f32c", "1f300", "1f308", "1f302", "2602", "26f1", "26a1", "2744", "2603", "26c4", "2604", "1f525", "1f4a7", "1f30a", "26bd", "26be", "1f3c0", "1f3d0", "1f3c8", "1f3c9", "1f3be", "1f3b3", "1f3cf", "1f3d1", "1f3d2", "1f3d3", "1f3f8", "1f94a", "1f94b", "1f945", "26f3", "26f8", "1f3a3", "1f3bd", "1f3bf", "1f3af", "1f3b1", "1f52e", "1f3ae", "1f579", "1f3b0", "1f3b2", "2660", "2665", "2666", "2663", "1f0cf", "1f004", "1f3b4", "1f3ad", "1f5bc", "1f3a8", "1f396", "1f3c6", "1f3c5", "1f947", "1f948", "1f949"],
			"objects": ["2699", "1f508", "1f509", "1f50a", "1f4e2", "1f4e3", "1f4ef", "1f514", "1f3bc", "1f3b5", "1f3b6", "1f399", "1f39a", "1f39b", "1f3a4", "1f3a7", "1f4fb", "1f3b7", "1f3b8", "1f3b9", "1f3ba", "1f3bb", "1f941", "1f4f1", "1f4f2", "260e", "1f4de", "1f4df", "1f4e0", "1f50b", "1f50c", "1f4bb", "1f5a5", "1f5a8", "2328", "1f5b1", "1f5b2", "1f4bd", "1f4be", "1f4bf", "1f4c0", "1f3a5", "1f39e", "1f4fd", "1f3ac", "1f4fa", "1f4f7", "1f4f8", "1f4f9", "1f4fc", "1f50d", "1f50e", "1f56f", "1f4a1", "1f526", "1f3ee", "1f4d4", "1f4d5", "1f4d6", "1f4d7", "1f4d8", "1f4d9", "1f4da", "1f4d3", "1f4d2", "1f4c3", "1f4dc", "1f4c4", "1f4f0", "1f5de", "1f4d1", "1f516", "1f3f7", "1f4b0", "1f4b4", "1f4b5", "1f4b6", "1f4b7", "1f4b8", "1f4b3", "1f4b9", "1f4b1", "1f4b2", "2709", "1f4e7", "1f4e8", "1f4e9", "1f4e4", "1f4e5", "1f4e6", "1f4eb", "1f4ea", "1f4ec", "1f4ed", "1f4ee", "1f5f3", "270f", "2712", "1f58b", "1f58a", "1f58c", "1f58d", "1f4dd", "1f4bc", "1f4c1", "1f4c2", "1f5c2", "1f4c5", "1f4c6", "1f5d2", "1f5d3", "1f4c7", "1f4c8", "1f4c9", "1f4ca", "1f4cb", "1f4cc", "1f4cd", "1f4ce", "1f587", "1f4cf", "1f4d0", "2702", "1f5c3", "1f5c4", "1f5d1", "1f512", "1f513", "1f50f", "1f510", "1f511", "1f5dd", "1f528", "26cf", "2692", "1f6e0", "1f5e1", "2694", "1f52b", "1f3f9", "1f6e1", "1f527", "1f529", "1f5dc", "2696", "1f517", "26d3", "2697", "1f52c", "1f52d", "1f4e1", "1f489", "1f48a", "1f6aa", "1f6cf", "1f6cb", "1f6bd", "1f6bf", "1f6c1", "1f6d2", "1f6ac", "26b0", "26b1", "1f5ff", "1f383", "1f384", "1f386", "1f387", "2728", "1f388", "1f389", "1f38a", "1f38b", "1f38d", "1f38e", "1f38f", "1f390", "1f391", "1f380", "1f381", "1f397", "1f39f", "1f3ab"],
			"symbols": ["1f6ae", "1f6b0", "267f", "1f6b9", "1f6ba", "1f6bb", "1f6bc", "1f6be", "1f6c2", "1f6c3", "1f6c4", "1f6c5", "26a0", "1f6b8", "26d4", "1f6ab", "1f6b3", "1f6ad", "1f6af", "1f6b1", "1f6b7", "1f4f5", "1f51e", "1f507", "1f515", "2622", "2623", "2b06", "2197", "27a1", "2198", "2b07", "2199", "2b05", "2196", "2195", "2194", "21a9", "21aa", "2934", "2935", "1f503", "1f504", "1f519", "1f51a", "1f51b", "1f51c", "1f51d", "1f6d0", "269b", "1f549", "2721", "2638", "262f", "271d", "2626", "262a", "262e", "1f54e", "1f52f", "2648", "2649", "264a", "264b", "264c", "264d", "264e", "264f", "2650", "2651", "2652", "2653", "26ce", "1f500", "1f501", "1f502", "25b6", "23e9", "23ed", "23ef", "25c0", "23ea", "23ee", "1f53c", "23eb", "1f53d", "23ec", "23f8", "23f9", "23fa", "23cf", "1f3a6", "1f505", "1f506", "1f4f6", "1f4f3", "1f4f4", "2640", "2642", "2695", "267b", "269c", "1f531", "1f4db", "1f530", "2b55", "2705", "2611", "2714", "2716", "274c", "274e", "2795", "2796", "2797", "27b0", "27bf", "303d", "2733", "2734", "2747", "203c", "2049", "2753", "2754", "2755", "2757", "3030", "00a9", "00ae", "2122", "1f4af", "1f520", "1f521", "1f522", "1f523", "1f524", "1f170", "1f18e", "1f171", "1f191", "1f192", "1f193", "2139", "1f194", "24c2", "1f195", "1f17e", "1f197", "1f17f", "1f198", "1f199", "1f19a", "1f201", "1f202", "1f237", "1f236", "1f22f", "1f250", "1f239", "1f21a", "1f232", "1f251", "1f238", "1f234", "1f233", "3297", "3299", "1f23a", "1f235", "25aa", "25ab", "25fb", "25fc", "25fd", "25fe", "2b1b", "2b1c", "1f536", "1f537", "1f538", "1f539", "1f53a", "1f53b", "1f4a0", "1f518", "1f532", "1f533", "26aa", "26ab", "1f534", "1f535", "1f3c1", "1f6a9", "1f38c", "1f3f4", "1f3f3", "1f3e7"]
		};

		// A. append multi-purpose emoji container to end of document
		// **********************************************************
		$('body').append('<div id="master-moji"><input type="hidden" id="master-moji-anchor" value=""><div class="dropdown emojii-container-main"> <div class="emojii-container" data-active="emoticons"> <ul class="nav nav-tabs"></ul> </div> </div> </div>');

		// add emojis to container above
		$.each(EmojiiArray, function(key, data) {
			firstele = data[0];
			$('.emojii-container').find('.nav-tabs').append("<li class='ossn-emojii-tab' data-type='" + key + "'><a class='emojii' href='javascript:void(0);'>&#x" + firstele + ";</a></li>");
			$('.emojii-container').append("<div class='emojii-list emojii-list-" + key + "'></div>");
			$.each(data, function(k, d) {
				$('.emojii-list-' + key).append("<li class='emojii' data-val='" + d + "'>&#x" + d + ";</li>");
			});
		});

		// switch between emoji group tabs in container
		$('body').on('click', '.ossn-emojii-tab', function(e) {
			e.preventDefault();
			type = $(this).attr('data-type');
			$('.emojii-list').hide();
			$('.emojii-list-' + type).show();
		});


		// B. add clickable smiley icon to several input fields
		// ****************************************************

		// 1. comment
		// the button/icon is added now using ossn_extend_view('comments/attachment/buttons', 'smilies/comment/button'); to avoid the issue for dynamically loaded posts/comments $arsalanshah

		// 2. wall post
		// inserted as registered menu item in Ossn_com

		// 3. messages page:
		if ($('.message-form-form').length) {
			$('<div class="ossn-message-attach-photo"><i class="fa fa-smile-o"></i></div>').prependTo('.message-form-form .controls');
		}

		// 4. chatbox
		// inserted by OssnChat component

		// 5. textareas managed by tinymce
		// done by additional button in editor (initialized by TextareaSupport component)

		// 6. textareas managed by summernote
		// done by additional button in editor (initialized by Forum component)


		// C. open emoji box from several page locations
		// *********************************************

		// 1. comment
		$('body').on('click', '.ossn-comment-attach-photo .fa-smile-o', function(e) {
			$parent = $(this).parent().parent().parent();
			Ossn.OpenEmojiBox('#' + $parent.find('.comment-box').attr('id'));
		});

		// 2. wall post
		$('body').on('click', '.ossn-wall-container-control-menu-emojii-selector', function(e) {
			Ossn.OpenEmojiBox('.ossn-wall-container-data textarea');
		});

		// 3. message
		$('body').on('click', '.ossn-message-attach-photo .fa-smile-o', function(e) {
			Ossn.OpenEmojiBox('.message-form-form textarea');
		});

		// 4. chatbox
		// handled by 'OnClick' in Chat component

		// 5. tinymce
		// by click on toolbar button

		// 6. summernote
		// by click on toolbar button

		Ossn.OpenEmojiBox = function(anchor) {
			if ($('#master-moji .emojii-container-main').is(":hidden")) {
				$('#master-moji-anchor').val(anchor);
				$('#master-moji .emojii-container-main').show();
			} else {
				$('#master-moji-anchor').val('');
				$('#master-moji .emojii-container-main').hide();
			}
		}

		// D. insert emoji depending on anchor
		// ***********************************
		$('body').on('click', '#master-moji .emojii-list li', function(e) {
			e.preventDefault();
			var type = $(this).html();
			var anchor = $('#master-moji-anchor').val();
			var element = $(anchor);

			// 1. comments need different handling
			if (anchor.substring(0, 12) == '#comment-box') {
				var tmp1 = $(element).html();
				var tmp2 = tmp1 + " " + type;
				$(element).html(tmp2);
			}
			// 2. wall post, 3. messages and 4. chatbox 
			else {
				var tmp1 = $(element).val();
				var tmp2 = tmp1 + " " + type;
				$(element).val(tmp2);
			}
			// 5. textareas managed by tinymce
			if (anchor == '.ossn-editor') {
				// tinymce is automatically adding an id to the textarea it's involved with (based on the name of the textarea)
				element = $('.ossn-editor').attr('id');
				// using this id we can retrieve the instance of tinymce and use its insertContent method
				tinymce.get(element).insertContent(' ' + type);
			}
			// 6. textareas managed by summernote
			if (anchor == '#forum-editor') {
				// since summernote is losing the cursor position when the emoji container opens, we need to restore it here
				$(anchor).summernote('editor.restoreRange');
				$(anchor).summernote('editor.focus');
				$(anchor).summernote('editor.insertText', ' ' + type);
			}

			// TODO: to avoid too many anchor comparisons here, the classification of editor managed textareas should 
			// be the same all over Ossn in the future

		});
	});
});
$(document).ready(function() {
		
	$('body').append('<div id="sounds"></div>');
		
	if (/android|ipod|iphone|ipad|blackberry|kindle/i.test(navigator.userAgent) && !window.matchMedia('(display-mode: standalone)').matches) {
		// android, iphones and other mobile devices need a least 1 initial click to enable sound
		// thus using cookies to remember a sound state='on' makes no sense
		// because with every new page load a new manual init from off -> on is necessary
		// so we have to start with 'off' in any case, except Ossn is running as PWA 
		if ($('.ossn-chat-windows-long').length) {
			$('#sounds').append('<audio id="ossn-chat-sound" src="" preload="auto"></audio>');
			$('<div class="ossn-chat-pling"><i class="fa fa-bell-slash-o"></i></div>').prependTo('.ossn-chat-windows-long .inner');
			$('<div class="ossn-chat-pling"><i class="fa fa-bell-slash-o"></i></div>').prependTo('.ossn-chat-icon .ossn-chat-inner-text');
		}
		if ($('.message-form-form').length) {
			$('#sounds').append('<audio id="ossn-message-sound" src="" preload="auto"></audio>');
			$('<div class="ossn-message-pling"><i class="fa fa-bell-slash-o"></i></div>').appendTo('.message-form-form .controls');
		}
	}
	else {
		if ($('.ossn-chat-windows-long').length) {
			if (getCookie("ossn_chat_bell") == 'on') {
				$('#sounds').append('<audio id="ossn-chat-sound" src="http://localhost/ossn/components/OssnSounds/audios/pling.mp3" preload="auto"></audio>');
				$('<div class="ossn-chat-pling"><i class="fa fa-bell-o"></i></div>').prependTo('.ossn-chat-windows-long .inner');
				$('<div class="ossn-chat-pling"><i class="fa fa-bell-o"></i></div>').prependTo('.ossn-chat-icon .ossn-chat-inner-text');
			}
			else {
				$('#sounds').append('<audio id="ossn-chat-sound" src="" preload="auto"></audio>');
				$('<div class="ossn-chat-pling"><i class="fa fa-bell-slash-o"></i></div>').prependTo('.ossn-chat-windows-long .inner');
				$('<div class="ossn-chat-pling"><i class="fa fa-bell-slash-o"></i></div>').prependTo('.ossn-chat-icon .ossn-chat-inner-text');
				/* first time usage defaults to off */
				setCookie('ossn_chat_bell', 'off', 30);
			}
		}
		if ($('.message-form-form').length) {
			if (getCookie("ossn_message_bell") == 'on') {
				$('#sounds').append('<audio id="ossn-message-sound" src="http://localhost/ossn/components/OssnSounds/audios/pling.mp3" preload="auto"></audio>');
				$('<div class="ossn-message-pling"><i class="fa fa-bell-o"></i></div>').appendTo('.message-form-form .controls');
			}
			else {
				$('#sounds').append('<audio id="ossn-message-sound" src="" preload="auto"></audio>');
				$('<div class="ossn-message-pling"><i class="fa fa-bell-slash-o"></i></div>').appendTo('.message-form-form .controls');
				setCookie('ossn_message_bell', 'off', 30);
			}	
		}
	}
		
	$(".ossn-chat-pling").click(function(e) {
		e.stopImmediatePropagation();
		player = $('#ossn-chat-sound').get(0);
		pling  = 'http://localhost/ossn/components/OssnSounds/audios/pling.mp3';
		bell   = $('.ossn-chat-pling').find('i');
		// sound is off - turn it on
		if (bell.hasClass('fa fa-bell-slash-o')) {
			bell.removeClass('fa fa-bell-slash-o');
			player.src = pling;
			player.play();
			bell.addClass('fa fa-bell-o');
			setCookie('ossn_chat_bell', 'on', 30);
		}
		// sound is on - turn it off
		else {
			player.src = '';
			bell.removeClass('fa fa-bell-o');
			bell.addClass('fa fa-bell-slash-o');
			setCookie('ossn_chat_bell', 'off', 30);
		}
	});

	$(".ossn-message-pling").click(function(e) {
		player = $('#ossn-message-sound').get(0);
		pling  = 'http://localhost/ossn/components/OssnSounds/audios/pling.mp3';
		bell   = $('.ossn-message-pling').find('i');
		// sound is off - turn it on
		if (bell.hasClass('fa fa-bell-slash-o')) {
			bell.removeClass('fa fa-bell-slash-o');
			player.src = pling;
			player.play();
			bell.addClass('fa fa-bell-o');
			setCookie('ossn_message_bell', 'on', 30);
		}
		// sound is on - turn it off
		else {
			player.src = '';
			bell.removeClass('fa fa-bell-o');
			bell.addClass('fa fa-bell-slash-o');
			setCookie('ossn_message_bell', 'off', 30);
		}
	});
	
});


Ossn.ChatplaySound = function() {
	var bell = document.getElementById('ossn-chat-sound');
	if(bell.readyState) {
		bell.play();
	}
};
Ossn.MessageplaySound = function() {
	var bell = document.getElementById('ossn-message-sound');
	if(bell.readyState) {
		bell.play();
	}
};

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
} 

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
} 
//<script>
Ossn.register_callback('ossn', 'init', 'ossn_auto_pagination');
Ossn.isInViewPort = function($params){
	var params = $params['params'];
	var callback = $params['callback'];
	if(!params){
		params = {};
	}
	if(!callback){
		callback = function(){};
	}
	$($params['element']).scrolling(params);
	$($params['element']).on('scrollin', callback);
};
Ossn.AutoPaginationURLparam = function(name, url){
	if(!name || !url){
		return false;
	}
	//console.log(' url: ' + url);
	// var results = new RegExp('[\?&]' + name + '=([^]*)').exec(url);
	var results = new RegExp('[\?&]' + name + '=([0-9]*)').exec(url);
	if(results == null){
		return null;
	} else {
		//console.log('RESULTS' + JSON.stringify(results));
		return results[1] || false;
	}
};
function ossn_auto_pagination(){
	$(document).ready(function(){
		$calledOnce = [];
		$('.user-activity .ossn-pagination li').css({
			"visibility": "hidden"
		});

		//[B] AutoPagination didnt set any URL query to next request #1682
		$currenturlparams = Ossn.ParseUrl(window.location.href);
		$currentUrlQuery = '';
		if($currenturlparams['query'] && $currenturlparams['query'] != ''){
			//because in $url we using ?offset that means it will sent request on current page, 
			//what if there are other args set in url ? 
			//we need to send those paramters to next request too.
			$removeOffset = $currenturlparams['query'].split('&');
			if($removeOffset){
				$.each($removeOffset, function(k, v){
					if(v.includes('offset')){
						$removeOffset.splice(k, 1);
						return false;

					}
				});
			}
			$currentUrlQuery = $removeOffset.join('&');
			if($currentUrlQuery != ''){
				$currentUrlQuery = '&' + $currentUrlQuery;
			}
		}
		Ossn.isInViewPort({
			element: '.user-activity .ossn-pagination',
			callback: function(event, $all_elements){
				$next = $(this).find('.active').next();
				$last = $(this).find('li:last');
				var selfElement = $(this);
				if($next){
					$actual_next_url = $next.find('a').attr('href');
					$url = $actual_next_url;
					$offset = Ossn.AutoPaginationURLparam('offset', $url);
					$url = '?offset=' + $offset + $currentUrlQuery;
					//compute offset of 'Last' tab the same way for later comparison
					$last_url = $last.find('a').attr('href');
					$last_offset = Ossn.AutoPaginationURLparam('offset', $last_url);
					if($.inArray($url, $calledOnce) == -1 && $offset > 0){
						$calledOnce.push($url); //push to array so we don't need to call ajax request again for processed offset
						Ossn.PostRequest({
							action: false,
							url: $actual_next_url,
							beforeSend: function(){
								$('.user-activity .ossn-pagination').append('<div class="ossn-loading"></div>');
							},
							callback: function(callback){
								$element = $(callback).find('.user-activity'); //make callback to jquery object
								if($element.length){
									$clone = $element.find('.ossn-pagination').html();
									$element.find('.ossn-pagination').remove(); //remove pagination from contents as we'll replace contents of already existing pagination.
									$('.user-activity').append($element.html()); //append the new data
									selfElement.html($clone); //set pagination content with new pagination contents
									selfElement.appendTo('.user-activity .container-table-pagination .center-row'); //append the pagnation back to at end
									$('.user-activity .ossn-pagination li').css({
										"visibility": "hidden"
									});

									if($offset != $last_offset){
										// we're still somewhere in the middle of the newsfeed
										// so remove any paginator from former pages, but keep last one, because OssnWall insert needs a unique! anchor
										$('.user-activity .container-table-pagination').not(':last').remove();
									} else {
										// newsfeed end has reached, we don't need a paginator anymore
										$('.user-activity .container-table-pagination').remove();
									}
								}
								return;
							},
						});
					} else {
						//if not in array
						//$('.user-activity .container-table-pagination').remove();
					}
				}
			},
		});
	});
}
//<script>
$(document).ready(function(){
	 $(document).on('focus', '.friend-tab-item input', function(){
		$id = $(this).attr('id').split("-").pop();
		$status = {
                url: Ossn.site_url+'action/message/typing/status/save?status=yes&subject_guid='+$id,
                action: true,
                callback: function(){}
        };
		Ossn.PostRequest($status);
		
	 });
	 $(document).on('blur', '.friend-tab-item input', function(){
 		$id = $(this).attr('id').split("-").pop();
		$status = {
                url: Ossn.site_url+'action/message/typing/status/save?status=no&subject_guid='+$id,
                action: true,
                callback: function(){}
        };
		Ossn.PostRequest($status);		
	});						   
});//<script>
$.fn.isInViewComments = function() {
	var win = $(window);

	var viewport = {
		top: win.scrollTop(),
		left: win.scrollLeft()
	};
	viewport.right = viewport.left + win.width();
	viewport.bottom = viewport.top + win.height();

	var bounds = this.offset();
	if (!bounds) {
		return false;
	}
	bounds.right = bounds.left + this.outerWidth();
	bounds.bottom = bounds.top + this.outerHeight();

	return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

};
$(document).ready(function() {
	var comment_typing_send;
	$('body').on('focus', '.comment-box', function() {
		$btype = false;
		if ($(this).parent().parent().find('input[name="post"]').length) {
			$guid = $(this).parent().parent().find('input[name="post"]').val();
			$btype = 'post';
		}
		if ($(this).parent().parent().find('input[name="entity"]').length) {
			$guid = $(this).parent().parent().find('input[name="entity"]').val();
			$btype = 'entity';
		}
		if (!$btype) {
			return false;
		}
		var $status = {
			url: Ossn.site_url + 'action/rtcomments/setstatus?type=' + $btype + '&guid=' + $guid,
			action: true,
			callback: function() {}
		};
		Ossn.PostRequest($status);
		comment_typing_send = setInterval(function() {
			Ossn.PostRequest($status);
		}, 3000);
	});
	$('body').on('blur', '.comment-box', function() {
		if ($(this).parent().parent().find('input[name="post"]').length) {
			$btype = 'post';
		}
		if ($(this).parent().parent().find('input[name="entity"]').length) {
			$btype = 'entity';
		}
		clearInterval(comment_typing_send);
	});
});
Ossn.commentTyping = function($guid, $type) {
	//Ossn <5.3 we don't know eather the comment list is for entities comments or the posts comments
	//so we need to add unique id for post/entity
	$addids = $(".ctyping-" + $type + "-" + $guid);
	$firstlist = $addids.parent().children(':first');
	if ($firstlist.length) {
		$firstclass = $firstlist.attr('class');
		if ($firstclass.indexOf('ossn-comments-list') >= 0) {
			if (!$firstlist.hasClass("ossn-comments-list-" + $type.charAt(0) + "" + $guid)) {
				$firstlist.addClass("ossn-comments-list-" + $type.charAt(0) + "" + $guid);
			}
		}
	}
	var $cguid = $guid;
	var $ctype = $type;
	var $elem = $('.ctyping-' + $ctype + '-' + $cguid);
	var $timestamp = $('.ctyping-' + $ctype + '-' + $cguid).attr('data-time');

	var $status = {
		url: Ossn.site_url + 'action/rtcomments/status?guid=' + $cguid + '&type=' + $ctype,
		action: true,
		callback: function(callback) {
			if (callback['status'] == 'typing') {
				$elem.find('.ctyping-c-item').fadeIn('slow');
			} else {
				$elem.find('.ctyping-c-item').fadeOut('slow');
			}
			if (callback['lists'] != '') {
				for(i=0;i < callback['lists'].length;i++){
					$id = $($.parseHTML(callback['lists'][i])).attr('id');
					$id = $id.replace(/[^0-9]/g, "");
					if($id && $('#comments-item-'+$id).length == 0){
						$(".ossn-comments-list-" + $type.charAt(0) + "" + $guid).append(callback['lists'][i]).fadeIn();	
					}
				}
			}
		}
	};
	setInterval(function() {
		if ($('.ctyping-' + $ctype + '-' + $cguid).isInViewComments()) {
			if ($(".ossn-comments-list-" + $type.charAt(0) + "" + $guid).find('.comments-item').length) {
				var $ids = new Array();
				$($(".ossn-comments-list-" + $type.charAt(0) + "" + $guid).find('.comments-item')).each(function() {
					$ids.push($(this).attr('id').replace('comments-item-', ''));
				});
				//console.log($ids.join(','));
				$status['params'] = '&comments_ids=' + $ids.join(',') + '&timestamp=' + $timestamp;
			}
			Ossn.PostRequest($status);
		} else {
			$elem.find('.ctyping-c-item').fadeOut('slow');
		}
	}, 4000);
};
//<script>
$(document).ready(function(){
		var $listsbg = [{"name":"pbg1","url":"http:\/\/localhost\/ossn\/components\/OssnPostBackground\/images\/1.jpg","color_hex":"#fff"},{"name":"pbg2","url":"http:\/\/localhost\/ossn\/components\/OssnPostBackground\/images\/2.jpg","color_hex":"#fff"},{"name":"pbg3","url":"http:\/\/localhost\/ossn\/components\/OssnPostBackground\/images\/3.jpg","color_hex":"#fff"},{"name":"pbg4","url":"http:\/\/localhost\/ossn\/components\/OssnPostBackground\/images\/4.jpg","color_hex":"#fff"},{"name":"pbg5","url":"http:\/\/localhost\/ossn\/components\/OssnPostBackground\/images\/5.jpg","color_hex":"#fff"},{"name":"pbg6","url":"http:\/\/localhost\/ossn\/components\/OssnPostBackground\/images\/6.jpg","color_hex":"#fff"},{"name":"pbg7","url":"http:\/\/localhost\/ossn\/components\/OssnPostBackground\/images\/7.jpg","color_hex":"#333"},{"name":"pbg8","url":"http:\/\/localhost\/ossn\/components\/OssnPostBackground\/images\/8.jpg","color_hex":"#333"},{"name":"pbg9","url":"http:\/\/localhost\/ossn\/components\/OssnPostBackground\/images\/9.jpg","color_hex":"#333"},{"name":"pbg10","url":"http:\/\/localhost\/ossn\/components\/OssnPostBackground\/images\/10.jpg","color_hex":"#333"},{"name":"pbg11","url":"http:\/\/localhost\/ossn\/components\/OssnPostBackground\/images\/11.jpg","color_hex":"#333"}];
		if($('.ossn-wall-container-data').length){
				$('<div id="ossn-wall-postbg" style="display:none;"></div>').insertAfter('.ossn-wall-container-data textarea');
				$.each($listsbg, function(){
					$('#ossn-wall-postbg').append('<span class="" data-postbg-type="'+this['name']+'" style="background:url(\''+this['url']+'\'";background-position: center; background-size: cover;"></div>');
				});
				$('#ossn-wall-form').append('<input class="postbg-input" name="postbackground_type" type="hidden"/>');
		}
		$('body').on('click', '.ossn-wall-container-control-menu-postbg-selector', function(){
				$('.ossn-wall-container-data div').each(function(){
						$id = $(this).attr('id');
						if($id && $id.indexOf('ossn-wall-') >= 0){
								$(this).hide();
						}	
				});
				if($('#ossn-wall-postbg').attr('data-toggle') == 0 || !$('#ossn-wall-postbg').attr('data-toggle')){
					$('#ossn-wall-postbg').attr('data-toggle', 1);
					$('#ossn-wall-postbg').show();
				} else {
					
					$('.ossn-wall-container-data .postbg-container').attr('style', '');
     					$('.ossn-wall-container-data textarea').removeClass('postbg-container');
					if($('.postbg-input').length){
						$('.postbg-input').val('');
					}
					
					$('#ossn-wall-postbg').attr('data-toggle', 0);
					$('#ossn-wall-postbg').hide();
				}
		});
 		$('.ossn-wall-container-data textarea').keyup(function(){
   				var length = $.trim(this.value).length;
				if(length > 125) {
					$('.ossn-wall-container-data .postbg-container').attr('style', '');
     				$('.ossn-wall-container-data textarea').removeClass('postbg-container');
					if($('.postbg-input').length){
						$('.postbg-input').val('');
					}
    			}
		});		
		$('body').on('click', '#ossn-wall-postbg span', function(){
					$type = $(this).attr('data-postbg-type');	
					var i = 0;
					for(i=0;i<=$listsbg.length;i++){
							if($listsbg[i]['name'] == $type){
								$('.ossn-wall-container-data textarea').addClass('postbg-container');
								$('.ossn-wall-container-data .postbg-container').css({
											'background': 'url("'+$listsbg[i]['url']+'")',
											'background-position': 'center',
											'background-size': 'cover',
											'color': $listsbg[i]['color_hex'],
								});
								$('.postbg-input').val($type);
								break;	
							}
					}
		});
		$(document).ajaxComplete(function(event, xhr, settings) {
			var $url = settings.url;
			$pagehandler = $url.replace(Ossn.site_url, '');
			
			if($pagehandler.indexOf('action/wall/post/a') >= 0 || $pagehandler.indexOf('action/wall/post/g') >= 0 || $pagehandler.indexOf('action/wall/post/u') >= 0 || $pagehandler.indexOf('action/wall/post/bpage') >= 0){
					$('.ossn-wall-container-data .postbg-container').attr('style', '');
     				$('.ossn-wall-container-data textarea').removeClass('postbg-container');
					if($('.postbg-input').length){
						$('.postbg-input').val('');
					}
					//hide panel
					$('.ossn-wall-container-data div').each(function(){
						$id = $(this).attr('id');
						if($id && $id.indexOf('ossn-wall-') >= 0){
								$(this).hide();
						}
					});					
			}
			if($pagehandler.indexOf('wall/post/embed') >= 0){
					$data = settings.data;
					$listsdata = $data.split('&');
					if($listsdata.length > 0){
						$.each($listsdata, function($key, $value){
							if($value.indexOf('guid=') >=0){
									$guid = $value.replace('guid=', '');
									$element = $('#activity-item-'+$guid);
									if($element.length && $element.find('.postbg-container')){
											$text = $element.find('.postbg-container').text();
											if($text && $text.length > 125){
												$element.find('.postbg-container').removeClass('postbg-container').attr('style', '');
												$element.find('.postbg-text').removeClass('postbg-text');
											}
									}
							}
						});
					}
			}
		});		
});
//<script>
Ossn.RegisterStartupFunction(function() {
	$(document).ready(function() {
			$('body').on('click', '.menubuilder-icon-select', function(){
				 	$('.menu-builder-icons-selected').removeClass('menu-builder-icons-selected');
					if(!$(this).hasClass('menu-builder-icons-selected')){
							$(this).addClass('menu-builder-icons-selected');	
							$('input[name="icon_name"').val($(this).attr('data-icon'));
							$('input[name="icon_unicode"').val($(this).attr('data-key'));
					}
			});
			$('body').on('click', '#menu-builder-next', function(){
						$('.menubuilder-main-form').addClass("hidden");
						$('.menu-builder-icons').removeClass('hidden');
			});		
			$('body').on('change', '#menu-select-type', function(){
					$type = $(this).val();											 
					Ossn.PostRequest({
               			 url: Ossn.site_url+'menubuilder/submenu?type='+$type,
               			 beforeSend: function(request) {
                  				  $('.menu-select-sub').html('<div class="ossn-loading-menubuilder"></div>');
                		},
                		callback: function(callback) {
                  				if(callback){
										$('.menu-select-sub').html(callback);	
								}
               			 }
           			 });
			});	
			$replaceIcons = function($element){
      					$val = $(this).text();
						$icon = $(this).attr('data-menubuilder-icon');
      					$text = $val.charAt(0).toUpperCase() + $val.slice(1);
      					$(this).html('<i class="fa '+$icon+'"></i>'+$text);																
			};
			$('.menubuilder-item-topbar-admin').each($replaceIcons);
			$('.menubuilder-item-admin-sidemenu').each($replaceIcons);
			$('[class*=menu-topbar-dropdown-menubuilder]').each($replaceIcons);
			$('.menubuilder-item-footer').each($replaceIcons);
	});
});
