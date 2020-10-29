"use strict"

let currentNum = '';
let storedNum = '';
let operator = '';
let product = '';



let display = document.getElementById("display");
let btn0 = document.getElementById("zero");
let btn1 = document.getElementById("one");
let btn2 = document.getElementById("two");
let btn3 = document.getElementById("three");
let btn4 = document.getElementById("four");
let btn5 = document.getElementById("five");
let btn6 = document.getElementById("six");
let btn7 = document.getElementById("seven");
let btn8 = document.getElementById("eight");
let btn9 = document.getElementById("nine");
let btnAdd = document.getElementById("addition");
let btnSub = document.getElementById("subtraction");
let btnMulti = document.getElementById("multiplication");
let btnDiv = document.getElementById("division");
let btnEquals = document.getElementById("equals");
let btnClear = document.getElementById("clear");
let btnDecimal = document.getElementById("decimal");
let btnNegPos = document.getElementById("negPos")


// The functions check for the 5 states the calculator can be in:
    // 1. Empty
    // 2. 1st number entered
    // 3. Operator entered
    // 4. 2nd number entered
    // 5. Product calculated
// It then allows the buttons to perform context sensitive actions based
// on the state the calculator is in.

function numberBtn(e) {

    if (checkProductCalculated()) {

        product = '';
        clearDisplay();
    }
     
    if (displayFull()) return;

    if (currentNum === '-0') {

        currentNum = '-' + e.target.textContent;
    }
    else {

        currentNum += e.target.textContent;
    }

    clearDisplay();
    drawDisplay(currentNum);

}

function operatorBtn(e) {

    if (checkProgramEmpty() || checkOperatorEntered()) return

    if (checkOneNumEntered()) {

        storedNum = currentNum;
        operator = e.target.textContent;
        currentNum = '';
        product = '';

        resetOperatorBtnColor()
        changeOperatorBtnColor(e);
    }
    else if (checkTwoNumEntered()) {

        storedNum = String(calcProduct());
        currentNum = '';
        operator = e.target.textContent;
        product = '';

        resetOperatorBtnColor();
        changeOperatorBtnColor(e);

        clearDisplay();
        drawDisplay(createDisplayNum(storedNum));
    }
    else if (checkProductCalculated()) {

        storedNum = product;
        product = '';
        operator = e.target.textContent;

        resetOperatorBtnColor();
        changeOperatorBtnColor(e);
    }
}

function equalsBtn() {

    if (checkTwoNumEntered()) {

        product = String(calcProduct());
        currentNum = '';
        operator = '';
        storedNum = '';

        resetOperatorBtnColor()
        clearDisplay();
        drawDisplay(createDisplayNum(product));
    }
}

function decimalBtn() {

    if(checkProductCalculated()) {

        product = '';
        clearDisplay();
    }

    if (currentNum.length === 0) {
        
        currentNum = '0.'
        clearDisplay();
        drawDisplay(currentNum);
    }

    if (checkDecimalPresent(currentNum) || displayFull()) return;

    currentNum += '.'

    clearDisplay();
    drawDisplay(currentNum);
}

function negPosBtn() {

    if (checkProductCalculated()) {

        if (product.length >= 10 && !checkNegative(product)) return;

        product = reverseProduct(product);
        clearDisplay();
        drawDisplay(product);
    }
    else {

        if (displayFull() && !checkNegative(currentNum)) return;

        if (currentNum === '') {

            currentNum = '-0'
            clearDisplay()
            drawDisplay(currentNum)
        }
        else if (currentNum === '-0') {

            currentNum = '';
            clearDisplay();
            drawDisplay('0');
        }
        else {

            currentNum = reverseProduct(currentNum);
            clearDisplay();
            drawDisplay(currentNum);
        }
    }
}





function checkProgramEmpty() {

    return !currentNum && !storedNum && !operator && !product;
}

function checkOneNumEntered() {

    return currentNum && !storedNum && !operator && !product;
}

function checkOperatorEntered() {

    return !currentNum && storedNum && operator && !product;
}

function checkTwoNumEntered() {

    return currentNum && storedNum && operator && !product;
}

function checkProductCalculated() {

    return !currentNum && !storedNum && !operator && product;
}




function changeOperatorBtnColor(e) {

    e.target.style.backgroundColor = 'slategrey';
    e.target.style.color = 'white';
}

