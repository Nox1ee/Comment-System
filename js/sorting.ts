import Comment from './comment.js'
import { Config } from './config.js'


class Sorting {
    comment: Comment;
    sortBtn: HTMLButtonElement;
    dropDown: HTMLElement;
    sortArrow: HTMLButtonElement;
    sortByDateBtn: HTMLButtonElement;
    sortByRatingBtn: HTMLButtonElement;
    sortByResponsesBtn: HTMLButtonElement;
    constructor() {
        this.comment = new Comment();

        this.sortBtn = document.getElementById('sortBtn') as HTMLButtonElement;
        this.dropDown = document.getElementById('drop-down') as HTMLElement;
        this.sortArrow = document.getElementById('sortArrow') as HTMLButtonElement;
        this.sortByDateBtn = document.getElementById('sort-by-date') as HTMLButtonElement; 
        this.sortByRatingBtn = document.getElementById('sort-by-rating') as HTMLButtonElement; 
        this.sortByResponsesBtn = document.getElementById('sort-by-responses') as HTMLButtonElement; 
    }

    // Отображение сортировок
    displaySorting():void {
        this.arrow();
        this.sortByDate();
        this.sortByRating();
        this.sortByResponses();
    }

    // Отображение списка при нажатии
    displayDropDown():void { 
        const dropDownMenu = document.getElementById('drop-down') as HTMLElement;
        const sortBtn = document.getElementById('sortBtn') as HTMLButtonElement;

        sortBtn.addEventListener('click', () => {
            dropDownMenu.className = 'visible'
        })

        document.addEventListener('click', (event: MouseEvent) => {
            if (event.target !== sortBtn && !sortBtn.contains(event.target as Node)) {
                dropDownMenu.classList.remove('visible');
            }
        });
    }

    // Сброс стилей у элементов drop-down списка
    restoreSort():void {
        const checkMarkAll = document.querySelectorAll<HTMLElement>('.drop-down__checkmark')
        const dropDownItems = document.querySelectorAll<HTMLElement>('.drop-down__item')
    
        this.sortBtn.classList.add('opacity40')

        checkMarkAll.forEach((el: HTMLElement) => {
            el.style.visibility = 'hidden'
        })
        
        dropDownItems.forEach((el: HTMLElement) => {
            el.classList.add('opacity40')
        })

        Config.isSortByDate = false;
        Config.isSortByRating = false;
        Config.isSortByResponses = false;
    }

    arrow():void {
        this.sortArrow.addEventListener('click', () => {
            if (Config.isSortByDate || Config.isSortByRating || Config.isSortByResponses) {
                Config.sortOrder = Config.sortOrder === 'desc' ? 'asc' : 'desc'; // Переключаем порядок
                if (this.sortArrow.style.rotate == '180deg') {
                    this.sortArrow.style.rotate = '360deg'
                } else {
                    this.sortArrow.style.rotate = '180deg'
                }
            }
            this.comment.displayRespCom();
        })
    }

    // Сортировка по дате
    sortByDate():void {
        const checkMark = this.sortByDateBtn.querySelector<HTMLLIElement>('.drop-down__checkmark')

        this.sortByDateBtn.addEventListener('click', () => {
            this.restoreSort();
            if (checkMark) checkMark.style.visibility = 'visible'
            this.sortBtn.textContent = 'По дате'
            this.sortBtn.classList.remove('opacity40')
            this.sortByDateBtn.classList.remove('opacity40')
            Config.isSortByDate = true;
            this.comment.displayRespCom();
        })
    }

    // Сортировка по количеству оценок
    sortByRating():void {
        const checkMark = this.sortByRatingBtn.querySelector<HTMLElement>('.drop-down__checkmark')

        this.sortByRatingBtn.addEventListener('click', () => {
            this.restoreSort();
            if (checkMark) checkMark.style.visibility = 'visible';
            this.sortBtn.textContent = 'По количеству оценок';
            this.sortBtn.classList.remove('opacity40');
            this.sortByRatingBtn.classList.remove('opacity40');
            Config.isSortByRating = true;
            this.comment.displayRespCom();
        })
    }

    // Сортировка по количеству ответов
    sortByResponses():void {
        const checkMark = this.sortByResponsesBtn.querySelector<HTMLElement>('.drop-down__checkmark');

        this.sortByResponsesBtn.addEventListener('click',() => {
            this.restoreSort();
            if (checkMark) checkMark.style.visibility = 'visible';
            this.sortBtn.textContent = 'По количеству ответов';
            this.sortBtn.classList.remove('opacity40');
            this.sortByResponsesBtn.classList.remove('opacity40');
            Config.isSortByResponses = true;
            this.comment.displayRespCom();
        })
    }
}

export default Sorting;