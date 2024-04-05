// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

const cardsContainer = document.querySelector('.places__list');

const cardTemplate = document.querySelector('#card-template').content;

function createCard(cardData, deleteOnButtonClick) {
  const cardTemplateContent = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardTemplateContent.querySelector('.card__image');
  const cardTitle = cardTemplateContent.querySelector('.card__title');
  const cardDeleteButton = cardTemplateContent.querySelector('.card__delete-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  cardDeleteButton.addEventListener('click', function() {
    deleteOnButtonClick(cardTemplateContent);
  })

  return cardTemplateContent;
}

function deleteCard(elementToDelete) {
  elementToDelete.remove();
}

initialCards.forEach(function(initialCardData) {
  const newCard = createCard(initialCardData, deleteCard);
  cardsContainer.append(newCard);
});