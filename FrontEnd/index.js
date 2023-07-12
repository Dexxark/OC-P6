/***** Constantes *****/
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

/***** Variables *****/
let works = [];
let categories = [];
let filterSelected = 0;

/***** Fonctions *****/
function worksFetch() {
    fetch("http://localhost:5678/api/works")
        .then(response => response.json())
        .then(data => {
            works = data;
            displayProjects(works);
        });
}

function categoriesFetch() {
    fetch("http://localhost:5678/api/categories")
        .then(response => response.json())
        .then(data => {
            categories = data;
            displayCategories(categories);
        })
}

function displayProjects(works, category) {
    gallery.innerHTML = "";

    works.forEach(work => {
        if (!category || category == work.category.name) {
            const figure = document.createElement("figure");

            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;
            figure.appendChild(img);
    
            const figcaption = document.createElement("figcaption");
            figcaption.innerHTML = work.title;
            figure.appendChild(figcaption);
    
            gallery.appendChild(figure);
        }
    });
}

function displayCategories(categories) {
    filters.innerHTML = "";

    const allButton = document.createElement("button");
    allButton.innerHTML = "Tous";
    allButton.className = ("filter");
    allButton.classList.add("filter-selected");

    allButton.addEventListener("click", () => {
        selectFilter("0");
        displayProjects(works);
    });

    filters.appendChild(allButton);

    categories.forEach(category => {
        const button = document.createElement("button");
        button.innerHTML = category.name
        button.className = ("filter");

        button.addEventListener("click", () => {
            selectFilter(category.id)
            displayProjects(works, category.name);
		});

        filters.appendChild(button);
    });
}

function selectFilter(id) {
    if (filterSelected != id) {
        filters.children[filterSelected].classList.remove("filter-selected");
        filters.children[id].classList.add("filter-selected");
        filterSelected = id;
    }
}

categoriesFetch();
worksFetch();