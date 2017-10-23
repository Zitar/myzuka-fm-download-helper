(function () {
   var
         albumMatch = document.URL.match(/Album\/[\d]+/g),
   // упорядочивание по убыванию
         compare = function (a, b) {
            return a > b ? -1 : a < b ? 1 : 0;
         };

   if (albumMatch && albumMatch[0]) {
      var links = document.querySelectorAll('a[href^="/Song/"]');
      for(var i = 0, len = links.length; i < len; i++) {
         var link = links[i];
         if (link.innerText === 'СКАЧАТЬ') {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function (link) {
               if (this.readyState == 4 && this.status == 200) {
                  var href = this.responseText.match(/\/Song\/Download\/[\w\d\?=&;]+/);
                  href = href && href[0] && href[0].replace('amp;','');
                  href && (link.href = href) && (link.style = 'color: green;');
                  link.onclick = function () {
                     this.style = 'color: red;';
                  }.bind(link);
               }
            }.bind(xhttp, link);
            xhttp.open('GET', link.href, true);
            xhttp.send();
         }
      }
   }
})();