function resetOperatorBtnColor() {

    btnAdd.style.backgroundColor = 'revert';
    btnAdd.style.color = 'revert';
    btnSub.style.backgroundColor = 'revert';
    btnSub.style.color = 'revert';
    btnDiv.style.backgroundColor = 'revert';
    btnDiv.style.color = 'revert';
    btnMulti.style.backgroundColor = 'revert';
    btnMulti.style.color = 'revert';
}






function sum() {
    
    return +storedNum + +currentNum
}

function sub() {
    
    return +storedNum - +currentNum
}

function multi() {
    
    return +storedNum * +currentNum
}

function div() {
    
    return +storedNum / +currentNum
}

function calcProduct() {

    switch(operator) {

        case '+':

            return sum(storedNum, currentNum);

        case '-':

            return sub(storedNum, currentNum);
        
        case 'x':

            return multi(storedNum, currentNum);
        
        case '÷':

            return div(storedNum, currentNum);
    }
}






function drawDisplay(string) {

    for (let i = 0; i < string.length; i++) {

        if (string[i] === '.') {

            display.firstChild.innerHTML = string[i] + display.firstChild.innerHTML;
        }
        else {

            let div = document.createElement("div");

            div.innerHTML = string[i];

            display.prepend(div);

        }  
    }
}

function clearDisplay() {

    while (display.childElementCount > 0) {

        display.removeChild(display.lastChild);
    }
}

function checkDecimalPresent(string) {

    return (string.indexOf('.') === -1) ? false : true;
}

function displayFull() {

    if (checkDecimalPresent(currentNum)) return currentNum.length - 1 >= 10;

    return currentNum.length >= 10;
}




function resetProgram() {

    resetOperatorBtnColor();
    clearDisplay();
    drawDisplay('0');

    currentNum = '';
    storedNum = '';
    operator = '';
    product = ''
}



// Functions for displaying product

function createDisplayNum(product) {


    if (checkNegative(product)) {

        product = reverseProduct(product);

        if (checkTooLarge(product,999999999)) return '-999999999';

        let intPlaces = calcIntPlaces(product);

        let decimalPlacesAvailable = 9 - intPlaces;

        product = (+product).toFixed(decimalPlacesAvailable);

        product = trimDecimal(product.toString());

        product = '-' + product;

        return product;
    } else {

        if (checkTooLarge(product,9999999999)) return '9999999999';

        let intPlaces = calcIntPlaces(product);

        let decimalPlacesAvailable = 10 - intPlaces;

        product = (+product).toFixed(decimalPlacesAvailable);

        product = trimDecimal(product.toString());
        
        return product;
    }

}

function checkTooLarge(product, maxNumber) {

    return product > maxNumber;
}

function checkNegative(product) {

    return (product[0] === '-') ? true : false;
}

function reverseProduct(product) {

    if (checkNegative(product)) return product.slice(1);
    
    return '-' + product;
}

function calcIntPlaces(product) {
            
    return Math.floor(product).toString().length;
}

function trimDecimal(product) {

    while (true) {

        if (product[product.length-1] === '0') {

            product = product.slice(0, (product.length-1));
        }
        else if (product[product.length-1] === '.') {

            product = product.slice(0, (product.length-1));
            break;
        }
        else {

            break;
        }
    }

    return product

    
}












btn1.addEventListener('click', numberBtn);
btn2.addEventListener('click', numberBtn);
btn3.addEventListener('click', numberBtn);
btn4.addEventListener('click', numberBtn);
btn5.addEventListener('click', numberBtn);
btn6.addEventListener('click', numberBtn);
btn7.addEventListener('click', numberBtn);
btn8.addEventListener('click', numberBtn);
btn9.addEventListener('click', numberBtn);

btn0.addEventListener('click', function(e) {

    if (checkProductCalculated()) resetProgram();

    if (currentNum.length === 0) return

    numberBtn(e)
});

btnAdd.addEventListener('click', operatorBtn);
btnSub.addEventListener('click', operatorBtn);
btnDiv.addEventListener('click', operatorBtn);
btnMulti.addEventListener('click', operatorBtn);

btnEquals.addEventListener('click', equalsBtn);

btnClear.addEventListener('click', resetProgram);

btnDecimal.addEventListener('click', decimalBtn);

btnNegPos.addEventListener('click', negPosBtn);
