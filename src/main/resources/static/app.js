const url = 'http://localhost:8080/api/user/'
const urlRole = 'http://localhost:8080/api/role/'
const urlPrincipal = 'http://localhost:8080/api/principal/'
const allUsers = fetch(url).then(res => res.json())
const allRoles = fetch(urlRole).then(res => res.json())
const principal = fetch(urlPrincipal).then(res => res.json())

const dataTable = document.getElementById('allUsers')
const principalTable = document.getElementById('principalTable')
const editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'))
const deleteUserModal = new bootstrap.Modal(document.getElementById('deleteUserModal'))
const navBar = document.getElementById('navbar')
const showActiveAdmin = document.getElementById('showActiveAdmin')
const showActiveUser = document.getElementById('showActiveUser')
const btnAdmin = document.getElementById('btnAdmin')
const btnUser = document.getElementById('btnUser')
const title = document.getElementById('title')

//input модального окна Edit
const idEdit = document.getElementById('idEdit')
const firstNameEdit = document.getElementById('firstNameEdit')
const lastNameEdit = document.getElementById('lastNameEdit')
const ageEdit = document.getElementById('ageEdit')
const emailEdit = document.getElementById('emailEdit')
const passwordEdit = document.getElementById('passwordEdit')
const rolesEdit = document.getElementById('rolesEdit')

const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e.target)
        }
    })
}

//Заполнение <select> в New User всеми возможными ролями
on(document, 'click', '#tabNewUser', () => {
    let selectOption = ''
    allRoles.then(roles => {
        roles.forEach(role => {
            selectOption += `<option value="${role.id}">${role.name.replace('ROLE_', '')}</option>`
        })
        document.getElementById('roles').innerHTML = selectOption
    })
})
// Изменения Title при нажатии на кнопки Admin и User
on(document, 'click', '#btnUser', () => {
    title.innerHTML = "User page"
})
on(document, 'click', '#btnAdmin', () => {
    title.innerHTML = "Admin panel"
})

// Вывод пользователей в таблицу
allUsers.then(users => {
    let result = ''
    users.forEach(user => {
        let usersRoles = ''
        user.roles.forEach(role => {
            usersRoles += role.name.replace('ROLE_', '') + ' '
        })
        result += `<tr>
                        <td>${user.id}</td>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.age}</td>
                        <td>${user.email}</td>
                        <td>${usersRoles}</td>
                        <td><button type="button" class="btn btn-info btn-sm text-white" 
                        id="btnEdit">Edit</button></td> 
                        <td><button type="button" class="btn btn-danger btn-sm" id="btnDelete">Delete</button></td>   
                   </tr>`
    })

    // Отобразится только если Role Admin
    let principalRoles = ''
    principal.then(user => {
        user.roles.forEach(role => {
            principalRoles += role.name.replace('ROLE_', '') + ' '
        })
        if (principalRoles.includes('ADMIN')) {
            dataTable.innerHTML = result
        }
    })
})
    .catch(error => {
        console.log(error)
        dataTable.innerHTML = `<tr></tr><td colspan="8" class="text-center" >Не удалось получить данные</tr>`
    })

// Поведение кнопок Admin User
document.addEventListener('DOMContentLoaded', () => {
    let principalRoles = ''
    principal.then(user => {
        user.roles.forEach(role => {
            principalRoles += role.name.replace('ROLE_', '') + ' '
        })
        if (!principalRoles.includes('ADMIN')) {
            title.innerHTML = "User page"
            btnAdmin.setAttribute('hidden','hidden')
            btnUser.className = "nav-link active"
            showActiveAdmin.className = "tab-pane fade p-3"
            showActiveUser.className = "tab-pane fade show active p-3"
        }
    })
})


// Вывод principal в таблицу User information-page
principal.then(user => {
    let result = ''
    let usersRoles = ''
    user.roles.forEach(role => {
        usersRoles += role.name.replace('ROLE_', '') + ' '
    })
    result += `<tr>
                        <td>${user.id}</td>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.age}</td>
                        <td>${user.email}</td>
                        <td>${usersRoles}</td>
                   </tr>`
    principalTable.innerHTML = result
})
    .catch(error => {
        console.log(error)
        principalTable.innerHTML = `<tr></tr><td colspan="6" class="text-center" >Не удалось получить данные</tr>`
    })

//Заполнение navBar
principal.then(user => {
    let usersRoles = ''
    user.roles.forEach(role => {
        usersRoles += role.name.replace('ROLE_', '') + ' '
    })
    navBar.innerHTML = `${user.username} with roles: ${usersRoles}`
})
    .catch(error => {
        console.log(error)
        navBar.innerHTML = 'Не удалось получить данные'
    })


