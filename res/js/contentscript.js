  $.ajaxSetup({
      datatype: 'json',
      cache: true
    });
window.RsExtension = {
  // var that = this;


  QueryTool:{
    item_url: "http://services.runescape.com/m=itemdb_rs/api/catalogue/detail.json?item=",
    category_url: "http://services.runescape.com/m=itemdb_rs/api/catalogue/category.json?category=",
    category_price_url: "http://services.runescape.com/m=itemdb_rs/api/catalogue/items.json?category=1&alpha=a&page=1",
    graphing_url: "http://services.runescape.com/m=itemdb_rs/api/graph/",

    // Create so that it itterates over params and constructs string
    queryItem: function(_itemId){
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
        }
      });
    },
    queryCategory: function(_categoryId){
      var full_url = this.category_url + _categoryId;
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
    },
    queryCategoryPrice: function(_categoryId, _page){
      var full_url = this.category_url + _categoryId +"&alpha=a&page=" + _page;
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
    },
    queryItemGraph: function(_itemId){
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
  },

  Designer: {

  }
}
$(document).ready(function(){
  $('#search').keyup(function(key){
    console.log(key + " was pressed");
  });
});

