$(document).ready(function() {
  'use strict';

  var m = {
    // Carga archivo externo de resultados
    loadNewBody: function (data) {
      $('body').load('search.html', function() {
        m.printData(data);
        m.printInfo(data);
      });
      $('body').removeClass('home').addClass('list');
    },
    // Hace un loop sobre los resultados de google y los imprime.
    printData: function(data) {
      if (data.searchInformation.totalResults !== 0) {
        var result,
            list = $('#results');
        for (var i = 0; i < data.items.length; i++) {
          //data.items[i];
          result = '<li><a href="'+data.items[i].link+'">'+data.items[i].title+'</a>'+
            '<span>'+data.items[i].formattedUrl+'</span>'+
            '<p class="description">'+data.items[i].snippet+'</p></li>';
          //$('#results').append(result);
          list.append(result);
        };
      } else {
        list.append('<li>No se encontraron resultados.</li>');
      }
    },
    // Imprime datos extra de la búsqueda
    printInfo: function(data) {
      var lastQuery = data.queries.request[0].searchTerms,
          total = data.searchInformation.formattedTotalResults;

      document.title = lastQuery + ' | bong';
      $('#last-query').text(lastQuery);
      $('#more .result-num').text(total+' Resultados');
    }
  };

  // Asigna valor de idioma/región dentro de la vista de lista
  $(document).on('click', "#more a[data-lang]", function(e) {
    e.preventDefault();
    $('#hidden').val($(this).attr('data-lang'));

  });

  // Toma información de forms y envía por Ajax
  $(document).on('submit', 'form', function(e) {
    e.preventDefault();

    var key = 'AIzaSyBSOtK0X9zU8f9C5f8RB_2a8KzH7EBeRAc',
        cx = '003490324452877184394:itrkqrfnxj8',
        query = $('#query').val(),
        lang =  $('#hidden').val() || $(this).find('input[name="language"]:checked').val(),
        language,
        geolocation;

    if (lang === 'mex') {
      language = 'lang_es';
      geolocation = 'mx';
    } else if (lang === 'spanish') {
      language = 'lang_es';
    }

    // Llamado de Ajax a Google por GET con los parámetros de búsqueda
    $.ajax({
      url: 'https://www.googleapis.com/customsearch/v1',
      data: {
        key: key,
        cx: cx,
        q:  query,
        gl: geolocation,
        lr: language
      },
      type: this.method
    })
    .done(function(data) {
      // Llama teplate de de lista
      m.loadNewBody(data);
    })
    .fail(function (data) {
      alert('Ocurrió un error :(');
    });
  });

});
