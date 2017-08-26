var table_display = document.querySelector('.data-display');
const table_template = document.querySelector('.table-template').innerHTML;
const table_instance = Handlebars.compile(table_template);


function reload() {
  $.ajax({
    type: 'GET',
    url: 'http://localhost:4000/api/shoes'
  }).done(function(data) {
    table_display.innerHTML = table_instance({
      data: data
    });
  });
}

reload();

$('.search').on('keyup', function() {
  var input, filter, para, data, p, i;
  input = $('.search').val().toLowerCase();
  data = document.getElementById('shoes');
  para = data.getElementsByTagName('div')
  for (i = 0; i < para.length; i++) {
    p = para[i].getElementsByTagName("strong")[0];
    if (p) {
      if (p.innerHTML.indexOf(input) > -1) {
        para[i].style.display = "";
      } else {
        para[i].style.display = "none";
      }
    }
  }
});

var form_display = document.querySelector('.form-display');
const form_template = document.querySelector('.purchase-form-template').innerHTML;
const form_instance = Handlebars.compile(form_template);

var soldShoeId = null;

$('#shoes').on('click', function(e) {
  const shoeID = e.target.value;
  soldShoeId = shoeID;
  $.ajax({
    type: 'GET',
    url: 'http://localhost:4000/api/shoes/id/' + shoeID
  }).done(function(data) {
    form_display.innerHTML = form_instance({
     data: data
    });
  });
  if (shoeID !== undefined) {
    $('.popup').slideDown();
  }
});

$('.update-btn').on('click', function() {
  const $amount = $('.amount');
  if ($amount.val().length > 0) {
    $.ajax({
      type: 'POST',
      url: 'http://localhost:4000/api/shoes/id/' + soldShoeId + '/amount/' + $amount.val()
    }).done(function(data) {
      document.querySelector('.status').innerHTML = '<div class="text-center alert success alert-success">Stock updated</div>';
      reload();
    });
  } else {
    document.querySelector('.status').innerHTML = '<div class="text-center alert danger alert-danger">Please enter stock amount!</div>';
  }
});

$('.cancel-btn').on('click', function() {
 $('.popup').slideUp();
 document.querySelector('.status').innerHTML = "";
});
