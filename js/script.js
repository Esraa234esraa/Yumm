$('#close').click(function () {
    closeNav();
});

$('#open').click(function () {
    openSideNav();
});
function openSideNav() {
    $('#close').removeClass('d-none')

    $(".side-nav-menu").animate({
        left: 0
    }, 500);
    $(".open-close-icon").removeClass("fa-align-justify");
    $(".open-close-icon").addClass("d-none");

    $(".links li").each(function (index) {
        $(this).animate({
            top: 0
        }, (index + 1) * 100);
    });
}

function closeNav() {
    let navWidth = $('.side-nav-menu .nav-tab').outerWidth();
    $('#close').addClass('d-none')

    $(".side-nav-menu").animate({
        left: -navWidth
    }, 700);
    $(".open-close-icon").removeClass("d-none");

    $(".open-close-icon").addClass("fa-align-justify");
    $(".open-close-icon").removeClass("fa-x");

    $(".links li").animate({
        top: 300
    }, 700);

}

closeNav()
$(".side-nav-menu i.open-close-icon").click(() => {
    if ($(".side-nav-menu").css("left") == "0px") {
        closeNav()
    } else {
        openSideNav()
    }
})

let Data = document.getElementById("Data");
let searchContainer = document.getElementById("searchContainer");
let submitBtn;

$(document).ready(() => {
    searchByName(" ").then(() => {
        $(".loading-screen").fadeOut(500); // استخدم fadeOut بدلاً من scrollTop
        $("body").css("overflow", "visible");
    })
});


function searchFood() {
    Data.innerHTML = "";
    let searcinputs = `
<div class="row py-4">
    <div class="col-md-6">
        <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
    </div>
    <div class="col-md-6">
        <input onkeyup="searchByLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
    </div>
</div>

`;
    $(searchContainer).html(searcinputs);
}


function searchByName(name) {
    return getSearchMealsByName(name);

}


function searchByLetter(letter) {
    getSearchMealsByLetter(letter);
}

function displayMeals(arr) {
    let content = ``;
    if (arr.meals) {
        arr.meals.forEach(meal => {
            content += ` 
            <div class="col-md-3">
                <div onclick="getMealDetails('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${meal.strMealThumb}" alt="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
            </div>
            `;
        });
    } else {
        Data.textContent = 'No meals found';
    }
    Data.innerHTML = content;
}
async function getSearchMealsByName(name) {
    Data.innerHTML = "";

    closeNav();
    $(".loading-screen").fadeIn(300);

    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
        let result = await response.json();
        displaySearchName(result);
        $(".loading-screen").fadeOut(300); // 
        return Promise.resolve(result); // 
    } catch (error) {
        console.error('Error fetching data:', error);
        $(".loading-screen").fadeOut(300);
        return Promise.reject(error); //  الخطأ
    }
}

async function getSearchMealsByLetter(let) {
    Data.innerHTML = "";

    closeNav();
    $(".loading-screen").fadeIn(300);

    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${let}`);
        response = await response.json();
        displaySearchLetter(response);
        $(".loading-screen").fadeOut(300); // 
        return Promise.resolve(result); // 
    } catch (error) {
        console.error('Error fetching data:', error);
        $(".loading-screen").fadeOut(300);
        return Promise.reject(error); //  الخطأ
    }
}


function displaySearchName(arr) {
    Data.innerHTML = "";

    let content = ``;
    if (arr.meals) {
        arr.meals.forEach(meal => {
            content += ` 
            <div class="col-md-3">
                <div onclick="getMealDetails('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${meal.strMealThumb}" alt="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
            </div>
            `;
        });
    } else {
        Data.textContent = 'No meals found';
    }
    Data.innerHTML = content;
}


function displaySearchLetter(arr) {
    Data.innerHTML = "";

    let content = ``;
    if (arr.meals) {
        arr.meals.forEach(meal => {
            content += ` 
            <div class="col-md-3">
                <div onclick="getMealDetails('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${meal.strMealThumb}" alt="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
            </div>
            `;
        });
    } else {
        Data.textContent = 'No meals found';
    }
    Data.innerHTML = content;
}



// Details
async function getMealDetails(id) {
    console.log(id);
    Data.innerHTML = ""; // Clear previous content in Data element

    closeNav(); // Close navigation if needed
    $(".loading-screen").fadeIn(300); // Show loading screen

    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        let result = await response.json();
        console.log(result); // Log the fetched result
        displayMealDetails(result.meals); // Display meal details
        $(".loading-screen").fadeOut(300); // Hide loading screen
        return Promise.resolve(result); // Resolve the promise with result
    } catch (error) {
        console.error('Error fetching data:', error);
        $(".loading-screen").fadeOut(300); // Hide loading screen on error
        return Promise.reject(error); // Reject the promise with error
    }
}
function displayMealDetails(arr) {
    let ingredient = ``;
    for (let i = 1; i <= 20; i++) {
        if (arr[0][`strIngredient${i}`]) {
            ingredient += `<li class="alert alert-info m-2 p-1">${arr[0][`strMeasure${i}`]} ${arr[0][`strIngredient${i}`]}</li>`;
        }
    }

    let tags = arr[0].strTags?.split(",") || [];
    let tagsStr = ``;
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `<li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
    }

    let content = ``;
    if (arr && arr.length > 0) {
        arr.forEach(meal => {
            content += `
            <div class="col-md-5">
                <div class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${meal.strMealThumb}" alt="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-7">
                <h2>Instructions</h2>
                <p class='lead'>${meal.strInstructions}</p>
                <h3><span>Area:</span> ${meal.strArea}</h3>
                <h3><span>Category:</span> ${meal.strCategory}</h3>
                <h3><span>Ingredients:</span></h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredient}
                </ul>
                <h3><span>Tags:</span></h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>
                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>
        `;
        });
    } else {
        content = 'No meals found';
    }

    Data.innerHTML = content;
}
// stop details


