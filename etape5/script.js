"use strict";

const persons = [
    { nom: "nom-1", prenom: "prenom-1", points: 5 },
    { nom: "nom-2", prenom: "prenom-2", points: 10 },
    { nom: "nom-3", prenom: "prenom-3", points: 15 }
];

let lignes = 0;
let total_points = 0;

init();

function init() {
    for (const person of persons) {
        doInsert(person.nom, person.prenom, person.points);
    }
}

function doInsert(nom, prenom, points) {
    lignes++;
    const num = lignes;
    doInsertRowTable(num, nom, prenom, points);
    total_points += points;
    update_summary();
}

function update_summary() {
    document.getElementById("p1").innerText = lignes + " ligne(s)";
    document.getElementById("p3").innerText = "Total point(s) = " + Number(total_points.toFixed(10));
}

function consoleTableau() {
    console.table(persons);
}

function doInsertRowTable(num, nom, prenom, points) {
    const table = document.querySelector("#table_container tbody");
    const row = document.createElement("tr");
    row.setAttribute("class", "row");

    const col1 = document.createElement("td");
    const col2 = document.createElement("td");
    const col3 = document.createElement("td");
    const col4 = document.createElement("td");
    const col5 = document.createElement("td");

    col1.innerText = num;
    col2.innerText = nom;
    col3.innerText = prenom;
    col4.innerText = points;

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("aria-label", "Sélectionner " + nom + " " + prenom);
    col5.append(checkbox);

    col1.setAttribute("class", "col_number");
    col2.setAttribute("class", "col_text");
    col3.setAttribute("class", "col_text");
    col4.setAttribute("class", "col_number");
    col5.setAttribute("class", "col_chkbox");

    row.append(col1, col2, col3, col4, col5);
    table.append(row);
}

function readForm() {
    const nom = document.getElementById("form_nom").value.trim();
    const prenom = document.getElementById("form_prenom").value.trim();
    const pointsField = document.getElementById("form_points");
    const points = pointsField.valueAsNumber;

    if (nom === "" || prenom === "" || pointsField.value === "" || !Number.isFinite(points)) {
        showMessage("Remplissez le nom, le prénom et un nombre de points valide.");
        return null;
    }

    return { nom, prenom, points };
}

function showMessage(message) {
    const element = document.getElementById("form_message");
    element.textContent = message;
    element.hidden = message === "";
}

function clearForm() {
    document.getElementById("form_nom").value = "";
    document.getElementById("form_prenom").value = "";
    document.getElementById("form_points").value = "";
    document.getElementById("form_nom").focus();
}

function doNewData() {
    const person = readForm();
    if (person === null) {
        return;
    }

    persons.push(person);
    doInsert(person.nom, person.prenom, person.points);
    clearForm();
    showMessage("Personne ajoutée.");
}

document.getElementById("btn_add").addEventListener("click", doNewData);

document.getElementById("btn_console").addEventListener("click", consoleTableau);
