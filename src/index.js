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

// объект с необходимыми классами

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

//функция добавления карточек на страницу

initialCards.forEach(function(initialCardData) {
  const newCard = createCard(initialCardData, deleteCard, likeButton, openImagePopup);
  cardsContainer.append(newCard);
});

//открытие попапов на клик

editButtonProfile.addEventListener('click', function() {
  openEditProfile();
  clearValidation(popupProfileEdit.querySelector(validationConfig.formSelector), validationConfig);
});

addNewCardButton.addEventListener('click', function() {
  openModal(popupNewCard);
  clearValidation(popupNewCard.querySelector(validationConfig.formSelector), validationConfig);
});

popupNewCard.addEventListener('submit', addNewCard);

// открытие редактирования профиля

const nameInput = document.querySelector('.popup__input_type_name');
const jobInput = document.querySelector('.popup__input_type_description');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

function openEditProfile() {
  openModal(popupProfileEdit);

  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
}

// редактирование данных профиля

function editProfileInfo(evt) {
  evt.preventDefault();

  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  closeModal(popupProfileEdit);
}

// слушатель на submit формы

const profileEditForm = popupProfileEdit.querySelector('.popup__form');

profileEditForm.addEventListener('submit', editProfileInfo);

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

function openImagePopup(cardLink, cardName) {
  openModal(popupTypeImage);

  const popupImage = document.querySelector('.popup__image');
  const popupCaption = document.querySelector('.popup__caption');

  popupImage.src = cardLink;
  popupImage.alt = cardName;
  popupCaption.textContent = cardName;
};

// функция обработчик всех инпутов формы

function setEventListeners(formElement, validationConfig) {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);

  buttonCurrentState(inputList, buttonElement, validationConfig);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidation(formElement, inputElement);
      buttonCurrentState(inputList, buttonElement, validationConfig);
    });
  });
};

// функция валидации формы

function enableValidation(validationConfig) {
  const formList = Array.from(document.querySelectorAll(validationConfig.formSelector));

  formList.forEach((formElement) => {
    formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();
    });
    setEventListeners(formElement, validationConfig);
  })
};

// функция показа ошибки у инпута формы 

function showPopupInputError(formElement, inputElement, errorMessage) {
  const formInputError = formElement.querySelector(`.${inputElement.id}-error`);
  formInputError.textContent = errorMessage;
  formInputError.classList.add(validationConfig.errorClass);
  inputElement.classList.add(validationConfig.inputErrorClass);
};

// функция скрытия ошибки у инпута формы

function hidePopupInputError(formElement, inputElement, validationConfig) {
  const formInputError = formElement.querySelector(`.${inputElement.id}-error`);
  formInputError.textContent = '';
  formInputError.classList.remove(validationConfig.errorClass);
  inputElement.classList.remove(validationConfig.inputErrorClass);
};

// функция валидации инпута

function checkInputValidation(formElement, inputElement) {
  if(inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity('');
  }

  if(!inputElement.validity.valid) {
    showPopupInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hidePopupInputError(formElement, inputElement, validationConfig);
  }
};

// функция поиска невалидного инпута

function invalidInput(inputList) {
  return inputList.some((listElement) => {
    return !listElement.validity.valid;
  })
};

// функция переключения кнопки в активную или наоборот

function buttonCurrentState(inputList, buttonElement, validationConfig) {
  if(invalidInput(inputList)) {
    buttonElement.setAttribute('disabled', '');
    buttonElement.classList.add(validationConfig.inactiveButtonClass);
  } else {
    buttonElement.removeAttribute('disabled', '');
    buttonElement.classList.remove(validationConfig.inactiveButtonClass);
  }
};

// функция очистки ошибок полей ввода в попапе

function clearValidation(formElement, validationConfig) {
  const inputErrorList = Array.from(formElement.querySelectorAll(validationConfig.inputErrorClass));
  inputErrorList.forEach((inputElement) => {
    hidePopupInputError(formElement, inputElement, validationConfig);
  });

  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  buttonCurrentState(inputList, buttonElement, validationConfig);
}

enableValidation(validationConfig);
