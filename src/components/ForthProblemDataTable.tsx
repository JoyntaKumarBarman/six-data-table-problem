import React, {useRef, useState} from 'react';
import {DataTable, DataTableExpandedRows, DataTableValueArray} from 'primereact/datatable';
import {Column} from 'primereact/column';
import useFetch from "../hook/UseFetch";
import {Toast} from "primereact/toast";
import {Benchmarks, Department, Historical_price, Holdings} from "../type";

interface Response {
    portfolio: {
        investor_id: string;
        total_value: number;
        holdings : Holdings[],
        benchmarks : Benchmarks
    }
}

export default function ForthProblemDataTable() {
    const {data}: { data: Response | null } = useFetch('/inventoryData/portfolio.json');
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
    const [expandedTeamRows, setExpandedTeamRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
    const toast = useRef<Toast>(null);


    //function
    const getVolatility = (historicalPrices: Historical_price[]): number => {
        if (historicalPrices.length < 2) return 0;

        // Step 1: Calculate daily returns
        const returns: number[] = [];
        for (let i = 1; i < historicalPrices.length; i++) {
            const prev = historicalPrices[i - 1].close;
            const curr = historicalPrices[i].close;
            const dailyReturn = (curr - prev) / prev;
            returns.push(dailyReturn);
        }

        // Step 2: Calculate mean of returns
        const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;

        // Step 3: Calculate variance
        const squaredDiffs = returns.map(r => Math.pow(r - meanReturn, 2));
        const variance = squaredDiffs.reduce((sum, d) => sum + d, 0) / (returns.length - 1);

        // Step 4: Volatility = standard deviation of returns
        const volatility = Math.sqrt(variance);
        return volatility;
    };



    // Template

    const previousDayValueTemplate = (rowData: Holdings) => {
        const {historical_prices, current_price} = rowData;

        const date = new Date();
        const yesterDay = new Date( date);
        yesterDay.setDate(yesterDay.getDate() - 1);
        const formattedDate = yesterDay.toISOString().split("T")[0];
        console.log();
        const lastPrice = historical_prices?.find((priceObj: Historical_price) => priceObj?.date === formattedDate);
        if(lastPrice){
            return lastPrice?.close;
        }else {

            return "No last day data."
        }
    }

    const dailyChangePercentageTemplate = (rowData: Holdings) => {
        const {historical_prices, current_price} = rowData;

        const date = new Date();
        const yesterDay = new Date( date);
        yesterDay.setDate(yesterDay.getDate() - 1);
        const formattedDate = yesterDay.toISOString().split("T")[0];
        console.log();
        const lastPrice = historical_prices?.find((priceObj: Historical_price) => priceObj?.date === formattedDate);

        if(lastPrice){
            const {close : closePrice} = lastPrice;
            const differenceParcentage = (current_price/(closePrice/100)) - 100;
            return differenceParcentage < 0 ? <p className={'text-red-600'}>{differenceParcentage.toFixed(2)}%</p>: <p className={'text-green-700'}>{differenceParcentage.toFixed(2)}%</p>;
        }
        return "Does not exist last date"
    }

    const sharpRatioTemplate = (rowData: Holdings) => {
        const {historical_prices, current_price} = rowData;
        const {sp500_return, risk_free_rate} = data?.portfolio?.benchmarks!;
        const volatility = getVolatility(historical_prices);
        const sharpRatio = (sp500_return - risk_free_rate)/volatility;

return sharpRatio.toFixed(2) + `-${volatility}`;
    }


    const rowExpansionTemplate = (data: Holdings) => {
        console.log(data)
        return (
            <div className="p-5">
                <h5>Department for {data.name}</h5>
                <DataTable value={data?.transactions} dataKey={'date'} emptyMessage="No data found."
                           expandedRows={expandedTeamRows} onRowToggle={(e) => setExpandedTeamRows(e.data)}
                >
                    <Column field="date" header="Team Id" ></Column>
                    <Column field="type" header="Type" ></Column>
                    <Column field="quantity" header="Quantity" ></Column>
                    <Column field="price" header="Price" ></Column>
                    <Column field="fee" header="Fee" ></Column>
                </DataTable>
            </div>
        );
    }


    return (
        <div className="card">

            <Toast ref={toast}></Toast>
            <DataTable value={data?.portfolio?.holdings} dataKey="symbol" filterDisplay="row"
                       emptyMessage="No data found."
                       globalFilterFields={["department", "status"]}
                       expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                       rowExpansionTemplate={rowExpansionTemplate}
                       rows={9}
                       paginator


            >
                <Column expander={true} style={{width: '1rem'}}/>
                <Column field="symbol" header="Symbol" style={{minWidth: '12rem'}}/>
                <Column field="current_price" header="Previous Day Value" body={previousDayValueTemplate}  style={{minWidth: '12rem'}}/>
                <Column field="current_price" header="Current Value"  style={{minWidth: '12rem'}}/>
                <Column field="symbol" header="Daily Δ%" body={dailyChangePercentageTemplate} style={{minWidth: '12rem'}}/>
                <Column field="symbol" header="Sharp Ratio" body={sharpRatioTemplate} style={{minWidth: '12rem'}}/>

            </DataTable>
            {/*<TestTable/>*/}
        </div>
    );
}

