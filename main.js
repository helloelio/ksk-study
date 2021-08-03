let goodsList = [];
let $paramTitle = document.querySelector('#filter-param');
let $sortingParam = document.querySelector('#sorting-param');
let $ol = document.querySelector('.goods-list');
let $name = document.getElementById('name');
let $count = document.getElementById('count');
let $price = document.getElementById('price');
let $date = document.getElementById('date');
let $filterLength = document.querySelector('.length');

document.getElementById('add').addEventListener('click', function () {
    if ($name.value !== '') {
        let goodsListItem = {
            name: $name.value,
            count: $count.value || 'Не задано',
            price: $price.value || 'Не задано',
            date: $date.value || 'Не задано',
        };

        function identityCheck() {
            return goodsList.every(
                (item) => JSON.stringify(item) !== JSON.stringify(goodsListItem)
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
    console.log(goodsList)
});

function paintNewItem(item) {
    let $ul = document.createElement('ul');
    let $li = document.createElement('li');
    // Не много стилей (чтобы глаз не резало)
    $li.innerText = 'Продукт.';
    $li.style.marginBottom = '20px';
    let $liName = document.createElement('li');
    let $liCount = document.createElement('li');
    let $liPrice = document.createElement('li');
    let $liDate = document.createElement('li');
    $liName.innerText = `Название: ${item.name}`;
    $liCount.innerText = `Количество: ${item.count}`;
    $liPrice.innerText = `Цена: ${item.price}`;
    $liDate.innerText = `Дата покупки: ${item.date}`;
    $ul.append($liName, $liCount, $liPrice, $liDate);
    $li.append($ul);
    $ol.append($li);
}

function paintNewList(list) {
    $ol.innerHTML = '';
    list.forEach(item => {
        paintNewItem(item)
    })
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
    })
    $filterLength.innerText = `Найдено: ${filteredList.length} продуктов.`;
    if ($paramTitle.value == '') {
        $filterLength.innerText = ''
    }
    paintNewList(filteredList);
})

// sorting
$sortingParam.addEventListener('change', () => {
    switch ($sortingParam.value) {
        case 'Название':
            goodsList = goodsList.sort((a, b) => {
                if (a.name > b.name) return 1;
                if (a.name === b.name) return 0;
                if (a.name < b.name) return -1;
            })
            paintNewList(goodsList);
            break;
        case 'Цена':
            goodsList = goodsList.sort((a, b) => {
                return a.price - b.price;
            })
            paintNewList(goodsList);
            break;

        case 'Количество':
            goodsList = goodsList.sort((a, b) => {
                return a.count - b.count;
            })
            paintNewList(goodsList);
            break;

        case 'Дата':
            goodsList = goodsList.sort((a, b) => {
                if (a.date > b.date) return 1;
                if (a.date === b.date) return 0;
                if (a.date < b.date) return -1
            })
            paintNewList(goodsList);
            break
    }
});

// clear
function clearList() {
    if (goodsList.length > 0) {
        $ol.innerHTML = '';
        goodsList = [];
    }
}




