function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.id = sku;

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const createTotal = (sum) => {
  const searchSection = document.querySelector('.total-price');
  if (searchSection) searchSection.remove();
  const section = document.createElement('section');
  section.className = 'total-price';
  const h3 = document.createElement('h3');
  h3.className = 'h3';
  h3.textContent = `${sum}`;
  document.querySelector('.cart').appendChild(section);
  document.querySelector('.total-price').appendChild(h3);
};

const priceSum = () => {
  let sum = 0;
  let position = '';
  let concatenation = '';
  document.querySelectorAll('li').forEach((li) => {
    position = li.textContent.indexOf('$') + 1;
    for (position; position < li.textContent.length; position += 1) {
      concatenation += li.textContent[position];
    }
    concatenation = Number(concatenation).toFixed(2);
    sum += Number(concatenation);
    concatenation = '';
  });
  createTotal(sum);
};

const clearStorage = (ids) => {
  const products = document.querySelectorAll('li');
  const newProduct = { item: [] };
  products.forEach((product) => {
    if (product.id !== ids) newProduct.item.push(product.textContent);
  });
  localStorage.setItem('item', JSON.stringify(newProduct));
};

function cartItemClickListener(event) {
  event.target.remove();
  clearStorage(event.target.id);
  priceSum();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.id = document.querySelectorAll('.cart__item').length;
  return li;
}

const addItensToSection = (items) => {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
  });
};

const loading = () => {
  const h1 = document.createElement('h1');
  h1.className = 'loading';
  h1.textContent = 'loading ...';
  document.querySelector('.items').appendChild(h1);
};

const fetchML = (query) => {
  loading();
  setTimeout(() => {
    document.querySelector('.loading').remove();
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => {
      response.json().then((data) => {
        addItensToSection(data.results);
      });
    });
  }, 3000);
};

const storageSave = () => {
  const listSave = { item: [] };
  document.querySelectorAll('.cart__item').forEach((li) => {
    listSave.item.push(li.textContent);
  });
  localStorage.setItem('item', JSON.stringify(listSave));
};

const addClick = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => {
      response.json().then((data) => {
        const newProduct = createCartItemElement(data);
        document.querySelector('.cart__items').appendChild(newProduct);
        storageSave();
        priceSum();
      });
    });
};

const cache = () => {
  const object = JSON.parse(localStorage.getItem('item'));
  object.item.forEach((contentLi) => {
    const newLi = document.createElement('li');
    newLi.textContent = contentLi;
    newLi.addEventListener('click', cartItemClickListener);
    document.querySelector('.cart__items').appendChild(newLi);
  });
};

const clearList = () => {
  document.querySelectorAll('li').forEach((li) => li.remove());
  localStorage.clear();
  priceSum();
};

const addItemCart = () => {
  document.querySelector('.items')
    .addEventListener('click', (event) => {
      if (event.target.className === 'item__add') addClick(event.target.parentNode.id);
    });
};

window.onload = () => {
  addItemCart();
  createTotal();
  if (Storage) {
    const object = JSON.parse(localStorage.getItem('item'));
    if (object && Object.values(object).length > 0) cache();
  }
  fetchML('computador');
  document.querySelector('.empty-cart').addEventListener('click', clearList);
  priceSum();
};
