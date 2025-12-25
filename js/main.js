import TextArea from './textArea.js';
import Comment from './comment.js';
import Sorting from './sorting.js';
class Main {
    input;
    textArea;
    comment;
    sorting;
    constructor() {
        this.input = document.getElementById('comment-input'); // Поле для ввода текста 
        this.textArea = new TextArea(); // Экземлпяр Текстового поля
        this.comment = new Comment(); // Экземпляр комментария
        this.sorting = new Sorting(); // Экземляр сортировки
    }
    async loadUser() {
        await Promise.all([
            this.textArea.init() // Загрузка нового пользователя
        ]);
    }
    start() {
        // Отображение избранных комментариев/ответов при нажатии
        const favoritesBtn = document.getElementById('favoritesBtn');
        favoritesBtn.addEventListener('click', () => {
            this.comment.toggleFavorites();
        });
        this.comment.restoreIsVoted(); // Сброс isVoted у комментария/ответа  
        this.sorting.displaySorting(); // Отображение сортировок
        this.sorting.displayDropDown(); // Отображение drop-down меню
        this.comment.displayRespCom(); // Загрузка комментариев/ответов из localStorage
        // Измениение input поля при вводе текста
        this.textArea.input.addEventListener('input', () => {
            this.textArea.transformTextArea();
        });
        // Публикация комментария/ответа
        const sendBtn = document.getElementById('send');
        sendBtn.addEventListener('click', () => {
            if (this.comment.isResponse === false) { // комментарий
                this.comment.createComment(this.input.value);
                this.textArea.resetTextArea();
            }
            else { // ответ
                this.comment.createResponse(this.input.value, this.comment.id, this.comment.commentName);
                this.textArea.resetTextArea();
                this.comment.isResponse = false;
                sendBtn.textContent = 'Ответить';
            }
            this.comment.displayRespCom(); // Загрузка комментариев/ответов из localStorage
        });
    }
}
const main = new Main();
main.loadUser().then(() => main.start()).catch(error => console.error('Ошибка запуска:', error));
//# sourceMappingURL=main.js.map