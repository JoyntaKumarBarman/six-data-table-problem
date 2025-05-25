import React, {useRef, useState} from 'react';
import {DataTable, DataTableExpandedRows, DataTableValueArray} from 'primereact/datatable';
import {Column} from 'primereact/column';
import useFetch from "../hook/UseFetch";
import {Toast} from "primereact/toast";
import {Department} from "../type";

interface Response {
    organization: {
        departments: Department[]
    }
}

export default function SecondProblemDataTable() {
    const {data}: { data: Response | null } = useFetch('/inventoryData/organization_department.json');

    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
    const [expandedTeamRows, setExpandedTeamRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
    const toast = useRef<Toast>(null);





    return (
        <div className="card">

            <Toast ref={toast}></Toast>
            <DataTable value={data?.organization?.departments} dataKey="dept_id" filterDisplay="row"
                       emptyMessage="No data found."
                       expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                       rows={10}
                       paginator

            >
                <Column expander={true} style={{width: '1rem'}}/>
                <Column field="name" header="Department" style={{minWidth: '12rem'}}/>
            </DataTable>
            {/*<TestTable/>*/}
        </div>
    );
}

