const staffs = [
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

let tbody = document.getElementById("table-body");
const thList = document.querySelector("thead > tr").childNodes;
const btAppend = document.querySelector(".col-1 > button");
let modal = document.getElementById("modal");


//Подгружаем таблицу
function updateTable(staffs) {
    staffs.forEach((staff) => {
        let tr = document.createElement("tr");

        thList.forEach((th) => {
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
        tbody.appendChild(tr);
    });
}

updateTable(staffs);


//Накладываем событие на кнопку
btAppend.addEventListener("click", () => {
    modal.classList.add('show');
});

let idLastStaff = 8;

document.addEventListener("click", function(e) 
{
    //скрытие формы
    if (e.target.classList.contains("close-modal")) {
        modal.classList.remove('show');
    }

    //Получение данных с формы
    if (e.target.classList.contains("save-modal")) {
        const formData = new FormData(document.forms[0]);
        const data = Object.fromEntries(formData.entries());

        //сделать нормальный id
    
        data.id = ++idLastStaff;
        data.skills = data.skills.split(/,\s|,|\s/);

        updateTable([data]);
    }
    
    
});




