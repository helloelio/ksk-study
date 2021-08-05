let goodsList = [];
let $paramTitle = document.querySelector('#filter-param');
let $sortingParam = document.querySelector('#sorting-param');
let $ol = document.querySelector('.goods-list');
let $name = document.getElementById('name');
let $count = document.getElementById('count');
let $price = document.getElementById('price');
let $date = document.getElementById('date');
let $filterLength = document.querySelector('.length');

document.getElementById('add').addEventListener('click', function() {
  if ($name.value !== '') {
    let goodsListItem = {
      name: $name.value,
      count: $count.value || 'Не задано',
      price: $price.value || 'Не задано',
      date: $date.value || 'Не задано'
    };

    function identityCheck() {
      return goodsList.every((item) => JSON.stringify(item) !== JSON.stringify(goodsListItem));
    }

    if (identityCheck()) {
      goodsList.push(goodsListItem);
      paintNewItem(goodsListItem);
      $name.value = '';
      $count.value = '';
      $price.value = '';
      $date.value = '';
    } else {
      alert('Нельзя добавить уже существующий товар');
    }
  } else {
    alert('Нельзя добавить товар без наименования');
  }
  $filterLength.innerText = `Найдено: ${goodsList.length} продуктов.`;
});

function paintNewItem(item) {
  let $ul = document.createElement('ul');
  let $li = document.createElement('li');
  let $checkboxInput = document.createElement('input');
  $checkboxInput.type = 'checkbox';
  // Не много стилей (чтобы глаз не резало)
  $li.innerText = 'Продукт.';
  let $liName = document.createElement('li');
  let $liCount = document.createElement('li');
  let $liPrice = document.createElement('li');
  let $liDate = document.createElement('li');
  $liName.innerText = `Название: ${item.name}`;
  $liCount.innerText = `Количество: ${item.count}`;
  $liPrice.innerText = `Цена: ${item.price}`;
  $liDate.innerText = `Дата покупки: ${item.date}`;
  $ul.append($liName, $liCount, $liPrice, $liDate);
  $li.append($checkboxInput, $ul);
  $ol.append($li);
  $checkboxInput.addEventListener('click', () => {
    selectTo($checkboxInput)
  })
}

// TODO: fix
function selectTo(checkboxValue) {
  let $checkBoxParent = checkboxValue.parentNode;
  if (checkboxValue.checked) {
    $checkBoxParent.classList.add('checked-product')
  } else {
    $checkBoxParent.classList.remove('checked-product')
  }
}

function paintNewList(list) {
  $ol.innerHTML = '';
  list.forEach(item => {
    paintNewItem(item)
  });
}

// filter TODO: maybe some features
$paramTitle.addEventListener('keyup', () => {
  let filteredList = [];
  goodsList.forEach(item => {
    let value = item.name.toLowerCase();
    let filterInput = $paramTitle.value.toLowerCase();
    if (value.includes(filterInput)) {
      filteredList.push(item)
    }
  });
  $filterLength.innerText = `Найдено: ${filteredList.length} продуктов.`;
  paintNewList(filteredList);
});

// sorting
$sortingParam.addEventListener('change', () => {
  const sortField = $sortingParam.value;
  if ($sortingParam.value === 'name' || $sortingParam.value === 'date') {
    goodsList = goodsList.sort((a, b) => {
      if (a[sortField] > b[sortField]) return 1;
      if (a[sortField] < b[sortField]) return -1;
      if (a[sortField] === b[sortField]) return 0;
    });
  } else if ($sortingParam.value === 'price' || $sortingParam.value === 'count') {
    goodsList = goodsList.sort((a, b) => {
      return a[sortField] - b[sortField];
    });
  }
  paintNewList(goodsList);
});

// clear

function clearList() {
  if (goodsList.length > 0) {
    $ol.innerHTML = '';
    $filterLength.innerText = '';
    goodsList = [];
  }
}

