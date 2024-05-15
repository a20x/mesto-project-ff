import "./pages/index.css";
import { initialCards } from "./cards.js";
import { createCard, deleteCard, likeButton } from "./components/card.js";
import { openModal, closeModal } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";

// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

// выбор необходимых элементов

const cardsContainer = document.querySelector(".places__list");
const editButtonProfile = document.querySelector(".profile__edit-button");
const popupProfileEdit = document.querySelector(".popup_type_edit");
const addNewCardButton = document.querySelector(".profile__add-button");
const popupNewCard = document.querySelector(".popup_type_new-card");
const popupTypeImage = document.querySelector(".popup_type_image");
const profileInfo = document.querySelector(".profile__info");

// объект с необходимыми классами

export const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

//функция добавления карточек на страницу

/* initialCards.forEach(function (initialCardData) {
  const newCard = createCard(
    initialCardData,
    deleteCard,
    likeButton,
    openImagePopup
  );
  cardsContainer.append(newCard);
}); */

//открытие попапов на клик

editButtonProfile.addEventListener("click", function () {
  openEditProfile();
  clearValidation(
    popupProfileEdit.querySelector(validationConfig.formSelector),
    validationConfig
  );
});

addNewCardButton.addEventListener("click", function () {
  openModal(popupNewCard);
  clearValidation(
    popupNewCard.querySelector(validationConfig.formSelector),
    validationConfig
  );
});

popupNewCard.addEventListener("submit", addNewCard);

// открытие редактирования профиля

const nameInput = document.querySelector(".popup__input_type_name");
const jobInput = document.querySelector(".popup__input_type_description");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

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

const profileEditForm = popupProfileEdit.querySelector(".popup__form");

profileEditForm.addEventListener("submit", (evt) => {
  editProfileInfo(evt);
  changeProfileInfo();
})

// функция добавления новой карточки

function addNewCard(evt) {
  evt.preventDefault();

  const popupInputCardName = popupNewCard.querySelector(
    ".popup__input_type_card-name"
  );
  const popupInputCardUrl = popupNewCard.querySelector(
    ".popup__input_type_url"
  );

  const popupInputCardNameValue = popupInputCardName.value;
  const popupInputCardUrlValue = popupInputCardUrl.value;

  const newCardData = {
    name: popupInputCardNameValue,
    link: popupInputCardUrlValue,
  };

  const createNewCard = createCard(
    newCardData,
    deleteCard,
    likeButton,
    openImagePopup
  );

  cardsContainer.prepend(createNewCard);

  popupInputCardName.value = "";
  popupInputCardUrl.value = "";

  closeModal(popupNewCard);
}

// открытие попапа с картинкой

function openImagePopup(cardLink, cardName) {
  openModal(popupTypeImage);

  const popupImage = document.querySelector(".popup__image");
  const popupCaption = document.querySelector(".popup__caption");

  popupImage.src = cardLink;
  popupImage.alt = cardName;
  popupCaption.textContent = cardName;
}

enableValidation(validationConfig);

// получение и отображение информации в профиле

function getUserData() {
  return fetch("https://nomoreparties.co/v1/wff-cohort-13/users/me", {
    method: "GET",
    headers: {
      authorization: "566ffc24-d213-4917-9ff7-327708d679d6",
    },
  })
    .then((data) => data.json())
    .then((data) => {
      console.log(data); // проверка, что данные пришли и какие

      const profileImage = document.querySelector(".profile__image");

      profileImage.style.backgroundImage = `url${data.avatar}`;
      profileTitle.textContent = data.name;
      profileDescription.textContent = data.about;
    });
}

// получение и отображение карточек с сервера

function getCardsData() {
  return fetch("https://nomoreparties.co/v1/wff-cohort-13/cards ", {
    method: "GET",
    headers: {
      authorization: "566ffc24-d213-4917-9ff7-327708d679d6",
    },
  })
    .then((res) => res.json())
    .then((cardsData) => {
      console.log(cardsData);

      cardsData.forEach((cardData) => {
        const makeCard = createCard(
          cardData,
          deleteCard,
          likeButton,
          openImagePopup
        );
        cardsContainer.append(makeCard);
      });
    });
}

// ждем выполнение запросов о данных пользователя и данных карточки, и вызываем их функции

Promise.all([getUserData, getCardsData]).then(() => {
  getUserData();
  getCardsData();
});

//

function changeProfileInfo() {
  return fetch("https://nomoreparties.co/v1/wff-cohort-13/users/me", {
    method: "PATCH",
    headers: {
      authorization: "566ffc24-d213-4917-9ff7-327708d679d6",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: nameInput.value,
      about: jobInput.value,
    }),
  })
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      console.log(data);
    });
}

// changeProfileInfo();

function postNewCard() {
  return fetch("https://nomoreparties.co/v1/wff-cohort-13/cards", {
    method: "POST",
    headers: {
      authorization: "566ffc24-d213-4917-9ff7-327708d679d6",
      "Content-Type": "",
    },
  });
}
