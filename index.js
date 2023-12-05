/* let staffs = [
    {
        id: 1,
        name: "John",
        age: 30,
        gender: "male",
        salary: 5000,
        married: false,
        skills: ["html", "css", "js"],
        employment_at: "2020-01-01"
    },
    {
        id: 2,
        name: "Jane",
        age: 25,
        gender: "female",
        salary: 4000,
        married: true,
        skills: ["html", "css", "js", "php"],
        employment_at: "2023-06-21"
    },
    {
        id: 3,
        name: "Bob",
        age: 35,
        gender: "male",
        salary: 6000,
        married: false,
        skills: ["html", "css", "js", "python"],
        employment_at: "2021-03-15"
    },
    {
        id: 4,
        name: "Alice",
        age: 28,
        gender: "female",
        salary: 4500,
        married: true,
        skills: ["html", "css"],
        employment_at: "2022-09-01"
    },
    {
        id: 5,
        name: "Charlie",
        age: 40,
        gender: "male",
        salary: 7000,
        married: true,
        skills: ["html", "css", "js", "python", "java"],
        employment_at: "2020-07-10"
    },
    {
        id: 6,
        name: "Emily",
        age: 32,
        gender: "female",
        salary: 5000,
        married: true,
        skills: ["js", "C++"],
        employment_at: "2023-02-28"
    },
    {
        id: 7,
        name: "David",
        age: 29,
        gender: "male",
        salary: 5500,
        married: true,
        skills: ["html", "css", "js"],
        employment_at: "2021-11-05"
    },
    {
        id: 8,
        name: "Sophia",
        age: 27,
        gender: "female",
        salary: 4000,
        married: true,
        skills: ["html", "css", "js"],
        employment_at: "2022-08-15"
    }
] */

const tbody = document.getElementById("table-body");
const tableHeaders = document.querySelector("thead > tr").childNodes;
const btnAppend = document.querySelector(".col-1 > button");
const modal = document.getElementById("modal");
const ulPagination = document.querySelector(".pagination");
const modalBody = document.querySelector(".modal-body");

let staffs = null;

/**
 * обработка входящих данных
 * @param {Array} data - массив пользователей
 */
function render(data)
{
    let staffs = [];
    data.forEach((item) => {
        let person = {
            id: item.id,
            name: item.name,
            username: item.username,
            employment_at: (new Date(item.employment_at ?? new Date())).toLocaleDateString("ru-RU"),
            ['company name']: item.company.name,
            married: item.married ?? "Да",
            age: item.age ?? 20,
            salary: new Intl.NumberFormat("ru-RU", {currency: 'RUB', style: 'currency'}).format(item.salary ?? 8000)
        }
        staffs.push(person);
    });
    return staffs;
}

/**
 * Получение сотрудников
 * @param {number} itemsPerPage - сколько элементов на странице
 * @param {number} currentPage - текущая страница
 */
async function getStaffs(itemsPerPage, currentPage)
{
    tbody.innerHTML = 'Загрузка...';
    try {
        const resp = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await resp.json();

        //Имитация задержки----------------------------------------------------------
        setTimeout(() => {
            staffs = render(data);
            showStaffs(staffs,itemsPerPage, currentPage);
        }, 2000);
    } catch (err) {
        tbody.style.color = 'red';
        tbody.innerHTML = err.message;
    }
}

/**Вывод сотрудников
 * @param {Array} listStaffs - список объектов-сотрудников
 * @param {number} itemsPerPage - сколько элементов на странице
 * @param {number} currentPage - текущая страница
 * */ 
