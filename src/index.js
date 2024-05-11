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

  const formElement = document.querySelectorAll('.popup__form');
  const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
  const buttonElement = formElement.querySelector('.popup__button');

  buttonCurrentState(inputList, buttonElement);

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

// функция показа ошибки у формы 

function showPopupInputError(formElement, inputElement, errorMessage) {
  const formInputError = formElement.querySelector(`.${inputElement.id}-error`);
  formInputError.textContent = errorMessage;
  formInputError.classList.add('form__input-error-active');
  inputElement.classList.add('form__input_type_error');
};

// функция скрытия ошибки у формы

function hidePopupInputError(formElement, inputElement) {
  const formInputError = formElement.querySelector(`.${inputElement.id}-error`);
  formInputError.textContent = '';
  formInputError.classList.remove('form__input-error-active');
  inputElement.classList.remove('form__input_type_error');
};

// функция валидации инпута

function checkInputValidation(formElement, inputElement) {
  if (!inputElement.validity.valid) {
    showPopupInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hidePopupInputError(formElement, inputElement);
  }
};

// функция обработчик всех инпутов формы

function setEventListeners(formElement) {
  const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
  const buttonElement = formElement.querySelector('.popup__button');

  buttonCurrentState(inputList, buttonElement);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidation(formElement, inputElement);
      buttonCurrentState(inputList, buttonElement);
    });
  });
};

// функция валидации формы

function formValidation() {
  const formList = Array.from(document.querySelectorAll('.popup__form'));

  formList.forEach((formElement) => {
    formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();
    });
    setEventListeners(formElement);
  })
};

// функция поиска невалидного инпута

function invalidInput(inputList) {
  return inputList.some((listElement) => {
    return !listElement.validity.valid;
  })
};

// функция переключения кнопки в активную или наоборот

function buttonCurrentState(inputList, buttonElement) {
  if(invalidInput(inputList)) {
    buttonElement.setAttribute('disabled', '');
    buttonElement.classList.add('popup__button-disabled');
  } else {
    buttonElement.removeAttribute('disabled', '');
    buttonElement.classList.remove('popup__button-disabled');
  }
};

// функция очистки ошибок полей ввода в попапе

function clearInputErrors(formElement) {

}

formValidation();
