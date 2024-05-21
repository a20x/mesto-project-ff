import "./pages/index.css";
import { createCard, deleteCard, likeButton, deleteCardCallback } from "./components/card.js";
import { openModal, closeModal } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import { getUserData, getCardsData, editProfileInfoOnServer, postNewCard, changeAvatarOnServer, checkImageUrl } from './components/api.js';

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

// объект с необходимыми классами

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible"
};

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

popupNewCard.addEventListener("submit", (evt) => {
  addNewCard(evt);
});

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

function editProfileInfo() {
  const popupProfileEditSubmitButton = popupProfileEdit.querySelector('.popup__button');
  popupProfileEditSubmitButton.textContent = 'Сохранение...';

  editProfileInfoOnServer(nameInput, jobInput)
    .then((data) => {
      profileTitle.textContent = data.name;
      profileDescription.textContent = data.about;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      popupProfileEditSubmitButton.textContent = 'Сохранить';
      closeModal(popupProfileEdit);
    });
}

// слушатель на submit формы

const profileEditForm = popupProfileEdit.querySelector(".popup__form");

profileEditForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  editProfileInfo();
})

// функция добавления новой карточки

let currentUserData;

function addNewCard(evt) {
  evt.preventDefault();

  const popupNewCardForm = popupNewCard.querySelector('.popup__form');

  const popupAddNewCardSubmitButton = popupNewCardForm.querySelector('.popup__button');
  popupAddNewCardSubmitButton.textContent = 'Сохранение...';

  const popupInputCardName = popupNewCardForm.querySelector(".popup__input_type_card-name");
  const popupInputCardUrl = popupNewCardForm.querySelector(
    ".popup__input_type_url"
  );

  const newCardData = {
    name: popupInputCardName.value,
    link: popupInputCardUrl.value,
  };

  postNewCard(newCardData)
    .then((cardData) => {
      return createCard(
        cardData,
        deleteCardCallback,
        likeButton,
        openImagePopup,
        cardLikeCounter,
        currentUserData
      );
    })
    .then((res) => {
      cardsContainer.prepend(res);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      popupAddNewCardSubmitButton.textContent = 'Сохранить';
      closeModal(popupNewCard);
    })
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

// установка данных пользователя в профиль

const profileImage = document.querySelector(".profile__image");

function setProfileUserData() {
  getUserData()
    .then((userData) => {
      profileImage.style.backgroundImage = `url('${userData.avatar}')`;
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
    })
    .catch((err) => {
      console.log(err);
    });
}

const popupEditAvatar = document.querySelector('.popup_type_edit_avatar');

profileImage.addEventListener('click', () => {
  openModal(popupEditAvatar);
})

// ждем выполнения запросов о данных пользователя и данных карточки, и вызываем их функции

Promise.all([getUserData(), getCardsData()])
  .then(([userData, cardsData]) => {
    currentUserData = userData;
    setProfileUserData();

    cardsData.forEach((cardData) => {
      const makeCard = createCard(
        cardData,
        deleteCardCallback,
        likeButton,
        openImagePopup,
        cardLikeCounter,
        currentUserData
      );
      cardsContainer.append(makeCard);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// функция - счетчик количества лайков на карточке

export function cardLikeCounter(cardElement, amountOfLikes) {
  const cardLikeCount = cardElement.querySelector('.card__like-counter');

  if(amountOfLikes > 0) {
    cardLikeCount.classList.add('card__like-counter-active');
    cardLikeCount.textContent = amountOfLikes;
  } else {
    cardLikeCount.classList.remove('card__like-counter-active');
    cardLikeCount.textContent = '';
  }
}

// функция смены аватара

const formEditAvatar = popupEditAvatar.querySelector('.popup__form');

function changeAvatar() {
  const popupAvatarInput = formEditAvatar.querySelector('.popup__input_type_url');
  const popupAvatarButton = formEditAvatar.querySelector('.popup__button');
  formEditAvatar.textContent = 'Сохранение...';

  profileImage.style.backgroundImage = `url('${popupAvatarInput.value}')`;

  const avatarLink = popupAvatarInput.value;

  checkImageUrl(avatarLink)
    .then(() => {
      return changeAvatarOnServer(avatarLink);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      popupAvatarButton.textContent = 'Сохранить';
      closeModal(popupEditAvatar);
    })
};

formEditAvatar.addEventListener('submit', (evt) => {
  evt.preventDefault();
  changeAvatar();
});
