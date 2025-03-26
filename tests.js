import { describe, it, expect } from 'vitest';

// Helper function to simulate the price comparison calculation
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

describe('Price Comparator Tests', () => {
    // Test 1: Basic 2L vs 16-pack comparison (known working case)
    it('should correctly compare 2L bottle vs 16-pack of 20oz bottles', () => {
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

        expect(price1PerUnit).toBeCloseTo(0.001745, 4);
        expect(price2PerUnit).toBeCloseTo(0.001931, 4);
        expect(price1PerUnit).toBeLessThan(price2PerUnit);
    });

    // Test 2: Compare items with same unit type
    it('should compare items with same unit type (grams)', () => {
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

        expect(price1PerUnit).toBeCloseTo(0.00598, 4);
        expect(price2PerUnit).toBeCloseTo(0.00599, 4);
    });

    // Test 3: Test with sale prices
    it('should use sale price when available', () => {
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

        expect(price1PerUnit).toBeLessThan(price2PerUnit);
    });

    // Test 4: Multi-quantity comparison
    it('should handle multiple quantities correctly', () => {
        const item1 = {
            quantity: 2,  // Buying 2 packs
            itemsPerPurchase: 6, // 6 cans per pack
            weight: 12,   // 12 oz each
            unitType: 'fl oz',
            price: 10.99
        };

        const item2 = {
            quantity: 1,  // Buying 1 pack
            itemsPerPurchase: 12, // 12 cans per pack
            weight: 12,   // 12 oz each
            unitType: 'fl oz',
            price: 10.99
        };

        const price1PerUnit = calculatePricePerUnit(item1);
        const price2PerUnit = calculatePricePerUnit(item2);

        expect(price1PerUnit).toBeCloseTo(price2PerUnit, 4);
    });

    // Test 5: Edge cases with small numbers
    it('should handle very small measurements accurately', () => {
        const item1 = {
            quantity: 1,
            itemsPerPurchase: 100,
            weight: 0.1,
            unitType: 'grams',
            price: 5.99
        };

        const item2 = {
            quantity: 1,
            itemsPerPurchase: 1,
            weight: 10,
            unitType: 'grams',
            price: 0.99
        };

        const price1PerUnit = calculatePricePerUnit(item1);
        const price2PerUnit = calculatePricePerUnit(item2);

        expect(price1PerUnit).toBeCloseTo(0.599, 3);
        expect(price2PerUnit).toBeCloseTo(0.099, 3);
    });

    // Test 6: Different volume units comparison
    it('should correctly compare different volume units', () => {
        const item1 = {
            quantity: 1,
            itemsPerPurchase: 1,
            weight: 1,
            unitType: 'gallons',
            price: 3.99
        };

        const item2 = {
            quantity: 1,
            itemsPerPurchase: 4,
            weight: 1,
            unitType: 'quarts',
            price: 4.99
        };

        const price1PerUnit = calculatePricePerUnit(item1);
        const price2PerUnit = calculatePricePerUnit(item2);

        // 1 gallon = 4 quarts, so item1 should be cheaper
        expect(price1PerUnit).toBeLessThan(price2PerUnit);
    });
}); 