import Comment from './comment.js';
import { Config } from './config.js';
class Sorting {
    comment;
    sortBtn;
    dropDown;
    sortArrow;
    sortByDateBtn;
    sortByRatingBtn;
    sortByResponsesBtn;
    constructor() {
        this.comment = new Comment();
        this.sortBtn = document.getElementById('sortBtn');
        this.dropDown = document.getElementById('drop-down');
        this.sortArrow = document.getElementById('sortArrow');
        this.sortByDateBtn = document.getElementById('sort-by-date');
        this.sortByRatingBtn = document.getElementById('sort-by-rating');
        this.sortByResponsesBtn = document.getElementById('sort-by-responses');
    }
    // Отображение сортировок
    displaySorting() {
        this.arrow();
        this.sortByDate();
        this.sortByRating();
        this.sortByResponses();
    }
    // Отображение списка при нажатии
    displayDropDown() {
        const dropDownMenu = document.getElementById('drop-down');
        const sortBtn = document.getElementById('sortBtn');
        sortBtn.addEventListener('click', () => {
            dropDownMenu.className = 'visible';
        });
        document.addEventListener('click', (event) => {
            if (event.target !== sortBtn && !sortBtn.contains(event.target)) {
                dropDownMenu.classList.remove('visible');
            }
        });
    }
    // Сброс стилей у элементов drop-down списка
    restoreSort() {
        const checkMarkAll = document.querySelectorAll('.drop-down__checkmark');
        const dropDownItems = document.querySelectorAll('.drop-down__item');
        this.sortBtn.classList.add('opacity40');
        checkMarkAll.forEach((el) => {
            el.style.visibility = 'hidden';
        });
        dropDownItems.forEach((el) => {
            el.classList.add('opacity40');
        });
        Config.isSortByDate = false;
        Config.isSortByRating = false;
        Config.isSortByResponses = false;
    }
    arrow() {
        this.sortArrow.addEventListener('click', () => {
            if (Config.isSortByDate || Config.isSortByRating || Config.isSortByResponses) {
                Config.sortOrder = Config.sortOrder === 'desc' ? 'asc' : 'desc'; // Переключаем порядок
                if (this.sortArrow.style.rotate == '180deg') {
                    this.sortArrow.style.rotate = '360deg';
                }
                else {
                    this.sortArrow.style.rotate = '180deg';
                }
            }
            this.comment.displayRespCom();
        });
    }
    // Сортировка по дате
    sortByDate() {
        const checkMark = this.sortByDateBtn.querySelector('.drop-down__checkmark');
        this.sortByDateBtn.addEventListener('click', () => {
            this.restoreSort();
            if (checkMark)
                checkMark.style.visibility = 'visible';
            this.sortBtn.textContent = 'По дате';
            this.sortBtn.classList.remove('opacity40');
            this.sortByDateBtn.classList.remove('opacity40');
            Config.isSortByDate = true;
            this.comment.displayRespCom();
        });
    }
    // Сортировка по количеству оценок
    sortByRating() {
        const checkMark = this.sortByRatingBtn.querySelector('.drop-down__checkmark');
        this.sortByRatingBtn.addEventListener('click', () => {
            this.restoreSort();
            if (checkMark)
                checkMark.style.visibility = 'visible';
            this.sortBtn.textContent = 'По количеству оценок';
            this.sortBtn.classList.remove('opacity40');
            this.sortByRatingBtn.classList.remove('opacity40');
            Config.isSortByRating = true;
            this.comment.displayRespCom();
        });
    }
    // Сортировка по количеству ответов
    sortByResponses() {
        const checkMark = this.sortByResponsesBtn.querySelector('.drop-down__checkmark');
        this.sortByResponsesBtn.addEventListener('click', () => {
            this.restoreSort();
            if (checkMark)
                checkMark.style.visibility = 'visible';
            this.sortBtn.textContent = 'По количеству ответов';
            this.sortBtn.classList.remove('opacity40');
            this.sortByResponsesBtn.classList.remove('opacity40');
            Config.isSortByResponses = true;
            this.comment.displayRespCom();
        });
    }
}
export default Sorting;
//# sourceMappingURL=sorting.js.map