function showStaffs(staffs, itemsPerPage, currentPage) 
{
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    //чистим таблицу------------------------------------------------------------------
    if (tbody.innerHTML != '') {
        tbody.innerHTML = '';
    }

    //перебор полученных данных-------------------------------------------------------
    staffs.forEach((staff, index) => {
        //берет, например, следующую страницу с 5 по 10| index начинается с нуля------
        if (index < endIndex && index >= startIndex) {
            let tr = document.createElement("tr");
            tableHeaders.forEach((th) => {
                let td = document.createElement("td");
                switch (th.textContent) {
                    case "#":
                        td.textContent = staff.id;
                        tr.appendChild(td);
                        break;
                    case "Имя":
                        td.textContent = staff.name;
                        tr.appendChild(td);
                        break;
                    case "Фамилия":
                        td.textContent = staff.username;
                        tr.appendChild(td);
                        break;
                    case "Дата":
                        let date = staff.employment_at;
                        td.textContent = date;
                        tr.appendChild(td);
                        break;
                    case "Компания":
                        td.textContent = staff['company name'];
                        tr.appendChild(td);
                        break;
                    case "В браке":
                        td.textContent = staff.married;
                        tr.appendChild(td);
                        break;
                    case "Возраст":
                        td.textContent = staff.age;
                        tr.appendChild(td);
                        break;
                    case "Зарплата":
                        td.textContent = staff.salary;
                        tr.appendChild(td);
                        break;
                }
            });

            // Добавление кнопки удаления----------------------------------------------
            let button = document.createElement("button");
            button.textContent = "Удалить";
            button.className = "delButton";
            tr.appendChild(button);

            tbody.appendChild(tr);
        }
    });

    //Обновляем пагинацию
    ulPagination.innerHTML = '';

    const countPag = Math.ceil(staffs.length / itemsPerPage);
    for (let i = 0; i < countPag; i++) {
        const li = document.createElement("li");
        const liBtn = document.createElement("button");

        //Если в документе нет кнопок пагинации
        if (!document.querySelector(`[data-page='${i}']`)) {
            liBtn.dataset.page = i;
            liBtn.textContent = `${ i + 1 } стр`;
            liBtn.className = 'button';

            //делает активной 1 страницу-----------------------------------------------
            if (i == currentPage) {
                liBtn.classList.add('button-active');
            }

            li.appendChild(liBtn);
        
            ulPagination.classList.add('pagination-active');
            ulPagination.appendChild(li);
        }
        
    }
    
}

/**Сохранить сотрудника
 * @param {object} staff - Сотрудник, которого нужно добавить
 * @param {Array} staffs - Список сотрудников, куда нужно добавить
 */
function saveStaff(staff, staffs) 
{
    let lastId = Math.max.apply(null, staffs.map((staff) => staff.id));
    staff.id = lastId + 1;

    staff.skills = staff.skills.split(/,\s|,|\s/);

    staffs.push(staff);
}

/**
 * Удаление сотрудника
 * @param {number} id - id сотрудника
 * @param {Array} staffs - список сотрудников
 */
function deleteStaff (id, staffs) 
{
    staffs.forEach((staff) => {
        if (staff.id === id) {
            let index = staffs.indexOf(staff);
            staffs.splice(index, 1);
        }
    });
}

/**
 * Сортировать по полю
 * @param {string} field - поле
 * @param {Array} staffs - список сотрудников
 */
function sortByField(field, staffs)
{
    if (field) {
        switch (field) {
            case 'id':
                staffs.sort((a, b) => a.id > b.id ? 1 : -1);
                break;
            case 'name':
                staffs.sort((a, b) => a.name > b.name ? 1 : -1);
                break;
            case 'username':
                staffs.sort((a, b) => a.username > b.username ? 1 : -1);
                break;
            case 'age':
                staffs.sort((a, b) => a.age > b.age ? 1 : -1);
                break;
            case 'company':
                staffs.sort((a, b) => a.company > b.company ? 1 : -1);
                break;
            case 'salary':
                staffs.sort((a, b) => a.salary > b.salary ? 1 : -1);
                break;
            case 'married':
                staffs.sort((a, b) => a.married > b.married ? 1 : -1);
                break;
            case 'employment_at':
                staffs.sort((a, b) => a.employment_at > b.employment_at ? 1 : -1);
                break;
            default:
                console.log("Что-то пошло не так");
                break;
        }
    }
}

/** Чистка классов 
 * @param {Array} elemClassList  - Список классов элемента
 * @param {Array} deleteClasses  - Список классов на удаление
*/
function clearClass(elem, deleteClasses)
{
    elem.classList.forEach((elemClass) => {
        if (deleteClasses.indexOf(elemClass) != -1) {
            elem.classList.remove(elemClass);
        }
    });
}

