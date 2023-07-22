/***** Constantes *****/
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");
const navLogin = document.querySelector(".nav-login");

const banner = document.querySelector(".banner");
const bannerEditButton = document.querySelector(".banner-edit-button");
const introductionEditButton = document.querySelector(".introduction-edit-button");
const portfolioEditButton = document.querySelector(".portfolio-edit-button");

const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-content");
const modalContentTwo = document.querySelector(".modal-content-two");
const modalClose = document.querySelector(".modal-close");
const modalGallery = document.querySelector(".modal-gallery");
const modalAddPhoto = document.querySelector(".modal-add-photo");
const modalReturn = document.querySelector(".modal-return");

const formPhoto = document.querySelector(".form-photo");
const formTitre = document.querySelector(".form-titre");
const formCategory = document.querySelector('.form-category');
const selectedImage = document.querySelector(".selected-img");
const messageError = document.querySelector(".message-error");
const modalAddWorkButton = document.querySelector(".modal-add-work-button");

const addImgFormI = document.querySelector(".add-img-form i");
const addImgFormLabel = document.querySelector(".add-img-form label");
const addImgFormP = document.querySelector(".add-img-form p");


/***** Variables *****/
let works = [];
let categories = [];
let filterSelected = 0;

let token = localStorage.getItem("token");


/***** Fonctions *****/
function worksFetch() {
    fetch("http://localhost:5678/api/works")
        .then(response => response.json())
        .then(data => {
            works = data;
            displayProjects(works);
            createGalleryModal(works);
        });
}

function categoriesFetch() {
    fetch("http://localhost:5678/api/categories")
        .then(response => response.json())
        .then(data => {
            categories = data;
            displayCategories(categories);

            // Select
            categories.forEach((category) => {
                const option = document.createElement("option");
        
                option.value = category.id;
                option.innerHTML = category.name
        
                formCategory.appendChild(option);
            });
        });
}

// Galerie
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

// Filtres
function displayCategories(categories) {
    const allButton = document.createElement("button");
    filters.appendChild(allButton);
    allButton.innerHTML = "Tous";
    allButton.className = ("filter");
    allButton.classList.add("filter-selected");

    allButton.addEventListener("click", () => {
        selectFilter("0");
        displayProjects(works);
    });

    categories.forEach(category => {
        const button = document.createElement("button");
        filters.appendChild(button);
        button.innerHTML = category.name;
        button.className = ("filter");

        button.addEventListener("click", () => {
            selectFilter(category.id);
            displayProjects(works, category.name);
		});
    });
}

// Boutons
function selectFilter(id) {
    if (filterSelected != id) {
        filters.children[filterSelected].classList.remove("filter-selected");
        filters.children[id].classList.add("filter-selected");
        filterSelected = id;
    }
}

// Connexion
if (token) {
    banner.style.display = "flex";
    introductionEditButton.style.display = "flex";
    portfolioEditButton.style.display = "flex";
    filters.style.display = "none";
    navLogin.innerHTML = "logout";

    navLogin.addEventListener("click", () => {
        localStorage.removeItem("token");
    });
}

// Ecouteurs modale O/F
bannerEditButton.addEventListener("click", () => { 
    modal.showModal();
 });

introductionEditButton.addEventListener("click", () => { 
    modal.showModal();
 });

portfolioEditButton.addEventListener("click", () => { 
    modal.showModal();
 });

modalClose.addEventListener("click", () => { 
    modal.close() 
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.close();
    }
});

// Galerie modale
function createGalleryModal(works) {
    let modalGalleryImage = "";

    works.forEach((work) => {
        modalGalleryImage = modalGalleryImage +
            `<div class="modal-gallery-image">
                <img src="${work.imageUrl}">
                <i class="fa-regular fa-trash-can modal-trash" data-id="${work.id}"></i>
                <i class="fa-solid fa-arrows-up-down-left-right modal-arrow"></i>
                <p>éditer</p>
            </div>`;
    });

    modalGallery.innerHTML = modalGalleryImage;

    const trashes = document.querySelectorAll(".modal-trash");

    trashes.forEach((trash) => {
        trash.addEventListener("click", () => {
            const workId = trash.getAttribute("data-id");
            fetch(`http://localhost:5678/api/works/${workId}`, {
                method: "DELETE", 
                headers: { Authorization: `Bearer ${token}` }})
                .then(worksFetch());
        });
    });
}

// Ecouteurs modale page
modalAddPhoto.addEventListener("click", () => {
    modalContent.style.display = "none";
    modalContentTwo.style.display = "flex";
});

modalReturn.addEventListener("click", () => {
    modalContent.style.display = "flex";
    modalContentTwo.style.display = "none";
});

// Reader
formPhoto.addEventListener("change", () => {
    const file = formPhoto.files[0];
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
        selectedImage.src = event.target.result;
        selectedImage.style.display = "flex";

        addImgFormI.style.display = "none";
        addImgFormLabel.style.display = "none";
        addImgFormP.style.display = "none";
    };
    
    fileReader.readAsDataURL(file);
});

// Ajout
function addWork() {
    if (formPhoto.value == "" || formTitre.value == "" || formCategory.value == "") {
        messageError.style.display = "block";
        
    } else {
        let formData = new FormData();

        formData.append("image", formPhoto.files[0]);
        formData.append("title", formTitre.value);
        formData.append("category", formCategory.value);
    
        let post = {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        };
    
        fetch("http://localhost:5678/api/works", post)
            .then(() => {
                worksFetch();

                messageError.style.display = "none";
                modalContent.style.display = "flex";
                modalContentTwo.style.display = "none";

                formPhoto.value = ""
                formTitre.value = "";
                formCategory.value = "";

                selectedImage.style.display = "none";
                addImgFormI.style.display = "flex";
                addImgFormLabel.style.display = "flex";
                addImgFormP.style.display = "flex";
            });
    }
}

modalAddWorkButton.addEventListener("click", addWork);

categoriesFetch();
worksFetch();