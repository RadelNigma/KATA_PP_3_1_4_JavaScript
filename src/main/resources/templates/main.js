// const url = 'http://localhost:8080/admin'
//
// fetch(url).then(
//     res => {
//         res.json().then(
//             data => {
//                 console.log(data)
//             }
//         )
//     }
// )

const url = 'http://localhost:8080/api/users'

const fetchData = fetch(url).then(
    res => {
        res.json().then(
            data => {
                // console.log(data)
                if (data.length > 0) {
                    let temp = ""
                    data.forEach((u) => {
                        temp += "<tr>"
                        temp += "<td>" + u.id + "</td>"
                        temp += "<td>" + u.firstName + "</td>"
                        temp += "<td>" + u.lastName + "</td>"
                        temp += "<td>" + u.age + "</td>"
                        temp += "<td>" + u.email + "</td>"
                        temp1 = ""
                        u.roles.forEach(r => {
                            temp1 += r.name.replace('ROLE_', '') + ' '
                        })
                        temp += "<td>" + temp1 + "</td>"
                        temp += "<td>" +
                            `<button type = "button" class = "btn btn-info btn-sm text-white" data-bs-toggle = "modal" 
                            data-bs-target="#editUserModal${u.id}">Edit</button>`
                            +"</td>"
                        temp += "<td>" +
                            `<button type="button" class="btn btn-danger btn-sm" data-bs-toggle="modal"
                             data-bs-target="#deleteModal${u.id}">Delete</button>`
                            +"</td>"
                    })
                    // document.getElementById('data').innerHTML = temp
                }
            }
        )
    }
)