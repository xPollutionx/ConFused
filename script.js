// Price comparison calculator
function calculatePricePerUnit(item) {
    const conversions = {
        'liters': 1000,
        'fl oz': 29.5735,
        'gallons': 3785.41,
        'milliliters': 1,
        'grams': 1,
        'kilograms': 1000,
        'ounces': 28.3495,
        'half ounces': 14.1748,
        'eighth ounces': 3.5437,
        'pounds': 453.592,
        'quarts': 946.353,
        'pints': 473.176,
        'units': 1
    };

    const totalAmount = item.quantity * item.itemsPerPurchase * item.weight * conversions[item.unitType.toLowerCase()];
    return (item.salePrice || item.price) / totalAmount;
}

// Test runner
function runTests() {
    const tests = [
        // Test 1: Basic 2L vs 16-pack comparison (known working case)
        function test1() {
            const item1 = {
                quantity: 1,
                itemsPerPurchase: 1,
                weight: 2,
                unitType: 'liters',
                price: 3.49
            };

            const item2 = {
                quantity: 1,
                itemsPerPurchase: 16,
                weight: 20,
                unitType: 'fl oz',
                price: 18.28
            };

            const price1PerUnit = calculatePricePerUnit(item1);
            const price2PerUnit = calculatePricePerUnit(item2);

            console.log('Test 1: 2L vs 16-pack');
            console.log(`Item 1 price per mL: ${price1PerUnit.toFixed(6)}`);
            console.log(`Item 2 price per mL: ${price2PerUnit.toFixed(6)}`);
            console.log(`Result: ${Math.abs(price1PerUnit - 0.001745) < 0.0001 ? 'PASS' : 'FAIL'}`);
            return Math.abs(price1PerUnit - 0.001745) < 0.0001 && price1PerUnit < price2PerUnit;
        },

        // Test 2: Compare items with same unit type
        function test2() {
            const item1 = {
                quantity: 1,
                itemsPerPurchase: 1,
                weight: 500,
                unitType: 'grams',
                price: 2.99
            };

            const item2 = {
                quantity: 1,
                itemsPerPurchase: 1,
                weight: 1,
                unitType: 'kilograms',
                price: 5.99
            };

            const price1PerUnit = calculatePricePerUnit(item1);
            const price2PerUnit = calculatePricePerUnit(item2);

            console.log('Test 2: Same unit type comparison');
            console.log(`500g price per g: ${price1PerUnit.toFixed(6)}`);
            console.log(`1kg price per g: ${price2PerUnit.toFixed(6)}`);
            console.log(`Result: ${Math.abs(price1PerUnit - 0.00598) < 0.0001 ? 'PASS' : 'FAIL'}`);
            return Math.abs(price1PerUnit - 0.00598) < 0.0001;
        },

        // Test 3: Sale prices
        function test3() {
            const item1 = {
                quantity: 1,
                itemsPerPurchase: 1,
                weight: 2,
                unitType: 'liters',
                price: 3.49,
                salePrice: 2.99
            };

            const item2 = {
                quantity: 1,
                itemsPerPurchase: 1,
                weight: 2,
                unitType: 'liters',
                price: 3.49
            };

            const price1PerUnit = calculatePricePerUnit(item1);
            const price2PerUnit = calculatePricePerUnit(item2);

            console.log('Test 3: Sale price handling');
            console.log(`Sale item price per mL: ${price1PerUnit.toFixed(6)}`);
            console.log(`Regular price per mL: ${price2PerUnit.toFixed(6)}`);
            console.log(`Result: ${price1PerUnit < price2PerUnit ? 'PASS' : 'FAIL'}`);
            return price1PerUnit < price2PerUnit;
        },

        // Test 4: Multi-quantity comparison
        function test4() {
            const item1 = {
                quantity: 2,
                itemsPerPurchase: 6,
                weight: 12,
                unitType: 'fl oz',
                price: 10.99
            };

            const item2 = {
                quantity: 1,
                itemsPerPurchase: 12,
                weight: 12,
                unitType: 'fl oz',
                price: 10.99
            };

            const price1PerUnit = calculatePricePerUnit(item1);
            const price2PerUnit = calculatePricePerUnit(item2);

            console.log('Test 4: Multi-quantity comparison');
            console.log(`2x6 pack price per mL: ${price1PerUnit.toFixed(6)}`);
            console.log(`1x12 pack price per mL: ${price2PerUnit.toFixed(6)}`);
            console.log(`Result: ${Math.abs(price1PerUnit - price2PerUnit) < 0.0001 ? 'PASS' : 'FAIL'}`);
            return Math.abs(price1PerUnit - price2PerUnit) < 0.0001;
        }
    ];

    // Run all tests
    let passedTests = 0;
    tests.forEach((test, index) => {
        if (test()) {
            passedTests++;
            console.log(`Test ${index + 1} passed!\n`);
        } else {
            console.log(`Test ${index + 1} failed!\n`);
        }
    });

    console.log(`${passedTests} out of ${tests.length} tests passed.`);
    return passedTests === tests.length;
}

