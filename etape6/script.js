"use strict";

const persons = [
    { nom: "nom-1", prenom: "prenom-1", points: 5 },
    { nom: "nom-2", prenom: "prenom-2", points: 10 },
    { nom: "nom-3", prenom: "prenom-3", points: 15 }
];

let lignes = 0;
let total_points = 0;
let editingIndex = null;
let ascending = true;

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
    updateSelection();
    clearForm();
    showMessage("Personne ajoutée.");
}

document.getElementById("btn_add").addEventListener("click", doNewData);

document.getElementById("btn_console").addEventListener("click", consoleTableau);

function renderPersons() {
    document.querySelector("#table_container tbody").replaceChildren();
    lignes = 0;
    total_points = 0;
    init();
    update_summary();
    updateSelection();
}

function deleteRow() {
    if (lignes === 0) {
        alert("Le tableau est vide.");
        return;
    }

    const table = document.querySelector("#table_container tbody");
    const selected = table.querySelectorAll(".col_chkbox input:checked");
    if (selected.length === 0) {
        alert("Sélectionnez au moins une ligne !");
        return;
    }
    if (!confirm("Supprimer les " + selected.length + " ligne(s) sélectionnée(s) ?")) {
        return;
    }

    const rows = table.querySelectorAll("tr");
    for (let i = rows.length - 1; i >= 0; i--) {
        if (rows[i].querySelector("input").checked) {
            total_points -= Number(rows[i].cells[3].innerText);
            lignes--;
            persons.splice(i, 1);
            rows[i].remove();
        }
    }

    cancelEdit();
    renderPersons();
    showMessage(selected.length + " ligne(s) supprimée(s).");
}

function updateSelection() {
    const boxes = document.querySelectorAll("tbody .col_chkbox input");
    const count = document.querySelectorAll("tbody .col_chkbox input:checked").length;
    const all = document.getElementById("select_all");
    all.checked = boxes.length > 0 && count === boxes.length;
    all.indeterminate = count > 0 && count < boxes.length;
    all.disabled = boxes.length === 0;
}

function startEdit() {
    const rows = Array.from(document.querySelectorAll("tbody tr"));
    const selected = rows.filter(row => row.querySelector("input").checked);
    if (selected.length !== 1) {
        showMessage("Sélectionnez exactement une personne à modifier.");
        return;
    }

    editingIndex = rows.indexOf(selected[0]);
    const person = persons[editingIndex];
    document.getElementById("form_nom").value = person.nom;
    document.getElementById("form_prenom").value = person.prenom;
    document.getElementById("form_points").value = person.points;
    document.getElementById("btn_add").hidden = true;
    document.getElementById("btn_save").hidden = false;
    document.getElementById("btn_cancel").hidden = false;
    document.getElementById("btn_sort").disabled = true;
    showMessage("Modifiez les champs puis cliquez sur Enregistrer.");
    document.getElementById("form_nom").focus();
}

function cancelEdit() {
    editingIndex = null;
    document.getElementById("btn_add").hidden = false;
    document.getElementById("btn_save").hidden = true;
    document.getElementById("btn_cancel").hidden = true;
    document.getElementById("btn_sort").disabled = false;
    clearForm();
    showMessage("");
}

function saveEdit() {
    if (editingIndex === null) {
        return;
    }
    const person = readForm();
    if (person === null) {
        return;
    }
    persons[editingIndex] = person;
    cancelEdit();
    renderPersons();
    showMessage("Personne modifiée.");
}

document.getElementById("btn_delete").addEventListener("click", deleteRow);
document.getElementById("btn_edit").addEventListener("click", startEdit);
document.getElementById("btn_save").addEventListener("click", saveEdit);
document.getElementById("btn_cancel").addEventListener("click", cancelEdit);
document.querySelector("tbody").addEventListener("change", updateSelection);
document.getElementById("select_all").addEventListener("change", function (event) {
    for (const checkbox of document.querySelectorAll("tbody .col_chkbox input")) {
        checkbox.checked = event.target.checked;
    }
    updateSelection();
});
document.getElementById("btn_sort").addEventListener("click", function () {
    persons.sort((a, b) => ascending ? a.points - b.points : b.points - a.points);
    ascending = !ascending;
    renderPersons();
    this.textContent = ascending ? "Trier par points croissants" : "Trier par points décroissants";
    showMessage("Personnes triées par points.");
});
