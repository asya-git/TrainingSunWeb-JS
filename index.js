let staffs = [
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
]

const tbody = document.getElementById("table-body");
const tableHeaders = document.querySelector("thead > tr").childNodes;
const btnAppend = document.querySelector(".col-1 > button");
const modal = document.getElementById("modal");

/**Вывод сотрудников
 * @param {Array} listStaffs - список объектов-сотрудников
 * */ 
function showStaffs(staffs) 
{
    if (!tbody.innerHTML == '') {
        tbody.innerHTML = '';
    }
    staffs.forEach((staff) => {
        let tr = document.createElement("tr");
        tableHeaders.forEach((th) => {
            let td = document.createElement("td");
            switch (th.textContent) {
                case "#":
                    td.innerHTML = staff.id;
                    tr.appendChild(td);
                    break;
                case "Имя":
                    td.innerHTML = staff.name;
                    tr.appendChild(td);
                    break;
                case "Навыки":
                    td.innerHTML = staff.skills.join(', ');
                    tr.appendChild(td);
                    break;
                case "Дата":
                    let date = new Date(staff.employment_at);
                    td.innerHTML = date.toLocaleDateString("ru-RU");
                    tr.appendChild(td);
                    break;
                case "Пол":
                    td.innerHTML = staff.gender == "male" ? "мужской" : "женский";
                    tr.appendChild(td);
                    break;
                case "Возраст":
                    td.innerHTML = staff.age;
                    tr.appendChild(td);
                    break;
                case "Зарплата":
                    td.innerHTML =  new Intl.NumberFormat("ru-RU", {currency: 'RUB', style: 'currency'}).format(staff.salary);
                    tr.appendChild(td);
                    break;
            }
            
        });

        // Добавление кнопки удаления----------------------------------------------- 
        let button = document.createElement("button");
        button.innerHTML = "Удалить";
        button.className = "delButton";
        tr.appendChild(button);

        tbody.appendChild(tr);
    });
}

/**Сохранить сотрудника
 * @param {object} staff - Сотрудник, которого нужно добавить
 * @param {Array} staffs - Список сотрудников, куда нужно добавить
 */
function saveStaff(staff, staffs) 
{
    staff.id = staffs.length;
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
            case 'age':
                staffs.sort((a, b) => a.age > b.age ? 1 : -1);
                break;
            case 'gender':
                staffs.sort((a, b) => a.gender > b.gender ? 1 : -1);
                break;
            case 'salary':
                staffs.sort((a, b) => a.salary > b.salary ? 1 : -1);
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
document.addEventListener("DOMContentLoaded", function() 
{
    // Очищаем поля и формы
    document.getElementById('filter').value = '';
    

    // Подгружаем таблицу----------------------------------------------------------- 
    showStaffs(staffs);

    // Показ формы по добавлению сотрудника----------------------------------------- 
    btnAppend.addEventListener("click", () => {
        modal.classList.add('show');
    });

    // Отслеживание кликов в форме по добавлению сотрудника------------------------- 
    document.querySelector(".modal-dialog > .modal-content").addEventListener("click", function(e) 
    {
        // Скрытие формы------------------------------------------------------------ 
        if (e.target.classList.contains("close-modal")) {
            modal.classList.remove('show');
        }

        //Получение данных с формы----------------------------------------------------- 
        if (e.target.classList.contains("save-modal")) {
            const formData = new FormData(document.forms[0]);
            const data = Object.fromEntries(formData.entries());
        
            saveStaff(data, staffs);
            document.forms[0].reset();

            // Скрытие формы--------------------------------------------------------- 
            modal.classList.remove('show');

            showStaffs(staffs);
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

        showStaffs(staffs);
    });

    // Фильтр------------------------------------------------------------------------ 
    let word = '';
    document.getElementById("filter").addEventListener("keydown", function(e) {

        let regex = /Key([A-Za-z]|[А-Яа-я])/;
        if (e.key == 'Backspace') {
            
            if (word == '') {
                return;
            }
            //удаление символов
            word = word.substring(0, word.length - 1);

        } else if (e.code.search(regex) != -1) {
            //добавление символов
            word += e.key;
        }

        //фильтрация
        let fillterList = [];
        staffs.filter((staff) => {
            // Фильтр по имени 
            let name = staff.name.toLowerCase();
            if (name.indexOf(word) != -1) {
                fillterList.push(staff);
            }
        });
        showStaffs(fillterList);
        
    });
});
