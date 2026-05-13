// Morklasse - alle ansatte har navn og etternavn
class Employee {
    constructor(name, surname) {
        this.name = name
        this.surname = surname
    }
}

// StaffMember arver fra Employee
class StaffMember extends Employee {
    constructor(name, surname, picture, email) {
        super(name, surname)
        this.picture = picture
        this.email = email
        this.status = "In"
        this.outTime = ""
        this.duration = ""
        this.expectedReturn = ""
    }

    staffMemberIsLate() {
        // Sjekker om ansatt er forsinket
    }
}

// DeliveryDriver arver fra Employee
class DeliveryDriver extends Employee {
    constructor(name, surname, vehicle, telephone, address, returnTime) {
        super(name, surname)
        this.vehicle = vehicle
        this.telephone = telephone
        this.address = address
        this.returnTime = returnTime
    }

    deliveryDriverIsLate() {
        // Sjekker om sjåfør er forsinket
    }
}// Liste som lagrer alle staff-objekter
let staffList = []

// Henter ansatte fra API og fyller tabellen
function staffUserGet() {
    fetch("http://backend.restapi.co.za/items/staff")
    .then(response => response.json())
    .then(data => {
        // Lager 5 StaffMember-objekter fra API-dataen
        for (let i = 0; i < 5; i++) {
            let person = data.data[i]
           let staff = new StaffMember(
    person.name,
    person.surname,
    person.image,
    person.email_address
)
            staffList.push(staff)
        }
        // Fyller tabellen
        updateStaffTable()
    })
}

// Oppdaterer Staff-tabellen
function updateStaffTable() {
    let tableBody = document.getElementById("staffBody")
    tableBody.innerHTML = ""

    for (let i = 0; i < staffList.length; i++) {
        let s = staffList[i]
        tableBody.innerHTML += `
            <tr onclick="selectRow(this)" data-index="${i}">
                <td><img src="${s.picture}" width="50"></td>
                <td>${s.name}</td>
                <td>${s.surname}</td>
                <td>${s.email}</td>
                <td>${s.status}</td>
                <td>${s.outTime}</td>
                <td>${s.duration}</td>
                <td>${s.expectedReturn}</td>
            </tr>
        `
    }
}

// Kjører når siden lastes
staffUserGet()
// Holder styr på hvilken rad som er valgt
let selectedIndex = -1

function selectRow(row) {
    // Fjerner markering fra alle rader
    let rows = document.querySelectorAll("#staffBody tr")
    rows.forEach(r => r.classList.remove("table-active"))
    // Markerer valgt rad
    row.classList.add("table-active")
    selectedIndex = row.getAttribute("data-index")
}

function staffOut() {
    if (selectedIndex == -1) {
        alert("Velg en ansatt først!")
        return
    }
    let staff = staffList[selectedIndex]
    if (staff.status == "Out") {
        alert("Denne ansatte er allerede ute!")
        return
    }
    let minutes = prompt("Hvor mange minutter vil den ansatte være borte?")
    if (minutes == null || minutes == "") return

    let now = new Date()
    let hours = now.getHours().toString().padStart(2, "0")
    let mins = now.getMinutes().toString().padStart(2, "0")
    staff.outTime = hours + ":" + mins
    staff.status = "Out"

    let totalMinutes = parseInt(minutes)
    if (totalMinutes >= 60) {
        let h = Math.floor(totalMinutes / 60)
        let m = totalMinutes % 60
        staff.duration = h + "hr " + m + "min"
    } else {
        staff.duration = totalMinutes + "min"
    }

    let returnTime = new Date(now.getTime() + totalMinutes * 60000)
    let rh = returnTime.getHours().toString().padStart(2, "0")
    let rm = returnTime.getMinutes().toString().padStart(2, "0")
    staff.expectedReturn = rh + ":" + rm

    updateStaffTable()
}

function staffIn() {
    if (selectedIndex == -1) {
        alert("Velg en ansatt først!")
        return
    }
    let staff = staffList[selectedIndex]
    staff.status = "In"
    staff.outTime = ""
    staff.duration = ""
    staff.expectedReturn = ""
    updateStaffTable()
}

document.getElementById("btnOut").addEventListener("click", staffOut)
document.getElementById("btnIn").addEventListener("click", staffIn)
// Liste som lagrer alle delivery-objekter
let deliveryList = []

function validateDelivery() {
    let name = document.getElementById("driverName").value
    let surname = document.getElementById("driverSurname").value
    let phone = document.getElementById("driverPhone").value
    let address = document.getElementById("driverAddress").value
    let returnTime = document.getElementById("driverReturn").value

    if (name == "" || surname == "" || phone == "" || address == "" || returnTime == "") {
        alert("Alle felt må fylles inn!")
        return false
    }
    // Sjekker at returntid er i format hh:mm
    let timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timePattern.test(returnTime)) {
        alert("Returntid må være i format hh:mm!")
        return false
    }
    return true
}