// Add this function after calculatePricePerUnit but before the click handler
function analyzeSavings(higherPrice, lowerPrice, cheaperItemName) {
    const percentageDifference = ((higherPrice - lowerPrice) / higherPrice) * 100;
    let savingsMessage = '';
    let savingsColor = '';

    if (percentageDifference < 5) {
        savingsMessage = `Choosing ${cheaperItemName} saves you a minimal amount - The price difference is very small.`;
        savingsColor = '#FFB6C1'; // Light pink
    } else if (percentageDifference < 15) {
        savingsMessage = `Choosing ${cheaperItemName} offers moderate savings - Worth considering if you buy this item often.`;
        savingsColor = '#98FB98'; // Pale green
    } else if (percentageDifference < 30) {
        savingsMessage = `Choosing ${cheaperItemName} provides significant savings - This is a meaningful price difference!`;
        savingsColor = '#32CD32'; // Lime green
    } else {
        savingsMessage = `${cheaperItemName} offers major savings - This is an excellent value!`;
        savingsColor = '#008000'; // Green
    }

    return `<br><span style="color:${savingsColor}; font-weight:bold;">${savingsMessage}</span>`;
}

// Main comparison logic
document.getElementById('compare-btn').addEventListener('click', function() {
    console.log("Compare button clicked");
    
    // Get item 1 values
    const item1 = {
        name: document.getElementById('item1-name').value,
        quantity: parseFloat(document.getElementById('item1-quantity').value) || 1,
        itemsPerPurchase: parseFloat(document.getElementById('item1-unit-amount').value) || 1,
        weight: parseFloat(document.getElementById('item1-weight').value) || 1,
        unitType: document.getElementById('item1-unit-type').value.toLowerCase(),
        price: parseFloat(document.getElementById('item1-price').value) || 0,
        salePrice: parseFloat(document.getElementById('item1-sale').value) || null
    };

    // Get item 2 values
    const item2 = {
        name: document.getElementById('item2-name').value,
        quantity: parseFloat(document.getElementById('item2-quantity').value) || 1,
        itemsPerPurchase: parseFloat(document.getElementById('item2-unit-amount').value) || 1,
        weight: parseFloat(document.getElementById('item2-weight').value) || 1,
        unitType: document.getElementById('item2-unit-type').value.toLowerCase(),
        price: parseFloat(document.getElementById('item2-price').value) || 0,
        salePrice: parseFloat(document.getElementById('item2-sale').value) || null
    };

    // Calculate prices per unit
    const price1PerUnit = calculatePricePerUnit(item1);
    const price2PerUnit = calculatePricePerUnit(item2);

    // Format prices to 4 decimal places
    const preciseItem1PricePerUnit = parseFloat(price1PerUnit.toFixed(4));
    const preciseItem2PricePerUnit = parseFloat(price2PerUnit.toFixed(4));

    // Determine if units are volume or weight
    const volumeUnits = ['liters', 'fl oz', 'gallons', 'milliliters', 'quarts', 'pints'];
    const weightUnits = ['grams', 'kilograms', 'ounces', 'half ounces', 'eighth ounces', 'pounds'];

    const isItem1Volume = volumeUnits.includes(item1.unitType);
    const isItem2Volume = volumeUnits.includes(item2.unitType);
    const isItem1Weight = weightUnits.includes(item1.unitType);
    const isItem2Weight = weightUnits.includes(item2.unitType);

    // Compare items and set result text
    const resultElement = document.getElementById('result');
    let resultText;

    // Validate that we're comparing same types of units
    if ((isItem1Volume && !isItem2Volume) || (isItem1Weight && !isItem2Weight)) {
        resultText = "Error: Cannot compare volume units with weight units. Please use the same type of units for both items.";
    } else {
        const unitType = isItem1Volume ? "mL" : (isItem1Weight ? "g" : "unit");
        
        if (preciseItem1PricePerUnit < preciseItem2PricePerUnit) {
            resultText = `<span style="color:green;">${item1.name}</span> is cheaper than <span style="color:red;">${item2.name}</span>.<br>
            <span style="color:green;">${item1.name}</span> costs $${preciseItem1PricePerUnit} per ${unitType}.<br>
            <span style="color:red;">${item2.name}</span> costs $${preciseItem2PricePerUnit} per ${unitType}.${analyzeSavings(preciseItem2PricePerUnit, preciseItem1PricePerUnit, item1.name)}`;
        } else if (preciseItem1PricePerUnit > preciseItem2PricePerUnit) {
            resultText = `<span style="color:green;">${item2.name}</span> is cheaper than <span style="color:red;">${item1.name}</span>.<br>
            <span style="color:green;">${item2.name}</span> costs $${preciseItem2PricePerUnit} per ${unitType}.<br>
            <span style="color:red;">${item1.name}</span> costs $${preciseItem1PricePerUnit} per ${unitType}.${analyzeSavings(preciseItem1PricePerUnit, preciseItem2PricePerUnit, item2.name)}`;
        } else {
            resultText = `<span style="color:yellow;">${item1.name}</span> and <span style="color:yellow;">${item2.name}</span> have the same price.<br>Both cost $${preciseItem1PricePerUnit} per ${unitType}.`;
        }
    }

    // Display result
    resultElement.innerHTML = resultText;

    // Set colors for input fields and labels
    function setColor(item, color) {
        const fields = document.querySelectorAll(`#${item}-table label, #${item}-table input, #${item}-table select`);
        fields.forEach(field => {
            field.style.color = color;
        });
    }

    if (preciseItem1PricePerUnit < preciseItem2PricePerUnit) {
        setColor('item1', 'green');
        setColor('item2', 'red');
    } else if (preciseItem1PricePerUnit > preciseItem2PricePerUnit) {
        setColor('item2', 'green');
        setColor('item1', 'red');
    } else {
        setColor('item1', 'yellow');
        setColor('item2', 'yellow');
    }
});

// Add a test button to the UI
const testButton = document.createElement('button');
testButton.textContent = 'Run Tests';
testButton.style.marginTop = '20px';
testButton.style.padding = '10px 20px';
testButton.style.backgroundColor = '#8a2be2';
testButton.style.color = 'white';
testButton.style.border = 'none';
testButton.style.borderRadius = '5px';
testButton.style.cursor = 'pointer';

testButton.addEventListener('click', function() {
    console.clear();
    console.log('Running tests...\n');
    const allTestsPassed = runTests();
    testButton.style.backgroundColor = allTestsPassed ? '#4CAF50' : '#f44336';
    setTimeout(() => {
        testButton.style.backgroundColor = '#8a2be2';
    }, 2000);
});

document.body.appendChild(testButton);
