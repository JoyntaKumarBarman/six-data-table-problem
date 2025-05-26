import React, {useRef, useState} from 'react';
import {DataTable, DataTableExpandedRows, DataTableFilterMeta, DataTableValueArray} from 'primereact/datatable';
import {Column} from 'primereact/column';
import useFetch from "../hook/UseFetch";
import {Toast} from "primereact/toast";
import TestTable from "./TestTable";
import {Department, Member, Project, Team} from "../type";
import {Tag} from "primereact/tag";
import {ProgressBar} from "primereact/progressbar";
import {Badge} from "primereact/badge";
import {MultiSelect, MultiSelectChangeEvent} from "primereact/multiselect";
import {FilterMatchMode} from "primereact/api";

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
    const [skillFilter, setSkillFilter] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<string[]>([]);

    const allSkills = ['AWS', 'Cisco', 'Python'];
    const allStatuses = ['On Track', 'Behind Schedule', 'Completed'];



    const onGlobalFilterChange = (e: MultiSelectChangeEvent) => {
        const value = e.target.value;
        // let _filters = { ...filters };
        //
        // // @ts-ignore
        // _filters['global'].value = value;
        //
        // setFilters(_filters);
        console.log(e?.target?.value);
    };

    // Templates
    const teamIdTemplate = (rowData: Department) => {
        const teamId = rowData?.teams.map((team: Team) => <Tag key={team?.team_id} severity={'success'} rounded>{team?.team_id}</Tag>)
        return <div className={'flex gap-2'}>{teamId}</div>;
    }

    const memberCountTemplate = (rowData: Department) => {
        const teamId = rowData?.teams.reduce((total: number, team: Team) => total + team?.members.length, 0)
        return <div className={'flex gap-2'}>{teamId}</div>;
    }

    const totalBudgetTemplate = (rowData: Department) => {
        const totalBudget = rowData?.teams.reduce((total: number, team: Team) => total + team?.budget, 0)
        return totalBudget;
    }

    const budgetUtilizationTemplate = (rowData: Team) => {
        const totalCompletion = rowData?.members.reduce((total: number, member: Member) => total + member?.projects.reduce((t: number, project: Project) =>  t + project?.completion, 0),0)
        const totalProject = rowData?.members.reduce((total: number, member: Member) => total + member?.projects.length,0);
        const budgetUtilized = (rowData?.budget / (totalProject * 100)) * totalCompletion;
        const progressParcentage = (totalCompletion/totalProject).toFixed(1)
        return <ProgressBar value={progressParcentage} displayValueTemplate={() => `${budgetUtilized.toFixed(0)}(${progressParcentage}%)/${rowData?.budget}`}/>
    }

    const memberSkillsTemplate = (rowData: Member) => {
        const skillsBadges = rowData?.skills.map((skill: string) => <Badge key={skill} value={skill} severity={'success'}/>)
        return <div className={'flex gap-2'} >{skillsBadges}</div>
    }

    const memberProjectTemplate = (rowData: Member) => {
        const projectsBadges = rowData?.projects.map((project: Project) => <Badge severity={'warning'} value={project?.name}/>)
        return projectsBadges
    }

    const rowExpansionProjectTemplate = (data: Member) => {

        return (
            <div className="p-5">
                <DataTable value={data?.projects} dataKey={'project_id'} emptyMessage="No data found."
                           header={statusHeader}
                >
                    <Column field="project_id" header="Project Id" ></Column>
                    <Column field="name" header="Name" ></Column>
                    <Column field="completion" header="Completion" body={(e: Project) => e?.completion + "%"}  ></Column>
                    <Column field="status" header="Status" style={{minWidth: '12rem'}}></Column>
                </DataTable>
            </div>
        );
    }

    const rowExpansionTeamTemplate = (data: Team) => {

        return (
            <div className="p-5">
                <DataTable value={data?.members} dataKey={'employee_id'} emptyMessage="No data found."
                           header={header}
                           expandedRows={expandedTeamRows} onRowToggle={(e) => setExpandedTeamRows(e.data)}
                           rowExpansionTemplate={rowExpansionProjectTemplate}

                >

                    <Column expander={true} style={{width: '1rem'}}/>
                    <Column field="employee_id" header="Employee Id" ></Column>
                    <Column field="name" header="Name" ></Column>
                    <Column field="role" header="Role" ></Column>
                    <Column field="skills" header="Skills" body={memberSkillsTemplate} style={{minWidth: '12rem'}}></Column>
                    <Column field="projects" header="Projects"  body={memberProjectTemplate} style={{minWidth: '12rem'}}></Column>
                    <Column field="project" header="Project Status"  body={memberProjectTemplate} style={{minWidth: '12rem'}}></Column>
                </DataTable>
            </div>
        );
    }


    const rowExpansionTemplate = (data: Department) => {

        return (
            <div className="p-5">
                <h5>Department for {data.name}</h5>
                <DataTable value={data.teams} dataKey={'team_id'} emptyMessage="No data found."
                           expandedRows={expandedTeamRows} onRowToggle={(e) => setExpandedTeamRows(e.data)}
                           rowExpansionTemplate={rowExpansionTeamTemplate}
                           >
                    <Column expander={true} style={{width: '1rem'}}/>
                    <Column field="team_id" header="Team Id" ></Column>
                    <Column field="budget" header="Team Budget" ></Column>
                    <Column field="member" header="Budget Utilization" body={budgetUtilizationTemplate} ></Column>
                </DataTable>
            </div>
        );
    }


    const header = <div className="flex gap-3 mb-4">
        <MultiSelect
            value={skillFilter}
            options={allSkills}
            onChange={(e) => {
                setSkillFilter(e?.value);
                onGlobalFilterChange(e);
            }}
            placeholder="Filter by Skills"
            className="w-60"
        />

    </div>;

    const statusHeader = <div className="flex gap-3 mb-4">
        <MultiSelect
            value={statusFilter}
            options={allStatuses}
            onChange={(e) => setStatusFilter(e.value)}
            placeholder="Filter by Project Status"
            className="w-60"
        />
    </div>




    return (
        <div className="card">

            <Toast ref={toast}></Toast>
            <DataTable value={data?.organization?.departments} dataKey="dept_id" filterDisplay="row"
                       emptyMessage="No data found."
                       expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                       rowExpansionTemplate={rowExpansionTemplate}
                       rows={10}
                       paginator

            >
                <Column expander={true} style={{width: '1rem'}}/>
                <Column field="name" header="Department" style={{minWidth: '12rem'}}/>
                <Column field="teams.team_id" header="Team ID" body={teamIdTemplate} style={{minWidth: '12rem'}}/>
                <Column field="name" header="Member Count" body={memberCountTemplate} style={{minWidth: '12rem'}}/>
                <Column header="Total Budget" body={totalBudgetTemplate}
                />

            </DataTable>
            {/*<TestTable/>*/}
        </div>
    );
}

