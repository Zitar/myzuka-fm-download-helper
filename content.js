(function () {
   var
      units = [
         {
            urlRegExp: /Album\/[\d]+/g,
            linksSelector: 'a[href^="/Song/"]',
            linkCheck: function (link) {
               return link.innerText === 'СКАЧАТЬ';
            },
            readyResultCheck: function (xhttp) {
               return xhttp.readyState === 4;
            },
            downloadHrefRegExp: /\/Song\/Download\/[\w\d\?=&;]+/,
            hrefModify: function (href) {
               return href && href[0] && href[0].replace('amp;','');
            }
         }, {
            urlRegExp: /release\/[\d]+\/[_\w\d]+\//g,
            linksSelector: 'a[href^="/track/"]',
            linkCheck: function (link) {
               return link.firstChild && link.firstChild.tagName === 'IMG';
            },
            downloadHrefRegExp: /\/freedownload\.php\?id=[\d]+/,
         }, {
            urlRegExp: /album\/[\d]+\/[\-\w\d]+/g,
            linksSelector: 'a[href^="/song/"].dl-song',
            downloadHrefRegExp: /\/song\/dl\/\d+\/[\d\w]+\/\d+/,
         }
      ],
      unit,
      urlMatch,
      links,
      link;

   for (var i = 0, len = units.length; i < len; i++) {
      unit = units[i];
      urlMatch = document.URL.match(unit.urlRegExp);
      if (urlMatch && urlMatch[0]) {
         links = document.querySelectorAll(unit.linksSelector);
         for(var j = 0, linksLen = links.length; j < linksLen; j++) {
            link = links[j];
            if (unit.linkCheck === undefined || unit.linkCheck(link)) {
               var xhttp = new XMLHttpRequest();
               xhttp.onreadystatechange = function (unit, link) {
                  if (this.status === 200 && (unit.readyResultCheck === undefined || unit.readyResultCheck(this))) {
                     var href = this.responseText.match(unit.downloadHrefRegExp);
                     href = unit.hrefModify ? unit.hrefModify(href) : href;
                     href && (link.href = href) && (link.innerHTML = 'Скачать') && (link.style = 'color: green;');
                     link.onclick = function () {
                        this.style = 'color: red;';
                     }.bind(link);
                  }
               }.bind(xhttp, unit, link);
               xhttp.open('GET', link.href, true);
               xhttp.send();
            }
         }
         break;
      }
   }
})();