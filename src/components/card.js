import { deleteCardOnServer, cardLikeButtonOn, cardLikeButtonOff } from '../index.js'

//функция создания карточек

export function createCard(cardData, deleteOnButtonClick, likeButtonOnClick, openCardImagePopupOnClick, cardLikeCounter, userData) {
  const cardTemplate = document.querySelector('#card-template').content;
  
  const cardTemplateContent = cardTemplate.querySelector(".card").cloneNode(true);

  const cardImage = cardTemplateContent.querySelector(".card__image");
  const cardTitle = cardTemplateContent.querySelector(".card__title");

  const cardDeleteButton = cardTemplateContent.querySelector(".card__delete-button");
  const cardLikeButton =cardTemplateContent.querySelector(".card__like-button");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  cardLikeCounter(cardTemplateContent, cardData.likes.length);

  console.log(cardData);

  const cardId = cardData['_id'];

  if(userData['_id'] === cardData.owner['_id']) {
    cardDeleteButton.classList.add('card__delete-button-correct-user');
    cardDeleteButton.addEventListener("click", function () {
      deleteOnButtonClick(cardTemplateContent, cardId);
    });
  } else {
    cardDeleteButton.classList.remove('card__delete-button-correct-user');
  }

  cardLikeButton.addEventListener("click", (evt) => {
    likeButtonOnClick(evt, cardId);
  });

  cardImage.addEventListener("click", function() {
    openCardImagePopupOnClick(cardData.link, cardData.name)
  });

  return cardTemplateContent;
};

//функция удаления карточек

export function deleteCard(elementToDelete, cardId) {
  elementToDelete.remove();
  deleteCardOnServer(cardId);
};

// функция лайка карточки

export function likeButton(evt, cardId) {
  if(evt.target.classList.contains('card__like-button')) {
    const likeButton = evt.target;
    if(!likeButton.classList.contains('card__like-button_is-active')) {
      likeButton.classList.add('card__like-button_is-active');
      cardLikeButtonOn(cardId);
    } else {
      likeButton.classList.remove('card__like-button_is-active');
      cardLikeButtonOff(cardId);
    }
  }
};