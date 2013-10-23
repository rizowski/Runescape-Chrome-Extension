  $.ajaxSetup({
      datatype: 'json',
      cache: true,
      headers: {
        dataType : "json"
    }
    });
var extension, query;

window.RsExtension = {};
extension = window.RsExtension;

extension.QueryTool = {};
query = extension.QueryTool;

query.item_url = "http://services.runescape.com/m=itemdb_rs/api/catalogue/detail.json?item=";
query.category_url = "http://services.runescape.com/m=itemdb_rs/api/catalogue/category.json?category=";
query.category_price_url = "http://services.runescape.com/m=itemdb_rs/api/catalogue/items.json?category=";
query.graphing_url = "http://services.runescape.com/m=itemdb_rs/api/graph/";

query.item = function(_itemId, successClbk){
  var full_url = this.item_url + _itemId;
    return $.ajax({
      url: full_url,
      type: 'GET',
      statusCode:{
        401 : function(){
          console.log('Auth Error');
        },
        404 : function(){
          console.log('Page not found');
        },
        500 : function(){
          console.log('Server error');
        }
      },
      success: function(data){
        var response = JSON.parse(data);
        var item = response.item;
        query.getImg(item.icon, function(blob, request_url){
          item.icon = blob;
          successClbk(item);
        });
      }
    });
}
query.getImg = function(_url, callback){
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function() {
    console.log(_url);
    callback(window.webkitURL.createObjectURL(xhr.response), _url);
  }
  xhr.open('GET', _url, true);
  xhr.send();
}

// query.category = function(_categoryId, _callback){
//   var full_url = this.category_url + _categoryId;
//     return $.ajax({
//       url: full_url,
//       type: 'GET',
//       statusCode:{
//         401 : function(){
//           console.log('Auth Error');
//         },
//         404 : function(){
//           console.log('Page not found');
//         },
//         500 : function(){
//           console.log('Server error');
//         }
//       },
//       success: function(data){
//         callback(data);
//       }
//     });
// }

query.categoryPrice = function(_categoryId, _search, _callback){
  var full_url = this.category_price_url + _categoryId +"&alpha=" + _search;
    return $.ajax({
      url: full_url,
      type: 'GET',
      statusCode:{
        401 : function(){
          console.log('Auth Error');
        },
        404 : function(){
          console.log('Page not found');
        },
        500 : function(){
          console.log('Server error');
        }
      },
      success: function(data){
        var response = JSON.parse(data);
        items = response.items;
        console.log(items);
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          var url = item.icon;
          query.getImg(url, function(blob, request_url){
            console.log(blob);
            item.icon = blob;
            _callback(item);
          });
        };
      }
    });
}
query.itemGraph = function(_itemId){
  var full_url = this.graphing_url + _itemId + ".json";
    return $.ajax({
      url: full_url,
      type: 'GET',
      statusCode:{
        401 : function(){
          console.log('Auth Error');
        },
        404 : function(){
          console.log('Page not found');
        },
        500 : function(){
          console.log('Server error');
        }
      }
    });
}

extension.RsItem = {};
extension.RsCategory = {};
extension.RsCharacter = {};
extension.Designer = {};


extension.Designer.addToTable = function(data){
  extension.Designer.table.append("<tr><td><img src='"+ data.icon + "'/></td><td>" + data.name + "</td><td>" + data.description + "</td><td>" + data.today.price + "</td><td></td></tr>");
}

extension.Designer.addMultiple = function(items){
  if(items)
    for (var i = 0; i < items.length; i++) {
      extension.Designer.addToTable(items[i]);
    };
}

$(document).ready(function(){
  extension.Designer.table = $('#content-table');
  // query.category()
  // query.item(2, extension.Designer.addToTable);
  var search = $('#search');
  search.bind('input', function(){
    if(search.val() != (null || "")){
      cat = $('#category')
      query.categoryPrice(cat.val(), search.val(), extension.Designer.addToTable);
    }
    else
      extension.Designer.table.html('');
  });
  // $('#search').keyup(function(key){
    
  // });
});

