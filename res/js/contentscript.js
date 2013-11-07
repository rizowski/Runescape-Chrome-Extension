$.ajaxSetup({
  datatype: 'json',
  cache: true
});
var extension, query, designer, iManager, cache, spinOpts;

// NEEDS to set graph
// Needs to change when everything queries
// Setup better chache process

window.RsExtension = {};
extension = window.RsExtension;
extension.QueryTool = {};
extension.Designer = {};
extension.ItemManager = {};
extension.CacheManager = {};
extension.Toolz = {};

query = extension.QueryTool;
designer = extension.Designer;
iManager = extension.ItemManager;
cache = extension.CacheManager;
toolz = extension.Toolz;

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
        query.getIcon(item, function(blob, item){
          item.icon = blob;
          successClbk(item);
        });
      }
    });
}
query.getIcon = function(_item, callback){
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function() {
    callback(window.webkitURL.createObjectURL(xhr.response), _item);
  }
  xhr.open('GET', _item.icon, true);
  xhr.send();
}
query.getLargeIcon = function(_item, callback){
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function() {
    callback(window.webkitURL.createObjectURL(xhr.response), _item);
  }
  xhr.open('GET', _item.icon_large, true);
  xhr.send();
}
query.categoryPrice = function(_categoryId, _term, _callback){
  _term = _term.toLowerCase();
  var full_url = this.category_price_url + _categoryId +"&alpha=" + _term;
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
    beforeSend:function(){
      $('#search-loading').show();
    },
    success: function(data){
      var response = JSON.parse(data);
      items = response.items;
      if(items.length > 0){
        for (var i = 0; i < items.length; i++) {
          items[i].current.formated_price = items[i].current.price;
          items[i].current.price = toolz.parsePrice(items[i].current.price);
          query.getIcon(items[i], function(blob, item){
            item.icon = blob;
            // query.getLargeIcon(item, function(largeblob, item){
              // item.icon_large = largeblob;
            designer.addViewItem(item);
            // });
          });
        };
      }
      else{
        designer.searchBody.html('No items were found');
      }
    },
    complete: function(){
      $('#search-loading').hide();
    }
  });
}
query.itemGraph = function(_item, _callback){
  if(typeof _item === "object")
    _itemId = _item.id;
  else
    _itemId = _item;
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
    },
    success: function(data){
      var response = JSON.parse(data);
      _callback(response);
    },
    complete: function(){
    }
  });
}

extension.Toolz.parsePrice = function(payload){
  var pattern = new RegExp(/\d*\.?,?\d*[kmb]?/);
  var price = new String(pattern.exec(payload));
  var actual = null;
  
  if(price.match(",")){
    pattern = new RegExp(/\d*\,?\d*/);
    actual = new String(pattern.exec(price));
    var array = actual.split(",");
    var thousands = array[0];
    thousands = thousands*1000;
    var hundreds = array[1]*1;
    actual = thousands + hundreds;
  }
  else if(price.match("k")){
    pattern = new RegExp(/\d*\.?\d*/);
    actual = pattern.exec(price);
    actual = actual*1000;
  }
  else if(price.match("m")){
    pattern = new RegExp(/\d*\.?\d*/);
    actual = pattern.exec(price);
    actual = actual*1000000;
  }
  else if(price.match("b")){
    pattern = new RegExp(/\d*\.?\d*/);
    actual = pattern.exec(price);
    actual = actual * 1000000000;
  }else{
    actual = price * 1;
  }
  return actual;
}
extension.Toolz.parseDate = function(item){

}

