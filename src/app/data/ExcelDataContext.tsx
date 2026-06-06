import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import { loadDashboardData } from "./excelDataLoader";
import type { DashboardData } from "./types";

interface ExcelDataContextValue {
    data: DashboardData | null;
    loading: boolean;
    error: string | null;
}

const ExcelDataContext = createContext<ExcelDataContextValue>({
    data: null,
    loading: true,
    error: null,
});

export function ExcelDataProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadDashboardData()
            .then((d) => {
                setData(d);
                setLoading(false);
            })
            .catch((e) => {
                console.error("Failed to load dashboard data:", e);
                setError(String(e));
                setLoading(false);
            });
    }, []);

    return (
        <ExcelDataContext.Provider value={{ data, loading, error }}>
            {children}
        </ExcelDataContext.Provider>
    );
}

export function useExcelData() {
    return useContext(ExcelDataContext);
}
