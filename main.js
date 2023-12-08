var app = new Vue({
    el: '#app',
    data: {
        showModal: false,
        generalError: true,
        errorsField: {
            name: true,
            employment_at: true,
            surname: true,
            company: true,
            salary: true,
            age: true,
        },
        dataUsers: [],
        users: [],
        isCheckUser: false,
        newUser: {
            name: '',
            employment_at: '',
            surname: '',
            company: '',
            salary: '',
            age: '',
        },
        statusMessage: true,
        sortBy: null,
        message: '',
        /* dataSort: [], */
        searchInput: '',
        fillterList: [],
        url: 'https://jsonplaceholder.typicode.com/users',
        /* activPage: [], */
        /* listPages: [], */
        itemsPerPage: 6,
        currentPage: 1,
    },
    created: function(){
        this.getStaffs();
        //this.render();
    },
    computed: {
        pagination: function() {

            let listPages = [];

            for (let i = 1; i < (Math.ceil(this.dataUsers.length / this.itemsPerPage)) + 1; i++) {
                
                listPages.push(
                    {
                        pageNumber: i,
                        isActive: this.currentPage == i,
                    },
                );
            }

            return listPages;
        },
        showUsers: function() {

            let users = [...this.dataUsers];

            if (this.searchInput != '') {
                users = users.filter((user) => {
                    // Фильтр по имени -----------------------------------------------------
        
                    let name = user.name.toLowerCase();
                    if (name.indexOf(this.searchInput.toLowerCase()) != -1) {
                        return user;
                    }
                });
    
                if (users.length > 0) {
                    this.statusMessage = true;
                    this.message = "";
                } else {
                    this.statusMessage = false;
                    this.message = "Пользователь не найден!"
                }
            } 

            users = users.slice((this.currentPage * this.itemsPerPage - this.itemsPerPage), (this.currentPage * this.itemsPerPage))
            .map(user => {
                console.log(user);
                return {
                id: user.id,
                name: user.name,
                username: user.username ?? user.surname,
                employment_at: (new Date(user.employment_at ?? new Date())).toLocaleDateString("ru-RU"),
                ['company name']: user.company.name ?? user.company,
                married: user.married ?? "Да",
                age: user.age ?? 20,
                salary: new Intl.NumberFormat("ru-RU", {currency: 'RUB', style: 'currency'}).format(user.salary ?? 8000)
            }})

            return users;
        },
        clearForm: function() {
            if (this.showModal == false) {
                this.newUser = {
                    name: '',
                    employment_at: '',
                    surname: '',
                    company: '',
                    salary: '',
                    age: '',
                }
                this.errorsField = {
                    name: true,
                    employment_at: true,
                    surname: true,
                    company: true,
                    salary: true,
                    age: true,
                }
                this.statusMessage = true;
                this.message = '';

            }
        },
    },
    methods: {
        clearForm: function() {
            this.isCheckUser = false;

            this.newUser = {
                name: '',
                employment_at: '',
                surname: '',
                company: '',
                salary: '',
                age: '',
            };
            errorsField = {
                name: true,
                employment_at: true,
                surname: true,
                company: true,
                salary: true,
                age: true,
            };
            this.statusMessage = true;
            this.message =  '';
        },
        closeModel: function() {

            this.clearForm();

            this.showModal = false;
        },
        deleteUser:  async function(event) {
            const userId = event.target.parentNode.parentNode.firstElementChild.textContent;
            try {
                const resp = await fetch(`${this.url}/${userId}`,{
                    method: 'DELETE'
                });

                if (resp.ok) {
                    console.log(
                        {
                            status: 'true',
                            message: `Пользователь с id: ${userId} - Успешно удалён!`,
                        }
                    );
                    this.statusMessage = true,
                    this.message =  `Пользователь с id: ${userId} - Успешно удалён!`;
                }

                setTimeout(() => {
                    this.statusMessage = true;
                    this.message =  '';
                }, 2000);
                
            } catch (err) {
                console.log('error');
                console.log(
                    {
                        status: 'false',
                        message: `Пользователя с id: ${userId} - Не удалось удалить!`,
                    }
                );
                this.statusMessage = false,
                this.message =  `Пользователя с id: ${userId} - Не удалось удалить!`;
            }
        },
        
        changePage: function(event) {

            this.currentPage = Number(event.target.innerHTML);
        },
        saveUser: function() {
            this.checkUser();
            if (this.isCheckUser) {

                this.statusMessage = true;
                this.message = 'Успешное сохранение!';
                setTimeout(() => {
                    this.showModal = false;

                    this.clearForm();
                    this.message = '';
                }, 2000);

            } else {
                this.statusMessage = false;
                this.message = 'Проверьте все поля!';
            }

        },
        checkUser: function() {

            //Регулярки--------------------------------------------------------------------
            const notLetters = /[^A-zА-я]/;
            const notNumbers = /\D/;
            const regDate = /\d{4}-\d{2}-\d{2}/;
           
            //Заполненость полей
            if (this.newUser.name && this.newUser.surname && this.newUser.salary && this.newUser.age && this.newUser.company && this.newUser.employment_at) {
                this.generalError = false;
            } else {
                this.generalError = true;
            }

            //валидность полей
            this.errorsField.name = this.newUser.name.search(notLetters) == -1 && this.newUser.name != '' ? false : true;
            this.errorsField.surname = this.newUser.surname.search(notLetters) == -1 && this.newUser.surname != ''  ? false : true;
            this.errorsField.company = this.newUser.company.search(notLetters) == -1 && this.newUser.company != ''  ? false : true;
            this.errorsField.salary = this.newUser.salary.search(notNumbers) == -1 && this.newUser.salary != ''  ? false : true;

            this.errorsField.employment_at = this.newUser.employment_at.search(regDate) != -1 
                && this.newUser.employment_at != '' && (new Date(this.newUser.employment_at)) < (new Date()) ? false : true;

            this.errorsField.age = this.newUser.age.search(notNumbers) == -1 
                && this.newUser.age != '' && Number(this.newUser.age) < 130 ? false : true;

            //Готовность к сохранению
            if (!this.errorsField.name && !this.errorsField.surname && !this.errorsField.surncompanyame && !this.errorsField.salary && !this.errorsField.salary && !this.errorsField.employment_at  && !this.errorsField.age) {
                
                this.isCheckUser = true;
            } else {
                this.isCheckUser = false;
            }
            
        },
        getStaffs: async function() {
            try {
                const resp = await fetch(this.url);
                const data = await resp.json();
        
                this.dataUsers = data;
            } catch (err) {
                console.log('error');
            }
        },
        sortUsers: function(event) {
            const field = event.target.dataset.sort;

            this.userSotr = this.dataUsers;

            //this.dataUsers = [];

            //console.log(field);

            if (field) {
                //console.log('tyt');
                switch (field) {
                    case 'id':
                        //console.log('tyt');
                        this.userSotr.sort((a, b) => a.id > b.id ? 1 : -1);
                        break;
                    case 'name':
                        this.userSotr.sort((a, b) => a.name > b.name ? 1 : -1);
                        break;
                    case 'username':
                        this.userSotr.sort((a, b) => a.username > b.username ? 1 : -1);
                        break;
                    case 'age':
                        this.userSotr.sort((a, b) => a.age > b.age ? 1 : -1);
                        break;
                    case 'company':
                        this.userSotr.sort((a, b) => a.company > b.company ? 1 : -1);
                        break;
                    case 'salary':
                        this.userSotr.sort((a, b) => a.salary > b.salary ? 1 : -1);
                        break;
                    case 'married':
                        this.userSotr.sort((a, b) => a.married > b.married ? 1 : -1);
                        break;
                    case 'employment_at':
                        this.userSotr.sort((a, b) =>  (new Date(a.employment_at)) > (new Date(b.employment_at)) ? 1 : -1);
                        break;
                    default:
                        console.log("Что-то пошло не так");
                        break;
                }

                console.log(this.dataUsers);
            }
            //console.log(this.data);
        },
    },

})