designer.addViewItem = function(item){
  designer.searchBody.append("<div id='"+item.id+"' class='search-item' alt='"+item.description+"'><img src='"+item.icon+"'/><h3>"+item.name+"</h3><img style='display: none;' src='star-off.png'/><div id='search-item-content' style='display: none;' class='search-item-content'><hr/><table class='item-prices'><thead><tr><td>Time</td><td>Price/Change</td></tr></thead><tbody><tr><td>Today's Price</td><td>"+item.current.formated_price+"</td></tr><tr><td>Today's Change</td><td>"+item.today.price+"</td></tr></tbody></table><div id='graph"+item.id+"' class='graph width='300' height='300' ></div></div></div>");
  
  $('div[id='+item.id+']').click(function(){
    var div = $(this).find('div');
    if (div.css('display') !== "block"){
      var id = parseInt($(this).attr('id'));
      console.log('querying');
      div.slideDown(500);
      query.itemGraph(id, function(data){
        var daily = [];
        var avg = [];
        // var prices = [];
        for(var key in data.daily){
          value = data.daily[key];
          date = moment(parseInt(key)).valueOf()/1000;
          daily.push([date, value]);
          // prices.push(value);
        }
        for(var key in data.average){
          value = data.average[key];
          date = moment(parseInt(key)).valueOf()/1000;
          avg.push([date,value]);
        }
        console.log(daily);
        $.plot($('#graph'+id), [daily, avg], {
          xaxis: { mode: "time" }
        });
        $('#graph'+id).css('background', 'white')
        $('#graph'+id).show();
      });
    }
    else
      div.slideUp(500);
  });
}
// extension.Designer.addToTable = function(data){
//   extension.Designer.table.append("<tr id='"+data.id+"'><td><img src='"+ data.icon + "'/></td><td>" + data.name + "</td><td>" + data.description + "</td><td>" + data.today.price + "</td></tr>");
//   $("tr[id='"+data.id+"']").on('click', function(){
//     id = parseInt($(this).attr('id'));
//     iManager.getItem(id, function(item){
//       if(item){
//         designer.showItemDetails(item);
//       }
//       else
//         query.item(item.id, function(queried){
//           designer.showItemDetails(queried);
//         });
//     });
//   });
// }
// extension.Designer.addMultiple = function(items){
//   if(items)
//     for (var i = 0; i < items.length; i++) {
//       extension.Designer.addToTable(items[i]);
//     };
// }
// extension.Designer.showItemDetails = function(item){
//   // <!--<tr><td>30 Day Change</td><td>"+item.day30.change+"</td></tr><tr><td>90 Day Change</td><td>"+item.day90.change+"</td></tr><tr><td>180 Day Change</td><td>"+item.day180.change+"</td></tr>-->
//   $('#item-head').html("<div class='item-header'><h1>"+item.name+"</h1><img src='"+item.icon_large+"' /><table><caption><h2>Price info</h2></caption><tbody><tr><td>Current</td><td>"+item.current.formated_price+"</td></tr><tr><td>Today's Change</td><td>"+item.today.price+"</td></tr></tbody></table></div>");
//   $.plot($('#item-graph'), [ [[moment().subtract('days', 1).valueOf(), 0], [moment().valueOf(), parseInt(item.current.price)]] ], 
//   {
//     yaxis: { max: parseInt(item.current.price)},
//     mode: "time"
//   });
//   $('#search-content').hide();
//   $('#item').show();
// }

// extension.ItemManager.addItem = function(item){
//   chrome.storage.local.set(item);
// }


// extension.ItemManager.getItem = function(item, cllbk){
//   if(typeof item === "integer")
//     search = item;
//   else if(typeof item === "object")
//     search = item.id
//   chrome.storage.local.get(search, function(rtrn){
//     cllbk(rtrn);
//   });
// }

// extension.ItemManager.getAll = function(cllbk){
//   chrome.storage.local.get(null, function(items){
//     cllbk(items);
//   });
// }

$(document).ready(function(){
  extension.Designer.searchBody = $('#search-content');
  var search = $('#search');
  var typeTimer;
  var doneInterval = 650;

  doneTyping = function(){
    designer.searchBody.html('');
    if(search.val() != (null || "")){
      cat = $('#category')
      query.categoryPrice(cat.val(), search.val());
    }
  }
  search.keyup(function(){
    clearTimeout(typeTimer);
    typeTimer = setTimeout(doneTyping, doneInterval);
  });

  $('#search-icon').on('click',function(){
    $('#item').hide();
    $('#search-content').show();
  });

});

