import React, {useRef, useState} from 'react';
import {DataTable, DataTableExpandedRows, DataTableValueArray} from 'primereact/datatable';
import {Column} from 'primereact/column';
import useFetch from "../hook/UseFetch";
import {Toast} from "primereact/toast";

interface Response {
    organization: {
        departments: []
    }
}

export default function SecondProblemDataTable() {
    const {data}: { data: Response | null } = useFetch('/inventoryData/organization_department.json');

    console.log(data?.organization?.departments);
    console.log(data)

    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
    const toast = useRef<Toast>(null);



    return (
        <div className="card">
            <Toast ref={toast}></Toast>
            <DataTable value={data?.organization?.departments} dataKey="sku" filterDisplay="row"
                       emptyMessage="No data found."
                       expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                       rows={10}
            >
                {/*<Column expander={true} style={{width: '1rem'}}/>*/}
                <Column field="name" header="Department" style={{minWidth: '12rem'}}/>
                <Column field="teams.team_id" header="Team ID" style={{minWidth: '12rem'}}/>
                <Column field="name" header="Member Count" style={{minWidth: '12rem'}}/>
                <Column field="category" header="Budget Utilization" style={{minWidth: '12rem'}}/>

            </DataTable>
        </div>
    );
}

