$.ajaxSetup({
  datatype: 'json',
  cache: true
});

window.Rsextension = {
  query: {
    item_url : "http://services.runescape.com/m=itemdb_rs/api/catalogue/detail.json?item=",
    category_url: "http://services.runescape.com/m=itemdb_rs/api/catalogue/category.json?category=",
    category_price_url: "http://services.runescape.com/m=itemdb_rs/api/catalogue/items.json?category=",
    graphing_url: "http://services.runescape.com/m=itemdb_rs/api/graph/",

    item: function(_itemId, successCllbk){
      var full_url = this.item_url + _itemId;
      $.ajax({
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
          getIcon(item, function(blob, item){
            query.getLargeIcon(item, function(largeblob, item){
              item.icon = largeblob;
              successCllbk(item);
            });
          });
        }
      });
    }
  },
  designer: {

  },
  itemManager:{

  },
  cache:{

  },
  toolz:{

  }
}