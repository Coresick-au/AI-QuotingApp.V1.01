import { describe, it, expect } from 'vitest';
import { calculateShiftBreakdown } from './logic';
import type { Shift, Rates } from './types';

const MOCK_RATES: Rates = {
    siteNormal: 100,
    siteOvertime: 150,
    weekend: 200,
    publicHoliday: 250,
    officeReporting: 0, // Not used in these tests
    travel: 80,
    travelOvertime: 100,
    travelCharge: 0,
    travelChargeExBrisbane: 0,
    vehicle: 50,
    perDiem: 100,
    standardDayRate: 0,
    weekendDayRate: 0
};

describe('Business Logic - Shift Calculations', () => {

    it('Standard Weekday: 8am-4pm (8h) with 0.5h Travel In/Out', () => {
        // Total Duration: 8h
        // Travel In: 0.5h
        // Travel Out: 0.5h
        // Site Hours: 7h
        // Logic:
        // 1. Travel In (0.5) -> Consumes NT (0.5/7.5 used) -> Cost: 0.5 * 80 = 40
        // 2. Site (7.0) -> Consumes NT (7.0/7.5 used) -> Cost: 7.0 * 100 = 700
        // 3. Travel Out (0.5) -> Consumes remaining NT? No, 0.5+7.0 = 7.5. So Travel Out is OT?
        // Wait, 0.5 (Travel In) + 7.0 (Site) = 7.5.
        // So Travel Out starts at 7.5.
        // Travel Out (0.5) -> All OT. -> Cost: 0.5 * 100 = 50.
        // Total Cost: 40 + 700 + 50 = 790.

        const shift: Shift = {
            id: 1,
            date: '2023-10-27',
            dayType: 'weekday',
            startTime: '08:00',
            finishTime: '16:00',
            travelIn: 0.5,
            travelOut: 0.5,
            vehicle: false,
            perDiem: false,
            tech: 'Test Tech'
        };

        const result = calculateShiftBreakdown(shift, MOCK_RATES);

        expect(result.breakdown.totalHours).toBe(8);
        expect(result.breakdown.siteHours).toBe(7);

        // Breakdown checks
        expect(result.breakdown.travelInNT).toBe(0.5);
        expect(result.breakdown.travelInOT).toBe(0);
        expect(result.breakdown.siteNT).toBe(7);
        expect(result.breakdown.siteOT).toBe(0);
        expect(result.breakdown.travelOutNT).toBe(0); // Cap reached exactly at end of site time
        expect(result.breakdown.travelOutOT).toBe(0.5);

        // Cost check
        expect(result.cost).toBe(790);
    });

    it('Heavy Overtime Weekday: 6am-6pm (12h) with 1h Travel In/Out', () => {
        // Total Duration: 12h
        // Travel In: 1h
        // Travel Out: 1h
        // Site Hours: 10h
        // Logic:
        // 1. Travel In (1.0) -> Consumes NT (1.0/7.5 used) -> Cost: 1 * 80 = 80
        // 2. Site (10.0) -> 
        //    - NT Remaining: 6.5.
        //    - Site NT: 6.5 -> Cost: 6.5 * 100 = 650
        //    - Site OT: 3.5 -> Cost: 3.5 * 150 = 525
        // 3. Travel Out (1.0) -> All OT -> Cost: 1 * 100 = 100
        // Total Cost: 80 + 650 + 525 + 100 = 1355.

        const shift: Shift = {
            id: 2,
            date: '2023-10-27',
            dayType: 'weekday',
            startTime: '06:00',
            finishTime: '18:00',
            travelIn: 1,
            travelOut: 1,
            vehicle: false,
            perDiem: false,
            tech: 'Test Tech'
        };

        const result = calculateShiftBreakdown(shift, MOCK_RATES);

        expect(result.breakdown.totalHours).toBe(12);
        expect(result.breakdown.siteHours).toBe(10);

        expect(result.breakdown.travelInNT).toBe(1);
        expect(result.breakdown.siteNT).toBe(6.5);
        expect(result.breakdown.siteOT).toBe(3.5);
        expect(result.breakdown.travelOutOT).toBe(1);

        expect(result.cost).toBe(1355);
    });

    it('Weekend: Ensure ALL site hours use Weekend rate and Travel uses OT rate', () => {
        // 8am-4pm (8h). Travel 0.5 each. Site 7h.
        // Travel In: 0.5 * 100 (OT) = 50
        // Site: 7 * 200 (Weekend) = 1400
        // Travel Out: 0.5 * 100 (OT) = 50
        // Total: 1500

        const shift: Shift = {
            id: 3,
            date: '2023-10-28',
            dayType: 'weekend',
            startTime: '08:00',
            finishTime: '16:00',
            travelIn: 0.5,
            travelOut: 0.5,
            vehicle: false,
            perDiem: false,
            tech: 'Test Tech'
        };

        const result = calculateShiftBreakdown(shift, MOCK_RATES);

        expect(result.breakdown.siteHours).toBe(7);
        expect(result.cost).toBe(1500);
    });

    it('Public Holiday: Ensure ALL site hours use Public Holiday rate', () => {
        // 8am-4pm (8h). Travel 0.5 each. Site 7h.
        // Travel In: 0.5 * 250 (PH) = 125
        // Site: 7 * 250 (PH) = 1750
        // Travel Out: 0.5 * 250 (PH) = 125
        // Total: 2000

        const shift: Shift = {
            id: 4,
            date: '2023-10-29',
            dayType: 'publicHoliday',
            startTime: '08:00',
            finishTime: '16:00',
            travelIn: 0.5,
            travelOut: 0.5,
            vehicle: false,
            perDiem: false,
            tech: 'Test Tech'
        };

        const result = calculateShiftBreakdown(shift, MOCK_RATES);

        expect(result.breakdown.siteHours).toBe(7);
        expect(result.cost).toBe(2000);
    });

    it('Allowances: Vehicle and Per Diem add correctly', () => {
        // Base shift: Standard Weekday (Cost 790)
        // + Vehicle (50)
        // + Per Diem (100)
        // Total = 790 + 50 + 100 = 940

        const shift: Shift = {
            id: 5,
            date: '2023-10-27',
            dayType: 'weekday',
            startTime: '08:00',
            finishTime: '16:00',
            travelIn: 0.5,
            travelOut: 0.5,
            vehicle: true,
            perDiem: true,
            tech: 'Test Tech'
        };

        const result = calculateShiftBreakdown(shift, MOCK_RATES);

        expect(result.cost).toBe(940);
    });
});
