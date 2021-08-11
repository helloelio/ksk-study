let goodsList = [];
let $ol = document.querySelector('.goods-list');
let $paramTitle = document.querySelector('#filter-param');
let $sortingParam = document.querySelector('#sorting-param');
let $name = document.getElementById('name');
let $count = document.getElementById('count');
let $price = document.getElementById('price');
let $date = document.getElementById('date');
let $subtitle = document.querySelector('.subtitle');
let $filterLength = document.querySelector('.length');
let $allButton = document.querySelector('.all');
let $boughtButton = document.querySelector('.bought');
let $plannedButton = document.querySelector('.planned');
let buttonsArray = [];
buttonsArray.push($allButton, $boughtButton, $plannedButton);

function addItem() {
  if ($name.value !== '') {
    let goodsListItem = {
      name: $name.value,
      count: $count.value || 'Не задано',
      price: $price.value || 'Не задано',
      date: $date.value || 'Не задано',
      bought: false,
      display: true
    };

    function identityCheck() {
      return goodsList.every(
          (item) =>
              JSON.stringify(item.name) !== JSON.stringify(goodsListItem.name)
      );
    }

    if (identityCheck()) {
      goodsList.push(goodsListItem);
      setItemsToLocalStorage(goodsList);
      paintNewItem(goodsListItem);
      clearFields();
    } else {
      alert('Нельзя добавить уже существующий товар');
    }
  } else {
    alert('Нельзя добавить товар без наименования');
  }
  $subtitle.innerText = 'Все покупки.';
  $filterLength.innerText = `Найдено: ${goodsList.length} продуктов.`;
}

//  addItem from key (Enter)
$name.addEventListener('keydown', (e) => {
  e.key === 'Enter' ? addItem() : null
})

// TODO: fix
function paintNewItem(item) {
  let itemData = `
    <li class="product" id="product-${item.name}">Продукт.
      <input class="checkbox-input" type="checkbox" id="${item.name}">
      <ul>
        <li>Название: ${item.name}</li>
        <li>Количество: ${item.count}</li>
        <li>Цена: ${item.price}</li>
        <li>Дата покупки: ${item.date}</li>
        <li>${item.bought ? 'Куплено' : 'Покупка планируется'}</li>
      </ul>
      <button class="btn-delete" id="button-${item.name}">Удалить</button>
    </li>
`;
  $ol.insertAdjacentHTML('beforeend', itemData);

  item.display ?
      document.getElementById(`product-${item.name}`).style.display = 'block' :
      document.getElementById(`product-${item.name}`).style.display = 'none';

  let $checkbox = document.getElementById(`${item.name}`);
  let $checkboxParent = $checkbox.parentNode;
  $checkbox.checked = item.bought;
  item.bought ? $checkboxParent.classList.add('checked-product') : $checkboxParent.classList.remove('checked-product');
  $checkbox.addEventListener('change', (e) => {
    goodsList.forEach(t => {
      if (t.name === e.target.id) {
        t.bought = !t.bought;
        item.bought ? $checkboxParent.classList.add('checked-product') : $checkboxParent.classList.remove('checked-product');
      }
    })
  });

  let $buttonToDelete = document.getElementById(`button-${item.name}`);
  let $buttonToDeleteParent = $buttonToDelete.parentNode;
  $buttonToDelete.addEventListener('click', (e) => {
    let accept = confirm('Вы точно хотите удалить этот продукт?');
    if (accept) {
      clearStorage();
      $buttonToDeleteParent.remove();
    }
    let filtered = goodsList.filter(el => {
      return `button-${el.name}` !== e.target.id
    });
    $filterLength.innerText = `Найдено: ${filtered.length} продуктов.`;
    setItemsToLocalStorage(filtered);
  })
}

function filterByTitle() {
  let filteredList = [];
  goodsList.forEach((item) => {
    let value = item.name.toLowerCase();
    let filterInput = $paramTitle.value.toLowerCase();
    if (value.includes(filterInput)) {
      filteredList.push(item);
      filteredList.forEach(i => {
        i.display = true;
      })
    } else {
      item.display = false;
    }
  });
  $filterLength.innerText = `Найдено: ${filteredList.length} продуктов.`;
  setFilterInputValueToLocalStorage($paramTitle.value);
  paintNewList(filteredList);
}