//Нажатие на кнопку [Add new user] вкладки [New User]
document.getElementById('formAddUser').addEventListener('submit', (e) => {
    e.preventDefault()
    let elm = document.getElementById('roles') // во вкладке New User <select> Roles
    let rolesAddUser = [] // для body: roles:{}
    let rolesAddUserValue = ''
    for (let i = 0; i < elm.options.length; i++) {
        if (elm.options[i].selected) {
            rolesAddUser.push({id: elm.options[i].value, name: 'ROLE_' + elm.options[i].innerHTML})
            rolesAddUserValue += elm.options[i].innerHTML + ' '
        }
    }
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            age: document.getElementById('age').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            roles: rolesAddUser
        })
    })
        .then(response => response.json())
        .then(user => {
            let newRow = document.createElement('tr')
            newRow.innerHTML = `<tr>
                           <td>${user.id}</td>
                           <td>${user.firstName}</td>
                           <td>${user.lastName}</td>
                           <td>${user.age}</td>
                           <td>${user.email}</td>
                           <td>${rolesAddUserValue}</td>
                           <td><button type="button" class="btn btn-info btn-sm text-white" id="btnEdit">Edit</button></td>
                           <td><button type="button" class="btn btn-danger btn-sm" id="btnDelete">Delete</button></td>
                           </tr>`
            dataTable.appendChild(newRow)

            //Отчистка полей <input> New User
            document.getElementById('formAddUser').reset()

        })
        .catch(error => console.log(error))
    document.getElementById('tabUserTable').click()
})

// Модальное окно Edit
//Нажатие на кнопку [Edit] в [User table]
let rowEdit = null
on(document, 'click', '#btnEdit', e => {
    rowEdit = e.parentNode.parentNode

    //заполнение полей модальн. окна текущ user
    idEdit.value = rowEdit.children[0].innerHTML
    firstNameEdit.value = rowEdit.children[1].innerHTML
    lastNameEdit.value = rowEdit.children[2].innerHTML
    ageEdit.value = rowEdit.children[3].innerHTML
    emailEdit.value = rowEdit.children[4].innerHTML
    passwordEdit.value = ''
    let option = ''
    allRoles.then(roles => {
        roles.forEach(role => {
            let selected = rowEdit.children[5].innerHTML.includes(role.name.replace('ROLE_', '')) ? 'selected' : ''
            option += `<option value="${role.id}" ${selected}>${role.name.replace('ROLE_', '')}</option>`
        })
        rolesEdit.innerHTML = option
    })
    editUserModal.show()
})

//Нажатие на кнопку [Edit] модальн. окна [Edit]
document.getElementById('formEditUser').addEventListener('submit', (e) => {
    e.preventDefault()
    let elm = document.getElementById('rolesEdit') // в модальн. окне Edit <select> Roles
    let rolesUserEdit = [] // для body: roles:{}
    let rolesUserEditValue = ''
    for (let i = 0; i < elm.options.length; i++) {
        if (elm.options[i].selected) {
            rolesUserEdit.push({id: elm.options[i].value, name: 'ROLE_' + elm.options[i].innerHTML})
            rolesUserEditValue += elm.options[i].innerHTML + ' '
        }
    }

    fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idEdit.value,
            firstName: firstNameEdit.value,
            lastName: lastNameEdit.value,
            age: ageEdit.value,
            email: emailEdit.value,
            password: passwordEdit.value,
            roles: rolesUserEdit
        })
    })
        .then(response => response.json())
        .catch(error => console.log(error))
    rowEdit.children[0].innerHTML = idEdit.value
    rowEdit.children[1].innerHTML = firstNameEdit.value
    rowEdit.children[2].innerHTML = lastNameEdit.value
    rowEdit.children[3].innerHTML = ageEdit.value
    rowEdit.children[4].innerHTML = emailEdit.value
    rowEdit.children[5].innerHTML = rolesUserEditValue
    editUserModal.hide()
})


// Модальное окно Delete
//Нажатие на кнопку [Delete] в [User table]
let rowDelete = null
on(document, 'click', '#btnDelete', e => {
    rowDelete = e.parentNode.parentNode
    document.getElementById('idDelete').value = rowDelete.children[0].innerHTML
    document.getElementById('firstNameDelete').value = rowDelete.children[1].innerHTML
    document.getElementById('lastNameDelete').value = rowDelete.children[2].innerHTML
    document.getElementById('ageDelete').value = rowDelete.children[3].innerHTML
    document.getElementById('emailDelete').value = rowDelete.children[4].innerHTML

    let option = ''
    allRoles.then(roles => {
        roles.forEach(role => {
            let selected = rowDelete.children[5].innerHTML.includes(role.name.replace('ROLE_', '')) ? 'selected' : ''
            option += `<option value="${role.id}" ${selected}>${role.name.replace('ROLE_', '')}</option>`
        })
        document.getElementById('rolesDelete').innerHTML = option
    })
    deleteUserModal.show()
})

//Нажатие на кнопку [Delete] модальн. окна [Delete]
document.getElementById('formDeleteUser').addEventListener('submit', (e) => {
    e.preventDefault()
    fetch(url + rowDelete.children[0].innerHTML, {
        method: 'DELETE'
    }).then(() => {
        deleteUserModal.hide()
        rowDelete.parentNode.removeChild(rowDelete)
    })
})
