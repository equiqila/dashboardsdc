/**
 * ExcelDataContext.tsx
 *
 * Provides async-loaded Excel data to the entire app via React Context.
 * Wrap your app root with <ExcelDataProvider> and use useExcelData() to access.
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import type {
    TouristArrivalRecord,
    InitialInvestmentRecord,
    AttractivenessRecord,
    SectorInvestmentRecord,
    InvestmentEventRecord,
    CountryInvestmentRecord,
    InvestorRecord,
    InvestmentOpportunityRecord,
    SearchIntensityRecord,
} from "./types";
import {
    loadTouristArrivals,
    loadDataAwal,
    loadInvestorData,
    loadKemenparData,
} from "./excelDataLoader";

export interface ExcelData {
    touristArrivalsData: TouristArrivalRecord[];
    initialInvestmentData: InitialInvestmentRecord[];
    attractivenessData: AttractivenessRecord[];
    sectorInvestmentData: SectorInvestmentRecord[];
    investmentEventData: InvestmentEventRecord[];
    countryInvestmentData: CountryInvestmentRecord[];
    investorData: InvestorRecord[];
    investmentOpportunityData: InvestmentOpportunityRecord[];
    searchIntensityData: SearchIntensityRecord[];
}

interface ExcelDataContextValue {
    data: ExcelData | null;
    loading: boolean;
    error: string | null;
}

const ExcelDataContext = createContext<ExcelDataContextValue>({
    data: null,
    loading: true,
    error: null,
});

export function ExcelDataProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<ExcelData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadAll() {
            try {
                const [
                    touristArrivals,
                    awalData,
                    investorResult,
                    kemenparResult,
                ] = await Promise.all([
                    loadTouristArrivals(),
                    loadDataAwal(),
                    loadInvestorData(),
                    loadKemenparData(),
                ]);

                if (cancelled) return;

                // Merge attractiveness: prefer data_awal values when available,
                // supplement with kemenpar (search-based) scores
                const mergedAttr = mergeAttractiveness(
                    awalData.attractiveness,
                    kemenparResult.attractivenessFromKemenpar
                );

                setData({
                    touristArrivalsData: touristArrivals,
                    initialInvestmentData: awalData.initialInvestment,
                    attractivenessData: mergedAttr,
                    sectorInvestmentData: investorResult.sectorInvestment,
                    investmentEventData: investorResult.investmentEvent,
                    countryInvestmentData: investorResult.countryInvestment,
                    investorData: investorResult.investorData,
                    investmentOpportunityData: investorResult.investmentOpportunity,
                    searchIntensityData: kemenparResult.searchIntensity,
                });
            } catch (err) {
                if (!cancelled) {
                    console.error("Failed to load Excel data:", err);
                    setError(String(err));
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadAll();
        return () => { cancelled = true; };
    }, []);

    return (
        <ExcelDataContext.Provider value={{ data, loading, error }}>
            {children}
        </ExcelDataContext.Provider>
    );
}

function mergeAttractiveness(
    awal: AttractivenessRecord[],
    kemenpar: AttractivenessRecord[]
): AttractivenessRecord[] {
    const map = new Map<string, AttractivenessRecord>();

    // Start with kemenpar data (search-based)
    kemenpar.forEach((r) => {
        map.set(`${r.destinationId}-${r.year}`, r);
    });

    // Override/merge with awal data (has confidence scores)
    awal.forEach((r) => {
        const key = `${r.destinationId}-${r.year}`;
        const existing = map.get(key);
        if (existing) {
            map.set(key, {
                ...existing,
                score: Math.round((existing.score + r.score) / 2),
                newInvestments: r.newInvestments,
                newsFrequency: existing.newsFrequency + r.newsFrequency,
            });
        } else {
            map.set(key, r);
        }
    });

    return Array.from(map.values());
}

export function useExcelData(): ExcelDataContextValue {
    return useContext(ExcelDataContext);
}

/** Returns data or falls back to the given default if not yet loaded */
export function useExcelDataOrDefault<T>(
    selector: (data: ExcelData) => T,
    defaultVal: T
): T {
    const { data } = useExcelData();
    return data ? selector(data) : defaultVal;
}
