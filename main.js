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
};

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
      <button id="button-${item.name}">Удалить</button>
    </li>
`;
  $ol.insertAdjacentHTML('beforeend', itemData);

  item.display ? document.getElementById(`product-${item.name}`).style.display = 'block' :
      document.getElementById('product').style.display = 'none';

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
    setItemsToLocalStorage(filtered);
  })
}


$paramTitle.addEventListener('keyup', () => {
  let filteredList = [];
  goodsList.forEach((item) => {
    let value = item.name.toLowerCase();
    let filterInput = $paramTitle.value.toLowerCase();
    if (value.includes(filterInput)) {
      filteredList.push(item);
    }
  });
  $filterLength.innerText = `Найдено: ${filteredList.length} продуктов.`;
  paintNewList(filteredList);
});

function getGoods(type) {
  switch (type) {
    case 'all': {
      let storageList = localStorage.getItem('goodsList');
      $subtitle.innerText = 'Все покупки';
      paintNewList(goodsList.filter(item => {
        if (storageList) {
          item.display = true;
        }
      }))
      paintNewList(goodsList)
      break;
    }
    case 'bought': {
      $subtitle.innerText = 'Уже куплено';
      clearStorage();
      paintNewList(goodsList.filter(item => {
        if (item.bought) {
          item.display = true;
        } else {
          item.display = false;
        }
        setItemsToLocalStorage(goodsList);
        return item.bought === true
      }))
      break;
    }
    case 'planned': {
      $subtitle.innerText = 'Планируемые покупки';
      clearStorage();
      paintNewList(goodsList.filter(item => {
        if (!item.bought) {
          item.display = true;
        } else {
          item.display = false;
        }
        setItemsToLocalStorage(goodsList);
        return item.bought === false;
      }))
      break;
    }
  }
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

// clear
function clearList() {
  if (goodsList.length > 0) {
    $ol.innerHTML = '';
    $filterLength.innerText = '';
    goodsList = [];
    clearStorage();
  }
}

//  setStorage
function setItemsToLocalStorage(list = []) {
  localStorage.setItem('goodsList', JSON.stringify({items: list}));
}

//  clearStorage
function clearStorage() {
  localStorage.removeItem('goodsList');
}

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
    $filterLength.innerText = `Найдено: ${goodsList.length} продуктов.`;
  } else {
    goodsList = []
  }
}

document.addEventListener('DOMContentLoaded', onPageLoaded)

//TODO: fix filter, fix display value, fix delete