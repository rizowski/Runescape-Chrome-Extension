
class Toolz
	
	$.ajaxSetup({
        cache: true
        dataType : "json"
        headers: {
        	"Access-Control-Allow-Origin" : "*"
        }
        # dataFilter : (data, type) ->
        	# JSON.parse(data) if type == "json"
        statusCode: {
        	401 : () ->
        		console.log '(401) Login Required'
        	404 : () ->
        		console.log '(404) Page not found'
        	500 : () ->
        		console.log '(500) Server error'
        }
    })

	constructor: () ->

	

	query: (_url, _type) ->
		_type ?= 'GET'
		return $.ajax
			type: _type
			url: _url
			crossDomain: true

t = new Toolz()
t.query('http://services.runescape.com/m=itemdb_rs/api/catalogue/detail.json?item=2')
	.success data -> 
			console.log(data)
	.error sdff, data, error ->
			console.log(data + " " + error)