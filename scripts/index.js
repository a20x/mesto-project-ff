// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

const placesList = document.querySelector('.places__list');

const cardTemplate = document.querySelector('#card-template').content;
console.log('#card-template');

function createCard(cardData) {
  const cardTemplateContent = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardTemplateContent.querySelector('.card__image');
  const cardTitle = cardTemplateContent.querySelector('.card__title');
  const cardDeleteButton = cardTemplateContent.querySelector('.card__delete-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  cardDeleteButton.addEventListener('click', function() {
    deleteCard(cardTemplateContent);
  })

  return cardTemplateContent;
}

function deleteCard(elementToDelete) {
  elementToDelete.remove();
}

initialCards.forEach(function(cardData) {
  placesList.append(createCard(cardData));
});