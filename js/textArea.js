class TextArea {
    input;
    name;
    avatar;
    spinner;
    maxSymbols;
    buttonSend;
    warning;
    constructor() {
        this.input = document.getElementById('comment-input');
        this.name = document.getElementById('name');
        this.maxSymbols = document.getElementById('max_symbols');
        this.buttonSend = document.getElementById('send');
        this.warning = document.getElementById('warning');
        if (window.innerWidth <= 575) {
            this.avatar = document.querySelector('.avatar-mobile');
            this.spinner = document.querySelector('.spinner-mobile');
        }
        else {
            this.avatar = document.querySelector('.avatar');
            this.spinner = document.querySelector('.spinner');
        }
    }
    // Запрос данных пользователя
    async fetchData() {
        // Показываем индикатор загрузки
        this.name.textContent = 'Данные загружаются...';
        this.avatar.style.display = 'none';
        this.spinner.style.display = 'block';
        try {
            const response = await fetch('https://randomuser.me/api/');
            if (!response.ok) {
                throw new Error(`Ошибка сети: ${response.status}`);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            this.name.textContent = 'Ошибка загрузки';
            return undefined;
        }
    }
    // Ожидание загрузки
    async init() {
        const data = await this.fetchData();
        if (data && data.results.length > 0) {
            // Обработка полученных данных
            const user = data.results[0];
            const fullName = `${user?.name.first} ${user?.name.last}`;
            this.name.textContent = fullName;
            this.spinner.style.display = 'none';
            // Настройка стилей аватра 
            const avatarSize = window.innerWidth <= 575 ? '50px' : '61px';
            this.avatar.style.borderRadius = '30px';
            this.avatar.style.height = avatarSize;
            this.avatar.style.width = avatarSize;
            this.avatar.style.display = 'block';
            if (user)
                this.avatar.src = user.picture.thumbnail;
            localStorage.setItem('currentUserName', fullName);
            if (user)
                localStorage.setItem('currentAvatarSrc', user.picture.thumbnail);
            localStorage.setItem('isVoted', 'false');
        }
    }
    // Сброс стилей для TextArea
    resetTextArea() {
        this.input.style.height = '61px'; // Сброс высоты;
        this.input.value = ''; // Сброс текста
        this.buttonSend.style.background = '#A1A1A1';
        this.buttonSend.style.opacity = '40%';
        this.buttonSend.style.cursor = 'not-allowed';
        this.buttonSend.disabled = true;
        this.maxSymbols.textContent = 'Макс. 1000 символов';
        this.maxSymbols.style.color = 'black';
        this.maxSymbols.style.opacity = '40%';
        this.warning.style.visibility = 'hidden';
    }
    // Изменение размера TextArea при вводе текста
    transformTextArea() {
        this.input.style.height = '61px'; // Сброс высоты
        this.input.style.height = `${this.input.scrollHeight}px`; // Установка новой высоты
        const currentLength = this.input.value.length;
        this.maxSymbols.textContent = (`${currentLength} / 1000`);
        if ((currentLength > 0) && (currentLength <= 1000)) {
            this.buttonSend.style.background = '#ABD873';
            this.buttonSend.style.opacity = '100%';
            this.buttonSend.style.cursor = 'pointer';
            this.buttonSend.disabled = false;
            this.maxSymbols.style.color = 'black';
            this.maxSymbols.style.opacity = '40%';
            this.warning.style.visibility = 'hidden';
        }
        else if (currentLength > 1000) {
            this.buttonSend.style.background = '#A1A1A1';
            this.buttonSend.style.opacity = '40%';
            this.buttonSend.style.cursor = 'not-allowed';
            this.buttonSend.disabled = true;
            this.maxSymbols.style.color = 'red';
            this.maxSymbols.style.opacity = '100%';
            this.warning.style.visibility = 'visible';
        }
        else {
            this.resetTextArea();
        }
    }
}
export default TextArea;
//# sourceMappingURL=textArea.js.map