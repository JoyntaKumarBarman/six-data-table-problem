import React, {useRef, useState} from 'react';
import {DataTable, DataTableExpandedRows, DataTableStateEvent, DataTableValueArray} from 'primereact/datatable';
import {Column, ColumnFilterElementTemplateOptions, ColumnSortEvent} from 'primereact/column';
import useFetch from "../hook/UseFetch";
import {Toast} from "primereact/toast";
import {Course} from "../type";
import {ProgressBar} from "primereact/progressbar";
import {Tag} from "primereact/tag";
import {Dropdown} from "primereact/dropdown";
import {Button} from "primereact/button";

interface Response {
    academic_records: {
        courses: Course[]
    }
}

export default function ThirdProblemDataTable() {
    const {data}: { data: Response | null } = useFetch('/inventoryData/academic_record.json');


    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
    const [expandedTeamRows, setExpandedTeamRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
    const toast = useRef<Toast>(null);
    const [department] = useState<string[]>(["Computer Science", "Mathematics", "Philosophy", "Economics", "Art", "Psychology", "Chemistry", "History", "Biology", "English"]);

    // functions
    const getStatusSeverity = (status: string) => {
        switch (status.toLowerCase()) {
            case 'open':
                return 'success';  // green
            case 'closed':
                return 'danger';   // red
            case 'waitlisted':
                return 'warning';  // yellow
            default:
                return 'info';     // blue or neutral
        }
    };

    const enrolmentStatusSortableFunction = (e: ColumnSortEvent) => {
        // e.data.sort((a: Course, b: Course) => {
        //     const { enrollment: { current: aCurrent, capacity: aCapacity } } = a;
        //     const { enrollment: { current: bCurrent, capacity: bCapacity } } = b;
        //
        //     const percentageA = (aCurrent / aCapacity) * 100;
        //     const percentageB = (bCurrent / bCapacity) * 100;
        //
        //     console.log((percentageA - percentageB) * e.order!)
        //
        //     return (percentageA - percentageB) * e.order!;  // Ascending if order = 1, descending if order = -1
        // });
    };

    const prerequisitesTemplate = (rowData: Course) => {
        const {prerequisites} = rowData;
        const prerequisitesTag = prerequisites.map((prerequisite) => <a href={'/'}><Tag value={prerequisite} severity={'info'}></Tag></a>)
        return <div className={'flex gap-2'}>{prerequisitesTag}</div>
    }

    const enrollmentStatusTemplate = (rowData: Course) => {
        const {current, capacity} = rowData?.enrollment;
        const currentValueParcentage = ((100 / capacity) * current).toFixed(0);
        return <ProgressBar value={currentValueParcentage}
                            displayValueTemplate={() => `${current}/${capacity} (${currentValueParcentage}%)`}/>
    }

    const statusPillTemplate = (rowData: Course) => {
        const {status} = rowData;
        return <span className={'flex align-content-center gap-2'}><Tag severity={getStatusSeverity(status)}
                                                                        className="border-circle w-2rem h-2rem flex align-items-center justify-content-center"
                                                                        title={status}/> </span>
    };

    const waitListTemplate = (rowData: Course) => {
        const {current, capacity} = rowData?.enrollment;
        const currentValueParcentage = ((100 / capacity) * current).toFixed(0);
        return currentValueParcentage === '100' ? <Button className={'p-2'}>WaitList</Button> : '';
    }

    const departmentFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Dropdown value={options?.value} options={department} placeholder="Select department"
                         onChange={(e) => options.filterApplyCallback(e.value)} className="p-column-filter" showClear
                         style={{minWidth: '12rem'}}/>
    }

    const statusFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Dropdown value={options?.value} options={["open", "close", "waitlisted"]} placeholder="Select status."
                         onChange={(e) => options.filterApplyCallback(e.value)} className="p-column-filter" showClear
                         style={{minWidth: '12rem'}}/>
    }


    const rowExpansionTemplate = (data: Course) => {
        return (
            <div className="p-5">
                <DataTable value={[data]} dataKey={'team_id'} emptyMessage="No data found."

                >
                    <Column field="schedule.room" header="Room"></Column>
                    <Column field="schedule.time" header="Team Id"></Column>
                    <Column field="prerequisites" header="Prerequisites Courses" body={prerequisitesTemplate}></Column>
                </DataTable>
            </div>
        );
    }


    return (
        <div className="card">

            <Toast ref={toast}></Toast>
            <DataTable value={data?.academic_records?.courses} dataKey="course_code" filterDisplay="row"
                       emptyMessage="No data found."
                       sortMode="single"
                       globalFilterFields={["department", "status"]}
                       expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                       rowExpansionTemplate={rowExpansionTemplate}
                       rows={10}
                       paginator
            >
                <Column expander={true} style={{width: '1rem'}}/>
                <Column field="department" header="Department" filter filterField={"department"}
                        filterElement={departmentFilterTemplate} style={{minWidth: '12rem'}}/>
                <Column field="course_code" header="Course Code" style={{minWidth: '12rem'}}/>
                <Column field="title" header="Title" style={{minWidth: '12rem'}}/>
                <Column field="instructor" header="Instructor" style={{minWidth: '12rem'}}/>
                <Column field="enrollment" header="Enrollment Status" body={enrollmentStatusTemplate} sortable
                         style={{minWidth: '12rem'}}/>
                <Column field="status" header="Status" body={statusPillTemplate} filter
                        filterElement={statusFilterTemplate} style={{minWidth: '2rem'}}/>
                <Column field="status" header="Wait List" body={waitListTemplate} style={{minWidth: '5rem'}}/>
            </DataTable>
        </div>
    );
}