// Category


async function getCategories() {
    Data.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)
    searchContainer.innerHTML = "";

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    response = await response.json()

    displayCategories(response.categories)
    $(".inner-loading-screen").fadeOut(300)

}

function displayCategories(arr) {
    let cartoona = "";

    for (let i = 0; i < arr.length; i++) {
        cartoona += `
        <div class="col-md-3">
                <div onclick="getCategoryMeals('${arr[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strCategoryThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${arr[i].strCategory}</h3>
                        <p>${arr[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                    </div>
                </div>
        </div>
        `
    }

    Data.innerHTML = cartoona
}
async function getCategoryMeals(catg) {
    closeNav();

    console.log(catg);
    Data.innerHTML = "";
    $(".loading-screen").fadeIn(300);

    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${catg}`);
        let result = await response.json();
        console.log(result);
        displayCatgDetails(result.meals.slice(0, 20));
        $(".loading-screen").fadeOut(300);
        return Promise.resolve(result);
    } catch (error) {
        console.error('Error fetching data:', error);
        $(".loading-screen").fadeOut(300);
        return Promise.reject(error);
    }
}

function displayCatgDetails(arr) {
    Data.innerHTML = "";

    let content = ``;
    for (let i = 0; i < arr.length; i++) {
        content += `
            <div class="col-md-3">
                <div onclick="getMealDetails('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
            </div>
        `;
    }

    Data.innerHTML = content;
}


// stop Category





// Area

async function getArea() {
    closeNav();

    Data.innerHTML = "";
    searchContainer.innerHTML = "";

    $(".loading-screen").fadeIn(300);
    try {
        let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
        respone = await respone.json()
        displayAllArea(respone);
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
    $(".loading-screen").fadeOut(300);
}


function displayAllArea(arr) {
    console.log(arr.meals);
    Data.innerHTML = "";

    content = ``;
    if (arr.meals) {
        arr.meals.forEach(meal => {
            content += `
            <div class="col-md-3">
                <div onclick="getAreaMeals('${meal.strArea}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa fa-home fa-4x"></i>
                        <h3>${meal.strArea}</h3>
                </div>
            </div>
            `
        });

    }
    else {
        Data.textContent = 'No meals found';
    }
    Data.innerHTML = content;

}


async function getAreaMeals(area) {
    closeNav();

    console.log(area);
    Data.innerHTML = "";
    $(".loading-screen").fadeIn(300);

    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
        let result = await response.json();
        console.log(result);
        displayAreaDetails(result.meals.slice(0, 20));
        $(".loading-screen").fadeOut(300);
        return Promise.resolve(result);
    } catch (error) {
        console.error('Error fetching data:', error);
        $(".loading-screen").fadeOut(300);
        return Promise.reject(error);
    }
}
function displayAreaDetails(arr) {
    Data.innerHTML = "";

    let content = ``;
    if (arr) {
        for (let i = 0; i < arr.length; i++) {
            content += `
            <div class="col-md-3">
                <div onclick="getMealDetails('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="${arr[i].strMeal}" srcset="">
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
            </div>
            `;
        }
    } else {
        content = 'No meals found';
    }

    Data.innerHTML = content;
}

// stop area





// Ingredent
async function getIngredients() {
    closeNav();

    Data.innerHTML = "";
    searchContainer.innerHTML = "";

    $(".loading-screen").fadeIn(300);
    try {
        let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
        respone = await respone.json()
        displayAllIngredients(respone.meals.slice(0, 20));
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
    $(".loading-screen").fadeOut(300);
}


function displayAllIngredients(arr) {
    Data.innerHTML = "";

    content = ``;
    if (arr) {
        arr.forEach(meal => {
            content += `
             <div class="col-md-3">
                <div onclick="getIngredientsMeals('${meal.strIngredient}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa fa-drumstick-bite fa-4x"></i>
                        <h3>${meal.strIngredient}</h3>
                        <p>${meal.strDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
        </div>
            `
        });

    }
    else {
        Data.textContent = 'No meals found';
    }
    Data.innerHTML = content;

}


async function getIngredientsMeals(ing) {
    closeNav();

    console.log(ing);
    Data.innerHTML = "";
    $(".loading-screen").fadeIn(300);

    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`);
        let result = await response.json();
        console.log(result);
        displayIngredentDetails(result.meals.slice(0, 20));
        $(".loading-screen").fadeOut(300);
        return Promise.resolve(result);
    } catch (error) {
        console.error('Error fetching data:', error);
        $(".loading-screen").fadeOut(300);
        return Promise.reject(error);
    }
}
function displayIngredentDetails(arr) {
    Data.innerHTML = "";

    let content = ``;
    if (arr) {
        for (let i = 0; i < arr.length; i++) {
            content += `
            <div class="col-md-3">
                <div onclick="getMealDetails('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="${arr[i].strMeal}" srcset="">
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
            </div>
            `;
        }
    } else {
        content = 'No meals found';
    }

    Data.innerHTML = content;
}