$paramTitle.addEventListener('keyup', filterByTitle)


function getGoods(type) {
  switch (type) {
    case 'all': {
      toggleButtonStyles(type);
      let storageList = localStorage.getItem('goodsList');
      $subtitle.innerText = 'Все покупки.';
      paintNewList(goodsList.filter(item => {
        if (storageList) {
          item.display = true;
        }
      }))
      paintNewList(goodsList);
      setFilterValueToLocalStorage(type);
      break;
    }
    case 'bought': {
      toggleButtonStyles(type);
      $subtitle.innerText = 'Уже куплено.';
      clearStorage();
      paintNewList(goodsList.filter(item => {
        item.display = !!item.bought;
        setItemsToLocalStorage(goodsList);
        return item.bought === true;
      }))
      setFilterValueToLocalStorage(type);
      break;
    }
    case 'planned': {
      toggleButtonStyles(type);
      $subtitle.innerText = 'Планируемые покупки.';
      clearStorage();
      paintNewList(goodsList.filter(item => {
        item.display = !item.bought;
        setItemsToLocalStorage(goodsList);
        return item.bought === false;
      }))
      setFilterValueToLocalStorage(type);
      break;
    }
  }
}

//
function toggleButtonStyles(type) {
  buttonsArray.forEach(i => i.classList.forEach(x => {
    type === x ? i.classList.add('btn-active') : i.classList.remove('btn-active');
  }))
}

//  paint planned bought
function paintNewList(list) {
  $ol.innerHTML = '';
  list.forEach((item) => {
    paintNewItem(item);
  });
  setItemsToLocalStorage(goodsList)
}

// sorting
function sortByParam() {
  const sortField = $sortingParam.value;
  if ($sortingParam.value === 'name' || $sortingParam.value === 'date') {
    goodsList = goodsList.sort((a, b) => {
      if (a[sortField] > b[sortField]) return 1;
      if (a[sortField] < b[sortField]) return -1;
      if (a[sortField] === b[sortField]) return 0;
    });
  } else if (
      $sortingParam.value === 'price' ||
      $sortingParam.value === 'count'
  ) {
    goodsList = goodsList.sort((a, b) => {
      return a[sortField] - b[sortField];
    });
  }
  paintNewList(goodsList);
}


//  setStorage
function setItemsToLocalStorage(list = []) {
  localStorage.setItem('goodsList', JSON.stringify({items: list}));
}

function setFilterValueToLocalStorage(filterName = String()) {
  localStorage.setItem('filterValue', filterName);
}

function setFilterInputValueToLocalStorage(filterValue = String()) {
  localStorage.setItem('filterInputValue', filterValue);

}

// clear
function clearList() {
  if (goodsList.length > 0) {
    $ol.innerHTML = '';
    $filterLength.innerText = '';
    goodsList = [];
    clearStorage();
  }
}

//  clearStorage
function clearStorage() {
  localStorage.removeItem('goodsList');
}

// clearFields
function clearFields() {
  $name.value = '';
  $count.value = '';
  $price.value = '';
  $date.value = '';
}

function onPageLoaded() {
  let storageList = localStorage.getItem('goodsList');
  if (storageList) {
    goodsList = JSON.parse(localStorage.getItem('goodsList')).items;
    paintNewList(goodsList);
    $subtitle.innerText = 'Все покупки.';
    $filterLength.innerText = `Найдено: ${goodsList.length} продуктов.`;
    getGoods(localStorage.getItem('filterValue'));

    if (localStorage.getItem('filterInputValue') !== '') {
      $paramTitle.value = localStorage.getItem('filterInputValue');
      filterByTitle();
    }
  } else {
    goodsList = []
  }
}

document.addEventListener('DOMContentLoaded', onPageLoaded);

//TODO: fix filter, fix display value, fix delete