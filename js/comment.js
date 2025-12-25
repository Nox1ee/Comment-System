import { Config } from './config.js';
class Comment {
    comments; // Хранилище комментариев
    responses; // Хранилище ответов
    commentsContainer; // Контейнер для комментариев
    isResponse; // Если false, публикуется комментарий, иначе ответ
    id; // id комментария на который будет дан ответ
    commentName; // Имя того, на чей комментарий будет дан ответ
    constructor() {
        this.comments = JSON.parse(localStorage.getItem('comments') || '[]'); // Хранилище комментариев
        this.responses = JSON.parse(localStorage.getItem('responses') || '[]'); // Хранилище ответов
        this.commentsContainer = document.querySelector('.comments__list'); // Контейнер для комментариев
        this.isResponse = false; // Если false, публикуется комментарий, иначе ответ
        this.id = 0; // id комментария на который будет дан ответ
        this.commentName = ''; // Имя того, на чей комментарий будет дан ответ
    }
    // Сортировка по кол-ву ответов
    sortByResponses(comments) {
        comments.forEach(comment => {
            comment.responseCount = this.responses.filter(response => response.commentId === comment.id).length;
        });
        if (Config.sortOrder === 'desc') {
            return comments.sort((a, b) => b.responseCount - a.responseCount);
        }
        else {
            return comments.sort((a, b) => a.responseCount - b.responseCount);
        }
    }
    // Сортровка по кол-ву оценок
    sortByRating(comments) {
        if (Config.sortOrder === 'desc') {
            return comments.sort((a, b) => Math.abs(b.rating) - Math.abs(a.rating));
        }
        else {
            return comments.sort((a, b) => Math.abs(a.rating) - Math.abs(b.rating));
        }
    }
    // Сортировка по дате добавления
    sortByDate(comments) {
        if (Config.sortOrder == 'desc') {
            return comments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        else {
            return comments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        }
    }
    // Отображение комментариев
    displayComments() {
        let commentsToDisplay;
        // Фильтруем комментарии если показываем избранные
        if (Config.showFavorites == true) {
            commentsToDisplay = this.comments.filter(comment => comment.isFavorite);
        }
        else {
            commentsToDisplay = [...this.comments]; // Создаем копию массива
        }
        // Применяем сортировки в правильном порядке
        if (Config.isSortByResponses) {
            commentsToDisplay = this.sortByResponses(commentsToDisplay);
        }
        if (Config.isSortByRating) {
            commentsToDisplay = this.sortByRating(commentsToDisplay);
        }
        if (Config.isSortByDate) {
            commentsToDisplay = this.sortByDate(commentsToDisplay);
        }
        // Отрисовка каждого комментария
        commentsToDisplay.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.className = `comment`;
            commentDiv.id = `${comment.id}`;
            if (window.innerWidth <= 575) { // для мобильных устройств, с разрешением <= 575px
                commentDiv.innerHTML =
                    `
                <div class="comment__info">
                    <div class="comment__title">
                        <div class="comment__avatar">
                            <img src="${comment.avatar}" alt="">
                        </div>
                        <span class="comment__user-name">${comment.name}</span>
                        <span class="comment__date opacity40">${this.formatDate(comment.date)}</span>
                    </div>
                    <div class="comment__text">
                        <p>${comment.text}</p>
                    </div>
                    <div class="comment__btns">
                        <div class="comment__response">
                            <img src="img/response.svg" alt="">
                            <span class="comment__response-btn opacity40">Ответить</span>
                        </div>
                        <div class="comment__like">
                            <img class="comment__like-img" src="${comment.isFavorite ? './img/like.svg' : './img/empty-like.svg'}" alt="">
                            <span class="comment__like-btn opacity40">${comment.isFavorite ? 'В избранном' : 'В избранное'}</span>
                        </div>
                        <div class="comment__rating">
                            <img class="rating__minus" src="img/minus.svg" alt="">
                            <span class="vote-rating">${comment.rating}</span>
                            <img class="rating__plus" src="img/plus.svg" alt="">
                        </div>
                    </div>
                </div>
                `;
            }
            else {
                commentDiv.innerHTML =
                    `
                <div class="comment__avatar">
                    <img src="${comment.avatar}" alt="">
                </div>
                <div class="comment__info">
                    <div class="comment__title">
                        <span class="comment__user-name">${comment.name}</span>
                        <span class="comment__date opacity40">${this.formatDate(comment.date)}</span>
                    </div>
                    <div class="comment__text">
                        <p>${comment.text}</p>
                    </div>
                    <div class="comment__btns">
                        <div class="comment__response">
                            <img src="img/response.svg" alt="">
                            <span class="comment__response-btn opacity40">Ответить</span>
                        </div>
                        <div class="comment__like">
                            <img class="comment__like-img" src="${comment.isFavorite ? './img/like.svg' : './img/empty-like.svg'}" alt="">
                            <span class="comment__like-btn opacity40">${comment.isFavorite ? 'В избранном' : 'В избранное'}</span>
                        </div>
                        <div class="comment__rating">
                            <img class="rating__minus" src="img/minus.svg" alt="">
                            <span class="vote-rating">${comment.rating}</span>
                            <img class="rating__plus" src="img/plus.svg" alt="">
                        </div>
                    </div>
                </div>
                `;
            }
            const favBtn = commentDiv.querySelector('.comment__like-btn');
            commentDiv.setAttribute('isFav', comment.isFavorite ? 'yes' : 'no');
            if (favBtn) {
                favBtn.onclick = () => this.toggleFavorite(comment.id);
            }
            const voteMinus = commentDiv.querySelector('.rating__minus');
            if (voteMinus) {
                voteMinus.onclick = () => this.changeRating(comment.id, 'minus');
            }
            const votePlus = commentDiv.querySelector('.rating__plus');
            if (votePlus) {
                votePlus.onclick = () => this.changeRating(comment.id, 'plus');
            }
            const responseBtn = commentDiv.querySelector('.comment__response-btn');
            if (responseBtn) {
                responseBtn.onclick = () => {
                    this.id = comment.id;
                    this.commentName = comment.name ?? '';
                    const sendBtn = document.getElementById('send');
                    if (sendBtn) {
                        sendBtn.textContent = 'Ответить ' + comment.name;
                    }
                    if (this.isResponse == false) {
                        this.isResponse = true;
                    }
                };
            }
            if (this.commentsContainer) {
                this.commentsContainer.appendChild(commentDiv);
            }
        });
        this.drawRating(); // Смена цветов для рейтинга
        // Отображение кол-ва комментариев (только в режиме не-избранных)
        const commentsCountContainer = document.getElementById('commentsBtn');
        if (commentsCountContainer) {
            const count = Config.showFavorites ? commentsToDisplay.length : this.comments.length;
            const title = Config.showFavorites ? 'Избранные комментарии' : 'Комментарии';
            commentsCountContainer.innerHTML = `${title} <span class="opacity40">(${count})</span>`;
        }
    }
    // Отобржание ответов
    displayResponses() {
        let responsesToDisplay;
        if (Config.showFavorites == true) {
            responsesToDisplay = this.responses.filter(response => response.isFavorite);
        }
        else {
            responsesToDisplay = [...this.responses];
        }
        responsesToDisplay.forEach(response => {
            const responseDiv = document.createElement('div');
            responseDiv.className = 'response';
            if (window.innerWidth <= 575) { // для мобильных устройств, с разрешением <= 575px
                responseDiv.innerHTML =
                    `
                <div class="comment__info">
                    <div class="comment__title">
                        <div class="comment__avatar">
                            <img src="${response.avatar}" alt="">
                        </div>
                        <span class="comment__user-name">${response.name}</span>
                        <span class="comment__date opacity40">${this.formatDate(response.date)}</span>
                    </div>
                    <div class="comment__responseTo">
                        <img src="img/response.svg" alt="">
                        <span class="opacity40">${response.commentName}</span>
                    </div>
                    <div class="comment__text">
                        <p>${response.text}</p>
                    </div>
                    <div class="comment__btns">
                        <div class="comment__like">
                            <img class="comment__like-img" src="${response.isFavorite ? './img/like.svg' : './img/empty-like.svg'}" alt="">
                            <span class="comment__like-btn opacity40">${response.isFavorite ? 'В избранном' : 'В избранное'}</span>
                        </div>
                        <div class="comment__rating">
                            <img class="rating__minus" src="img/minus.svg" alt="">
                            <span class="vote-rating">${response.rating}</span>
                            <img class="rating__plus" src="img/plus.svg" alt="">
                        </div>
                    </div>
                </div>
                `;
            }
            else {
                responseDiv.innerHTML =
                    `
                <div class="comment__avatar">
                    <img src="${response.avatar}" alt="">
                </div>
                <div class="comment__info">
                    <div class="comment__title">
                        <span class="comment__user-name">${response.name}</span>
                        <img src="img/response.svg" alt="">
                        <span class="opacity40">${response.commentName}</span>
                        <span class="comment__date opacity40">${this.formatDate(response.date)}</span>
                    </div>
                    <div class="comment__text">
                        <p>${response.text}</p>
                    </div>
                    <div class="comment__btns">
                        <div class="comment__like">
                            <img class="comment__like-img" src="${response.isFavorite ? './img/like.svg' : './img/empty-like.svg'}" alt="">
                            <span class="comment__like-btn opacity40">${response.isFavorite ? 'В избранном' : 'В избранное'}</span>
                        </div>
                        <div class="comment__rating">
                            <img class="rating__minus" src="img/minus.svg" alt="">
                            <span class="vote-rating">${response.rating}</span>
                            <img class="rating__plus" src="img/plus.svg" alt="">
                        </div>
                    </div>
                </div>

                `;
            }
            const favBtn = responseDiv.querySelector('.comment__like-btn');
            responseDiv.setAttribute('isFav', response.isFavorite ? 'yes' : 'no');
            if (favBtn) {
                favBtn.onclick = () => this.toggleFavorite(response.id);
            }
            const voteMinus = responseDiv.querySelector('.rating__minus');
            if (voteMinus) {
                voteMinus.onclick = () => this.changeRating(response.id, 'minus');
            }
            const votePlus = responseDiv.querySelector('.rating__plus');
            if (votePlus) {
                votePlus.onclick = () => this.changeRating(response.id, 'plus');
            }
            const commentId = document.getElementById(`${response.commentId}`);
            if (commentId) {
                commentId.after(responseDiv);
            }
            else {
                if (this.commentsContainer) {
                    this.commentsContainer.append(responseDiv);
                }
            }
        });
        this.drawRating();
    }
    // Добавление комментариев
    createComment(input) {
        if (input.trim()) {
            const newComment = {
                id: Date.now(),
                name: localStorage.getItem('currentUserName'),
                avatar: localStorage.getItem('currentAvatarSrc'),
                text: input,
                date: Date.now(),
                isFavorite: false,
                rating: 0,
                isVoted: false,
            };
            this.comments.unshift(newComment);
            localStorage.setItem('comments', JSON.stringify(this.comments));
            this.displayRespCom();
        }
    }
    // Добавление ответов
    createResponse(input, id, name) {
        if (input.trim()) {
            const newResponse = {
                commentId: id,
                commentName: name,
                id: Date.now(),
                name: localStorage.getItem('currentUserName'),
                avatar: localStorage.getItem('currentAvatarSrc'),
                text: input,
                date: Date.now(),
                isFavorite: false,
                rating: 0,
                isVoted: false,
            };
            this.responses.unshift(newResponse);
            localStorage.setItem('responses', JSON.stringify(this.responses));
            this.displayRespCom();
        }
    }
    // Окончательное отображение, и комментариев, и ответов
    displayRespCom() {
        if (this.commentsContainer) {
            this.commentsContainer.innerHTML = '';
        }
        this.displayComments();
        this.displayResponses();
    }
    // Форматирование даты
    formatDate(timestamp) {
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0'); // День
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяц (нумерация с 0)
        const hours = String(date.getHours()).padStart(2, '0'); // Часы
        const minutes = String(date.getMinutes()).padStart(2, '0'); // Минуты
        return `${day}.${month} ${hours}:${minutes}`; // Форматирование без запятой
    }
    // Переключение статуса "в избранном" у комментария/ответа
    toggleFavorite(id) {
        this.responses = this.responses.map(response => {
            if (response.id === id) {
                response.isFavorite = !response.isFavorite;
            }
            return response;
        });
        this.comments = this.comments.map(comment => {
            if (comment.id === id) {
                comment.isFavorite = !comment.isFavorite;
            }
            return comment;
        });
        localStorage.setItem('responses', JSON.stringify(this.responses));
        localStorage.setItem('comments', JSON.stringify(this.comments));
        this.displayRespCom();
    }
    // Переключение отображения избранных комментариев
    toggleFavorites() {
        Config.showFavorites = !Config.showFavorites;
        const favBtn = document.getElementById('favoritesBtn');
        if (favBtn) {
            favBtn.classList.toggle('opacity40');
        }
        this.displayRespCom();
    }
    // Измениение рейтинга 
    changeRating(id, symbol) {
        this.comments.forEach(comment => {
            if ((comment.id === id) && (comment.isVoted == false)) {
                if (symbol == 'plus') {
                    comment.rating++;
                    comment.isVoted = true;
                }
                else if (symbol == 'minus') {
                    comment.isVoted = true;
                    comment.rating--;
                }
            }
        });
        this.responses.forEach(response => {
            if ((response.id === id) && (response.isVoted == false)) {
                if (symbol == 'plus') {
                    response.rating++;
                    response.isVoted = true;
                }
                else if (symbol == 'minus') {
                    response.isVoted = true;
                    response.rating--;
                }
            }
        });
        this.displayRespCom();
        localStorage.setItem('comments', JSON.stringify(this.comments));
        localStorage.setItem('responses', JSON.stringify(this.responses));
    }
    // Изменение цвета рейтинга
    drawRating() {
        const numbersOfRating = document.querySelectorAll('.vote-rating');
        numbersOfRating.forEach((el) => {
            const ratingValue = Number(el.textContent);
            if (ratingValue > 0) {
                el.style.color = 'green';
            }
            else if (ratingValue < 0) {
                el.style.color = 'red';
            }
            else {
                el.style.color = 'black';
            }
        });
    }
    // Сброс параметра isVoted у каждого комментария/ответа, при перезагрузки страницы
    restoreIsVoted() {
        this.comments.forEach(comment => {
            comment.isVoted = false;
        });
        this.responses.forEach(response => {
            response.isVoted = false;
        });
    }
}
export default Comment;
//# sourceMappingURL=comment.js.map


