import './pages/index.css';
import {initialCards} from './cards.js';
import {createCard, deleteCard, likeButton} from './components/card.js';
import {openModal, closeModal} from './components/modal.js';

// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу


// выбор необходимых элементов

const cardsContainer = document.querySelector('.places__list');
const editButtonProfile = document.querySelector('.profile__edit-button');
const popupProfileEdit = document.querySelector('.popup_type_edit');
const addNewCardButton = document.querySelector('.profile__add-button');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupTypeImage = document.querySelector('.popup_type_image');

//функция добавления карточек на страницу

initialCards.forEach(function(initialCardData) {
  const newCard = createCard(initialCardData, deleteCard, likeButton, openImagePopup);
  cardsContainer.append(newCard);
});

//открытие попапов на клик

editButtonProfile.addEventListener('click', openEditProfile);

addNewCardButton.addEventListener('click', function() {
  openModal(popupNewCard);
  popupNewCard.addEventListener('submit', addNewCard);
});

// открытие редактирования профиля

const nameInput = document.querySelector('.popup__input_type_name');
const jobInput = document.querySelector('.popup__input_type_description');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

function openEditProfile() {
  openModal(popupProfileEdit);

  const nameInputValue = profileTitle.textContent;
  const jobInputValue = profileDescription.textContent;

  nameInput.value = nameInputValue;
  jobInput.value = jobInputValue;
}

// редактирование данных профиля

function editProfileInfo(evt) {
  evt.preventDefault();

  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  closeModal(popupProfileEdit);
}

// слушатель на submit формы

const popupSubmitForm = document.querySelector('.popup__form');

popupSubmitForm.addEventListener('submit', editProfileInfo);

// функция добавления новой карточки

function addNewCard(evt) {
  evt.preventDefault();

  const popupInputCardName = popupNewCard.querySelector('.popup__input_type_card-name');
  const popupInputCardUrl = popupNewCard.querySelector('.popup__input_type_url');

  const popupInputCardNameValue = popupInputCardName.value;
  const popupInputCardUrlValue = popupInputCardUrl.value;

  const newCardData = {
    name: popupInputCardNameValue,
    link: popupInputCardUrlValue
  };

  const createNewCard = createCard(newCardData, deleteCard, likeButton, openImagePopup);

  cardsContainer.prepend(createNewCard);

  popupInputCardName.value = '';
  popupInputCardUrl.value = '';

  closeModal(popupNewCard);
};

// открытие попапа с картинкой

function openImagePopup(evt) {
  openModal(popupTypeImage);

  const card = evt.target.closest('.card');

  const cardImage = card.querySelector('.card__image');
  const cardTitle = card.querySelector('.card__title');

  const popupImage = document.querySelector('.popup__image');
  const popupCaption = document.querySelector('.popup__caption');

  popupImage.src = cardImage.src;
  popupImage.alt = cardImage.alt;
  popupCaption.textContent = cardTitle.textContent;
};