// stop Ingredent



// ContactUs

function diplayContact() {
    closeNav();

    Data.innerHTML = "";
    searchContainer.innerHTML = "";

    $(".loading-screen").remove();
    Data.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" oninput="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" oninput="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" oninput="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" oninput="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" oninput="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" oninput="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `;
    submitBtn = document.getElementById("submitBtn");

}
let isValidationDone = false;
function inputsValidation() {
    var nameInput = document.getElementById('nameInput').value.trim();
    var emailInput = document.getElementById('emailInput').value.trim();
    var phoneInput = document.getElementById('phoneInput').value.trim();
    var ageInput = document.getElementById('ageInput').value.trim();
    var passwordInput = document.getElementById('passwordInput').value.trim();
    var repasswordInput = document.getElementById('repasswordInput').value.trim();

    var nameRegex = /^[a-zA-Z\s]*$/; // Only letters and spaces
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
    var phoneRegex = /^[0-9]{10}$/; // 10-digit numeric phone number
    var ageRegex = /^[0-9]+$/; // Only digits for age
    var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum eight characters, at least one letter and one number

    var isNameValid = nameRegex.test(nameInput);
    var isEmailValid = emailRegex.test(emailInput);
    var isPhoneValid = phoneRegex.test(phoneInput);
    var isAgeValid = ageRegex.test(ageInput);
    var isPasswordValid = passwordRegex.test(passwordInput);
    var isRepasswordValid = (passwordInput === repasswordInput);

    isValidationDone = true;

    // 
    document.getElementById('nameAlert').classList.toggle('d-none', isNameValid);
    document.getElementById('emailAlert').classList.toggle('d-none', isEmailValid);
    document.getElementById('phoneAlert').classList.toggle('d-none', isPhoneValid);
    document.getElementById('ageAlert').classList.toggle('d-none', isAgeValid);
    document.getElementById('passwordAlert').classList.toggle('d-none', isPasswordValid);
    document.getElementById('repasswordAlert').classList.toggle('d-none', isRepasswordValid);

    var isFormValid = isNameValid && isEmailValid && isPhoneValid && isAgeValid && isPasswordValid && isRepasswordValid;
    submitBtn.disabled = !isFormValid;
}

function handleSubmit() {
    if (!isValidationDone) {
        inputsValidation(); // Perform validation if not done already
    }

    var isFormValid = !submitBtn.disabled;
    if (isFormValid) {
        alert('Form is valid. Submitting...');

    } else {
        alert('Please fill in all fields correctly before submitting.');
    }
}
// stop ContactUs
