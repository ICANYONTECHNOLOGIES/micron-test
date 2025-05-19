

//////////////////////
const subCategories = [];
let editIndex = -1; // To track if we're editing

function handleKeyPress(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    const input = document.getElementById("subCategoryInput");
    const value = input.value.trim();

    if (value) {
      if (editIndex > -1) {
        // Update existing subcategory
        subCategories[editIndex] = value;
        editIndex = -1;
      } else if (!subCategories.includes(value)) {
        // Add new subcategory
        subCategories.push(value);
      }

      input.value = "";
      renderSubCategories();
    }
  }
}

function removeSubCategory(index) {
  subCategories.splice(index, 1);
  editIndex = -1;
  renderSubCategories();
}

function editSubCategory(index) {
  const input = document.getElementById("subCategoryInput");
  input.value = subCategories[index];
  editIndex = index;
  input.focus();
}

function renderSubCategories() {
  const list = document.getElementById("subCategoryList");
  list.innerHTML = "";

  subCategories.forEach((sub, index) => {
    const badge = document.createElement("div");
    badge.className = "sub-category-badge";

    const text = document.createElement("span");
    text.textContent = sub;
    text.onclick = () => editSubCategory(index); // click to edit

    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = "✖"; // bolder close icon
    removeBtn.className = "close-btn";
    removeBtn.onclick = () => removeSubCategory(index);

    badge.appendChild(text);
    badge.appendChild(removeBtn);
    list.appendChild(badge);
  });
}

document.getElementById("categoryForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const mainCategory = document.getElementById("mainCategory").value.trim();
  const imageFile = document.getElementById("categoryImage").files[0];

  const formData = new FormData();
  formData.append("mainCategory", mainCategory);
  subCategories.forEach((sub, index) => {
    formData.append(`subCategories[${index}]`, sub);
  });
  if (imageFile) {
    formData.append("image", imageFile);
  }

  console.log("Main Category:", mainCategory);
  console.log("Sub Categories:", subCategories);
  console.log("Image:", imageFile);

});
////////////////////////////////////////
const input = document.getElementById('categoryImage');
const previewImage = document.getElementById('previewImage');
const defaultText = document.getElementById('defaultText');

input.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();

    reader.addEventListener('load', function () {
      previewImage.setAttribute('src', this.result);
      previewImage.style.display = 'block';
      defaultText.style.display = 'none';
    });

    reader.readAsDataURL(file);
  }
});
/////////////////////////////

document.getElementById("categoryForm").addEventListener("submit", function (e) {
e.preventDefault();

const mainCategory = document.getElementById("mainCategory").value.trim().toUpperCase();
const imageFile = document.getElementById("categoryImage").files[0];
const submitText = document.getElementById("button-text");
const submitLoader = document.getElementById("loading-spinner");
const submitBtn = document.getElementById("submitBtn");

// Show loader for 2 seconds
submitText.style.display = "none";
submitLoader.style.display = "block";
submitBtn.disabled = true;

setTimeout(() => {
  const formData = new FormData();
  formData.append("mainCategory", mainCategory);
  formData.append("subCategories", JSON.stringify(subCategories));
  if (imageFile) {
    formData.append("image", imageFile);
  }

  fetch("/admin/add-category", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((response) => {
      if (response.message === "Category already exists") {
        Swal.fire({
          title: "Error!",
          text: "Category already exists",
          icon: "error",
          confirmButtonText: "OK",
        });
        restoreButton(); // Restore the button in error case
        return; // 🔥 This stops the success Swal from showing
      }

      Swal.fire({
        title: "Thank You!",
        text: "Your category has been added successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
       window.location.reload()
      });
    })
    .catch((error) => {
      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error:", error);
      restoreButton();
    });
}, 2000); // Wait for 2 seconds
});

function restoreButton() {
document.getElementById("button-text").style.display = "inline";
document.getElementById("loading-spinner").style.display = "none";
document.getElementById("submitBtn").disabled = false;
}

//////////////////////


let subCategoriesArray = [];
let editingIndex = -1; // Track which index we are editing

function openEditModal(id, main, sub, img) {
document.getElementById("editCategoryId").value = id;
document.getElementById("editMainCategory").value = main;
document.getElementById("editPreviewImage").src = img;

subCategoriesArray = sub ? sub.split(',').map(s => s.trim()) : [];
editingIndex = -1;

renderSubCategoryList();

const modal = new bootstrap.Modal(document.getElementById("editCategoryModal"));
modal.show();
}

// Add or update subcategory on Enter
document.getElementById("editSubCategoriesInput").addEventListener("keydown", function (event) {
if (event.key === "Enter" && this.value.trim()) {
  event.preventDefault();
  const value = this.value.trim();

  if (editingIndex > -1) {
    subCategoriesArray[editingIndex] = value;
    editingIndex = -1;
  } else {
    subCategoriesArray.push(value);
  }

  this.value = '';
  renderSubCategoryList();
}
});

function renderSubCategoryList() {
const list = document.getElementById("editSubCategoryList");
list.innerHTML = '';
subCategoriesArray.forEach((sub, index) => {
  const badge = document.createElement("div");
  badge.className = "custom-subcategory-badge";
  badge.innerHTML = `
    <span>${sub}</span>
    <i class="bi bi-pencil-square text-warning" onclick="editSubCategories(${index})"></i>
    <i class="bi bi-x-circle text-danger" onclick="removeSubCategories(${index})"></i>
  `;
  list.appendChild(badge);
});
}

function removeSubCategories(index) {
subCategoriesArray.splice(index, 1);
editingIndex = -1;
renderSubCategoryList();
}

function editSubCategories(index) {
const input = document.getElementById("editSubCategoriesInput");
input.value = subCategoriesArray[index];
editingIndex = index;
input.focus();
}


//////////////////////////
// Function to preview the selected image
function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const previewImage = document.getElementById("editPreviewImage");
      previewImage.src = e.target.result;  // Update the image source with the selected file
      previewImage.alt = "New Image Preview"; // Optional: Update the alt attribute as well
    };
    reader.readAsDataURL(file); // Convert the selected file to a Data URL
  }
}
////////////////////////////////////
// Function to preview the selected image
function previewImageEdit(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const previewImage = document.getElementById("editPreviewImage");
      previewImage.src = e.target.result;  // Update the image source with the selected file
      previewImage.alt = "New Image Preview"; // Optional: Update the alt attribute as well
    };
    reader.readAsDataURL(file); // Convert the selected file to a Data URL
  }
}
/////////////////////////////
