var table_display = document.querySelector('.data-display');
const table_template = document.querySelector('.table-template').innerHTML;
const table_instance = Handlebars.compile(table_template);


function reload() {
  $.ajax({
    type: 'GET',
    url: 'https://api-shoe-catalogue.herokuapp.com/api/shoes'
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
    url: 'https://api-shoe-catalogue.herokuapp.com/api/shoes/id/' + shoeID
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
      url: 'https://api-shoe-catalogue.herokuapp.com/api/shoes/id/' + soldShoeId + '/amount/' + $amount.val()
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

document.querySelector('.add-btn').disabled = true;
var statusMsg = document.querySelector('.status');

$('.newBrand, .newStock, .newSize, .newPrice, .newColor').on('keyup', function() {
  if ($('.newBrand').val().length > 0 && $('.newSize').val().length > 0 && $('.newColor').val().length > 0 && $('.newPrice').val().length > 0 && $('.newStock').val().length > 0) {
    document.querySelector('.add-btn').disabled = false;
  } else {
    document.querySelector('.add-btn').disabled = true;
  }
});

$('.add-btn').on('click', function() {
  let newStock = {
    brand: $('.newBrand').val().toLowerCase(),
    size: $('.newSize').val(),
    color: $('.newColor').val(),
    price: $('.newPrice').val(),
    in_stock: $('.newStock').val()
  }

  $.ajax({
    type: 'POST',
    data: JSON.stringify(newStock),
    url: 'https://api-shoe-catalogue.herokuapp.com/api/shoes/',
    contentType: "application/json"
  }).done(function(data) {
    if (data) {
      table_display.innerHTML = table_instance({
        data: data
      });
      document.querySelector('.newBrand').value = "";
      document.querySelector('.newSize').value = "";
      document.querySelector('.newColor').value = "";
      document.querySelector('.newPrice').value = "";
      document.querySelector('.newStock').value = "";
      document.querySelector('.add-btn').disabled = true;
      statusMsg.innerHTML = '<div class="alert success alert-success">Stock added successfully!</div>';
    } else {
      statusMsg.innerHTML = '<div class="alert warning alert-danger">Error adding stock!</div>';
    }
  });
});
