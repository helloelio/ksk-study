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
      date: $date.value || 'Не задано',
      purchaseType: false
    };
    console.log(goodsListItem);

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
  const itemData = `
    <li>Продукт.
      <input class="checkbox-input" type="checkbox" onclick="selectTo(this)">
      <ul>
        <li>Название: ${item.name}</li>
        <li>Количество: ${item.count}</li>
        <li>Цена: ${item.price}</li>
        <li>Дата покупки: ${item.date}</li>
      </ul>
    </li>
`;
  $ol.insertAdjacentHTML('beforeend', itemData);
}

// TODO:
function selectTo(checkboxValue) {
  let $checkBoxParent = checkboxValue.parentNode;
  if (checkboxValue.checked) {
    $checkBoxParent.classList.add('checked-product');
  } else {
    $checkBoxParent.classList.remove('checked-product');
  }
}

function paintNewList(list) {
  $ol.innerHTML = '';
  list.forEach(item => {
    paintNewItem(item)
  });
}

// filter TODO:
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

