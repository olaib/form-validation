

// A sample array of forbidden words, you modify it. Note that it can also be empty.
const forbiddenWords = ["politics", "religion", "cheap", "expensive", "money", "offer"]
// the errors messages will be stored here and later displayed to the user
let errorMessages = []
// an array of objects {name, reference, description, price}
let productsList = []

/** (you need to implement this function - do not change the name of the function
 * add a product to the productsList and update the HTML displaying the list of products using displayProducts()
 * @param product an object, the new product to add (see the code line 61))
 */
function generateTable(){
    let table = "<table class=\"table table-striped\"><thead>" +
                    "<tr><th>Name</th>" +
                    "<th>Refrence</th>" +
                    "<th>Description</th>" +
                    "<th>Price</th></tr></thead><tbody>";
    for (const product of productsList){
        table += "<tr>";
        for (const value of Object.values(product)){
            table += "<td>" + value + "</td>"
        }
        table += "</tr>";
    }
    table += "</tbody></table>";

    return table;
}

/** you need to implement this function - do not change the name of the function
 * add a product to the productsList and update the HTML displaying the list of products using displayProducts()
 * @param product an object, the new product to add (see the code line 61)
 */
function addProduct(product) {
    productsList.push(product);
    displayProducts(generateTable());
}

/** you need to implement this function - do not change the name of the function
 * sort the productsList amd update the HTML displaying the list of products using displayProducts()
 */
function sortProductsByReference() {
    productsList.sort((prodA, prodB) => (prodA.reference > prodB.reference ? 1:-1));
    displayProducts(generateTable());
}

/*** Validation - module
 * @type {{
 *
 * isValidRef: (function(string, RegExp): boolean), //checks if reference is valid
 * isEmptyForm: (function(String): boolean), //check if form empty
 * checkForbiddenWords: (function(String): String), //check if form contain forbidden words
 * checkLength: (function(String, int): boolean), //check if length is not too long
 * checkPrice: (function()), //check numbers after the '.'
 * isPositive: (function(String): boolean)} //check if price not negative
 * }
 */
const validation = (function(){
    const isEmptyForm = (form) => {return form == "";};
    const isValidRef = (reference, syntax) => {return syntax.test(reference);};
    const checkForbiddenWords = (form) => {
        let forbiddens = "";

        forbiddenWords.forEach((word) => {
            if (form.includes(word)) {
                forbiddens += "<li>" + word + ".</li>";
            }});
        return forbiddens ;
    };
    const checkLength = (form, length) => {return form.length > length;};
    const isPositive = (number) => {return Math.sign(number) == 1};
    const checkPrice = (price) => {
        const price2decimal = price.split('.');
        return(price2decimal.length == 1 || !checkLength(price2decimal[1],2));

    };
    return{
        isEmptyForm: isEmptyForm,
        isValidRef: isValidRef,
        checkForbiddenWords: checkForbiddenWords,
        checkLength: checkLength,
        isPositive: isPositive,
        checkPrice: checkPrice
    }
})()

/** you need to implement this function - do not change the name of the function
 * @param formInput an object containing the values of the form fields
 * @returns {boolean} true if the form is valid, false otherwise
 */
function validateProduct(formInput) {
    let isValid = true;
    for(const form of Object.values(formInput)){
        if(validation.isEmptyForm(form)){
            errorMessages.push("The input is empty.");
            isValid = false;
            break;
        }
    }
    const syntax = /^[0-9a-zA-Z]\S+$/;
    if(!validation.isValidRef(formInput.reference, syntax)){
        errorMessages.push("Invalid reference '" + formInput.reference +"' must contain a single word.");
        isValid = false;
    }
    if(validation.checkLength(formInput.reference,20)){
        errorMessages.push("Input '" + formInput.reference + "' must contain less than 20 characters.");
        isValid = false;
    }

    const toCheck = [formInput.name, formInput.description];
    for (const form of toCheck) {
        if (!validation.isEmptyForm(form)) {
            const illigalWords = validation.checkForbiddenWords(form);
            if (illigalWords !== "") {
                errorMessages.push("input '" + form + "' can't contain the word(s): " + "<ul>" + illigalWords + "</ul>");
                isValid = false;
            }
            if (validation.checkLength(form, 50)) {
                errorMessages.push("Input '" + form + "' must contain less than 50 characters.");
                isValid = false;
            }
        }
    }

    if(!validation.isEmptyForm(formInput.price)) {
        if (!validation.checkPrice(formInput.price)) {
            errorMessages.push("Input '" + formInput.price + "' has too many decimals. it must have at most 2 decimals.");
            isValid = false;
        }
        if (!validation.isPositive(formInput.price)) {
            errorMessages.push("Input '" + formInput.price + "' must be positive number.");
            isValid = false;
        }
    }

    return  isValid;
}

/** you need to implement this function - do not change the name of the function
 * @param listOfErrors an array of strings containing the error messages
 * @returns {string|string|*} the HTML code to display the errors
 */
function convertErrorsToHtml(listOfErrors) {
    let errorMessages = "<ol start='1'>Please correct the following mistake(s):"
    for(const error of listOfErrors)
        errorMessages += "<li>" + error + "</li>";
    return errorMessages + "</ol>";
}



// you may move but not modify the code below this line, except for renaming the functions to be implemented
// in case you need to.

/**
 * This function updates the HTML displaying the list of products.
 * @param html
 */
const displayProducts = (html) => { document.getElementById("productsTable").innerHTML = html; }

/**
 * upon loading the page, we bind handlers to the form and the button
 */
document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("messageForm").addEventListener("submit", (event) => {
        event.preventDefault();
        errorMessages = [];
        // we build the new product object from the form input:
        let prod = {
            name: document.getElementById("productName").value.trim(),
            reference: document.getElementById("productRef").value.trim(),
            description: document.getElementById("productDescription").value.trim(),
            price: document.getElementById("productPrice").value.trim()
        }
        // we validate the product:
        if (validateProduct(prod)) {
            // if the product is valid, we add it to the list of products:
            document.getElementById("errorMessages").innerHTML = "Product is saved!";
            // add the product to the list of products and update the HTML table
            addProduct(prod);
            document.getElementById("messageForm").reset();
        } else
            // if the product is not valid, we display the errors:
            document.getElementById("errorMessages").innerHTML = convertErrorsToHtml(errorMessages);
    });

    // the sort button handler:
    document.getElementById("sortByReference").addEventListener("click", (event) => {
        sortProductsByReference();
    })

});