function addDelivery() {
    if (!validateDelivery()) return

    let vehicle = document.getElementById("vehicleType").value
    let name = document.getElementById("driverName").value
    let surname = document.getElementById("driverSurname").value
    let phone = document.getElementById("driverPhone").value
    let address = document.getElementById("driverAddress").value
    let returnTime = document.getElementById("driverReturn").value

    let driver = new DeliveryDriver(name, surname, vehicle, phone, address, returnTime)
    deliveryList.push(driver)
    updateDeliveryTable()

    // Tømmer feltene
    document.getElementById("driverName").value = ""
    document.getElementById("driverSurname").value = ""
    document.getElementById("driverPhone").value = ""
    document.getElementById("driverAddress").value = ""
    document.getElementById("driverReturn").value = ""
}

function updateDeliveryTable() {
    let tableBody = document.getElementById("deliveryBody")
    tableBody.innerHTML = ""

    for (let i = 0; i < deliveryList.length; i++) {
        let d = deliveryList[i]
        let vehicleIcon = d.vehicle == "car" ? "🚗" : "🏍️"
        tableBody.innerHTML += `
            <tr onclick="selectDeliveryRow(this)" data-index="${i}">
                <td>${vehicleIcon}</td>
                <td>${d.name}</td>
                <td>${d.surname}</td>
                <td>${d.telephone}</td>
                <td>${d.address}</td>
                <td>${d.returnTime}</td>
            </tr>
        `
    }
}

let selectedDeliveryIndex = -1

function selectDeliveryRow(row) {
    let rows = document.querySelectorAll("#deliveryBody tr")
    rows.forEach(r => r.classList.remove("table-active"))
    row.classList.add("table-active")
    selectedDeliveryIndex = row.getAttribute("data-index")
}

function clearDelivery() {
    if (selectedDeliveryIndex == -1) {
        alert("Velg en sjåfør først!")
        return
    }
    let confirm = window.confirm("Er du sikker på at du vil fjerne denne sjåføren?")
    if (!confirm) return

    deliveryList.splice(selectedDeliveryIndex, 1)
    selectedDeliveryIndex = -1
    updateDeliveryTable()
}

document.getElementById("btnAdd").addEventListener("click", addDelivery)
document.getElementById("btnClear").addEventListener("click", clearDelivery)
function digitalClock() {
    let now = new Date()
    let day = now.getDate().toString().padStart(2, "0")
    let month = now.toLocaleString("default", { month: "long" })
    let year = now.getFullYear()
    let hours = now.getHours().toString().padStart(2, "0")
    let minutes = now.getMinutes().toString().padStart(2, "0")
    let seconds = now.getSeconds().toString().padStart(2, "0")

    document.getElementById("clock").innerHTML = 
        day + " " + month + " " + year + " " + hours + ":" + minutes + ":" + seconds
}

// Oppdaterer klokken hvert sekund
setInterval(digitalClock, 1000)
digitalClock()
// Holder styr på hvem som allerede har fått toast
let notifiedStaff = []
let notifiedDrivers = []

function staffMemberIsLate() {
    let now = new Date()
    let currentHours = now.getHours()
    let currentMinutes = now.getMinutes()

    for (let i = 0; i < staffList.length; i++) {
        let s = staffList[i]
        if (s.status == "Out" && s.expectedReturn != "" && !notifiedStaff.includes(i)) {
            let parts = s.expectedReturn.split(":")
            let returnHours = parseInt(parts[0])
            let returnMinutes = parseInt(parts[1])

            if (currentHours > returnHours || 
               (currentHours == returnHours && currentMinutes > returnMinutes)) {
                notifiedStaff.push(i)
                showToast(s.name + " " + s.surname + " er forsinket! Har vært ute siden " + s.outTime)
            }
        }
    }
}

function deliveryDriverIsLate() {
    let now = new Date()
    let currentHours = now.getHours()
    let currentMinutes = now.getMinutes()

    for (let i = 0; i < deliveryList.length; i++) {
        let d = deliveryList[i]
        if (!notifiedDrivers.includes(i)) {
            let parts = d.returnTime.split(":")
            let returnHours = parseInt(parts[0])
            let returnMinutes = parseInt(parts[1])

            if (currentHours > returnHours || 
               (currentHours == returnHours && currentMinutes > returnMinutes)) {
                notifiedDrivers.push(i)
                showToast("Sjåfør " + d.name + " " + d.surname + 
                    " er forsinket! Tlf: " + d.telephone + 
                    " Adresse: " + d.address + 
                    " Returntid: " + d.returnTime)
            }
        }
    }
}

function showToast(message) {
    let toastContainer = document.getElementById("toastContainer")
    let toastId = "toast" + Date.now()
    toastContainer.innerHTML += `
        <div id="${toastId}" class="toast show" role="alert">
            <div class="toast-header">
                <strong class="me-auto">⚠️ Advarsel</strong>
                <button type="button" class="btn-close" onclick="document.getElementById('${toastId}').remove()"></button>
            </div>
            <div class="toast-body">${message}</div>
        </div>
    `
}

// Sjekker hvert minutt
setInterval(staffMemberIsLate, 60000)
setInterval(deliveryDriverIsLate, 60000)
staffMemberIsLate()
deliveryDriverIsLate()