/**Валидация */
function checkForm(staff)
{
    const generalError = document.getElementById('general-error');

    const errorName = document.getElementById('error-name');
    const inputName = document.getElementById('staff-name');

    const errorDate = document.getElementById('error-date');
    const inputDate = document.getElementById('staff-date');

    const errorSurname = document.getElementById('error-surname');
    const inputSurname = document.getElementById('staff-surname');

    const errorCompany = document.getElementById('error-company');
    const inputCompany = document.getElementById('staff-company');

    const errorSalary = document.getElementById('error-salary');
    const inputSalary = document.getElementById('staff-salary');

    const errorAge = document.getElementById('error-age');
    const inputAge = document.getElementById('staff-age');


    const errorMarried = document.getElementById('error-married');


    //Очистка стилей---------------------------------------------------------------
    clearClass(generalError, ['show']);
    clearClass(errorMarried, ['show']);

    clearClass(inputName, ['is-invalid']);

    clearClass(inputDate, ['is-invalid']);

    clearClass(inputSurname, ['is-invalid']);

    clearClass(inputCompany, ['is-invalid']);

    clearClass(inputSalary, ['is-invalid']);

    clearClass(inputAge, ['is-invalid']);

    //Регулярки--------------------------------------------------------------------
    const onlyLetters = /[^A-zА-я]/;
    const onlyNumbers = /\D/;
    const regMarried = /да|нет/i;
    const regDate = /\d{2}\.\d{2}\.\d{4}/; 

    //Проверка на заполненость полей-----------------------------------------------
    if (staff.name == '' || staff.surname == ''|| staff.salary == '') {

        generalError.classList.add('show');
        generalError.classList.add('invalid-feedback');

        return false;
    }

    if (staff.name.search(onlyLetters) != -1) {

        inputName.classList.add('is-invalid');

        return false;
    } else if (staff.employment_at.search(regDate) == -1 && (new Date(staff.employment_at)) > (new Date())) {

        inputDate.classList.add('is-invalid');

        return false;
    }  else if (staff.surname.search(onlyLetters) != -1) {

        inputSurname.classList.add('is-invalid');

        return false;
    } else if (staff.company.search(onlyLetters) != -1) {

        inputCompany.classList.add('is-invalid');

        return false;
    } else if (staff.salary.search(onlyNumbers) != -1) {

        inputSalary.classList.add('is-invalid');

        return false;
    } else if (staff.age.search(onlyNumbers) != -1 && +staff.age > 130) {

        inputAge.classList.add('is-invalid');

        return false;
    } else if (staff.married.search(regMarried) == -1) {

        errorMarried.classList.add('error');
        errorMarried.classList.add('show');

        return false;
    }
}


document.addEventListener("DOMContentLoaded", function() 
{
    // Очищаем поле фильтра----------------------------------------------------------
    document.getElementById('filter').value = '';

    //Данные для пагинации ----------------------------------------------------------
    const itemsPerPage = 5;
    let currentPage = 0;

    // Подгружаем таблицу------------------------------------------------------------
    getStaffs(itemsPerPage,currentPage);


    //Пагинация----------------------------------------------------------------------
    document.querySelector(".pagination").addEventListener("click", function(e) 
    {
        let thisPage = e.target.dataset.page;
        currentPage = +(thisPage);

        //Настройка стилей для активной кнопки
        let liBtnList = document.querySelectorAll('.pagination > li > button');
        liBtnList.forEach((btn) => {
            btn.className = 'button';
        });
        e.target.classList.add('button-active');


        showStaffs(staffs,itemsPerPage, currentPage);
    });

    // Показ формы по добавлению сотрудника------------------------------------------
    btnAppend.addEventListener("click", () => {
        modal.classList.add('show');
    });

    // Отслеживание кликов в форме по добавлению сотрудника--------------------------
    document.querySelector(".modal-dialog > .modal-content").addEventListener("click", function(e) 
    {
        // Скрытие формы-------------------------------------------------------------
        if (e.target.classList.contains("close-modal")) {
            modal.classList.remove('show');
        }

        //Получение данных с формы---------------------------------------------------
        if (e.target.classList.contains("save-modal")) {
            const formData = new FormData(document.forms[0]);
            const data = Object.fromEntries(formData.entries());
        
            if (checkForm(data)) {
                saveStaff(data, staffs);
                document.forms[0].reset();

                // Скрытие формы--------------------------------------------------------- 
                modal.classList.remove('show');

                showStaffs(staffs,itemsPerPage, currentPage);
            }
        }
    });

    // Отслеживание кликов по таблице------------------------------------------------ 
    document.querySelector("table").addEventListener("click", function(e) 
    {
        // Удаление записей---------------------------------------------------------- 
        let tr = e.target.parentElement;
        let id = Number(tr.childNodes[0].textContent);
        deleteStaff(id, staffs);

        // Сортировка по полю-------------------------------------------------------- 
        tdSort = e.target.dataset.sort;
        sortByField(tdSort, staffs);

        showStaffs(staffs,itemsPerPage, currentPage);
    });

    // Фильтр------------------------------------------------------------------------ 
    let word = '';
    document.getElementById("filter").addEventListener("keydown", function(e) {

        let regex = /Key([A-Za-z]|[А-Яа-я])/;
        if (e.key == 'Backspace') {
            
            if (word != '') {

                 //удаление символов-----------------------------------------------------
                word = word.substring(0, word.length - 1);
            }

        } else if (e.code.search(regex) != -1) {
            //добавление символов---------------------------------------------------
            word += e.key;
        }

        //фильтрация----------------------------------------------------------------
        const fillterList = staffs.filter((staff) => {
            // Фильтр по имени -----------------------------------------------------

            let name = staff.name.toLowerCase();
            if (name.indexOf(word.toLowerCase()) != -1) {
                return staff;
            }
        });
        showStaffs(fillterList, itemsPerPage, currentPage);
        
    });
});
