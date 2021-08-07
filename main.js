let goodsList = [];

let counter = 1;

let $subtitle = document.querySelector('.subtitle');
let $allBoughtButton = document.querySelector('.btn-allBought');
let $boughtButton = document.querySelector('.btn-bought');
let $plannedButton = document.querySelector('.btn-plannedBought')
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
      bought: false
    };

    function identityCheck() {
      return goodsList.every(
          (item) => JSON.stringify(item.name) !== JSON.stringify(goodsListItem.name)
      );
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

// TODO: fix
function paintNewItem(item) {
  let itemData = `
    <li>Продукт.
      <input class="checkbox-input" type="checkbox" id="checkbox-${counter}">
      <ul>
        <li>Название: ${item.name}</li>
        <li>Количество: ${item.count}</li>
        <li>Цена: ${item.price}</li>
        <li>Дата покупки: ${item.date}</li>
        <li>${item.bought ? "Куплено" : 'Покупка планируется'}</li>
      </ul>
    </li>
`;
  $ol.insertAdjacentHTML('beforeend', itemData);

  function changeCheck() {
    let $checkbox = document.getElementById(`checkbox-${counter}`);
    $checkbox.addEventListener('click', () => {
      if ($checkbox.checked) {
        $checkbox.parentNode.classList.add('checked-product')
        item.bought = true;
        console.log(item)
      } else {
        $checkbox.parentNode.classList.remove('checked-product')
        item.bought = false;
        console.log(item)
      }
    })
  }

  changeCheck()
  counter++;
}

//  paint bought item
const paintBoughtItems = list => {
  $ol.innerHTML = '';
  list.forEach(item => paintNewItem(item))

};

$boughtButton.addEventListener('click', () => {
  let boughtItems = [];
  goodsList.forEach((item) => {
    if (item.bought) {
      boughtItems.push(item);
    }
  })
  paintBoughtItems(boughtItems);
  $subtitle.innerText = 'Купленные.';
  $filterLength.innerText = `Найдено: ${boughtItems.length} продуктов.`;
})

//  paint bought item

//  paint planned bought
const paintPlannedItems = list => {
  $ol.innerHTML = '';
  list.forEach(item => paintNewItem(item));
};

$plannedButton.addEventListener('click', () => {
  let plannedItems = [];
  goodsList.forEach((item) => {
    if (item.bought === false) {
      plannedItems.push(item);
    }
  })
  paintPlannedItems(plannedItems);
  $subtitle.innerText = 'Планируемые покупки.';
  $filterLength.innerText = `Найдено: ${plannedItems.length} продуктов.`;
})

//  paint planned bought

//  paint all items
const paintAllItems = list => {
  $ol.innerHTML = '';
  list.forEach(item => paintNewItem(item));
};

$allBoughtButton.addEventListener('click', () => {
  paintAllItems(goodsList);
  $subtitle.innerText = 'Все покупки.';
  $filterLength.innerText = `Найдено: ${goodsList.length} продуктов.`;
})
//  paint all items


// filter TODO:
$paramTitle.addEventListener('keyup', () => {
  let filteredList = [];
  goodsList.forEach((item) => {
    let value = item.name.toLowerCase();
    let filterInput = $paramTitle.value.toLowerCase();
    if (value.includes(filterInput)) {
      filteredList.push(item);
    }
  });
  $subtitle.innerText = 'Все покупки.';
  $filterLength.innerText = `Найдено: ${filteredList.length} продуктов.`;
  paintNewList(filteredList);
});

function paintNewList(list) {
  $ol.innerHTML = '';
  list.forEach((item) => {
    paintNewItem(item);
  });
}

// sorting
$sortingParam.addEventListener('change', () => {
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
});

// clear
function clearList() {
  if (goodsList.length > 0) {
    $ol.innerHTML = '';
    $filterLength.innerText = '';
    goodsList = [];
  }
}