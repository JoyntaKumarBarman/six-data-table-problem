import React, { useState } from 'react';
import { DataTable, DataTableExpandedRows } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressBar } from 'primereact/progressbar';
import { MultiSelect } from 'primereact/multiselect';
import { Tag } from 'primereact/tag';
import useFetch from "../hook/UseFetch";

type Project = {
    project_id: string;
    name: string;
    status: string;
    completion: number;
};

type Member = {
    employee_id: string;
    name: string;
    role: string;
    skills: string[];
    projects: Project[];
};

type Team = {
    team_id: string;
    budget: number;
    members: Member[];
};

type Department = {
    dept_id: string;
    name: string;
    head_count: number;
    teams: Team[];
};

const organizationData: Department[] = [
    {
        dept_id: 'D-IT',
        name: 'Information Technology',
        head_count: 15,
        teams: [
            {
                team_id: 'T-INFRA',
                budget: 250000,
                members: [
                    {
                        employee_id: 'E-1001',
                        name: 'Sarah Johnson',
                        role: 'Network Engineer',
                        skills: ['AWS', 'Cisco', 'Python'],
                        projects: [
                            {
                                project_id: 'P-2024-01',
                                name: 'Cloud Migration',
                                status: 'Behind Schedule',
                                completion: 65,
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

interface Response {
    organization: {
        departments: []
    }
}

const TestTable: React.FC = () => {
    const [expandedDepartments, setExpandedDepartments] = useState<DataTableExpandedRows>({});
    const {data}: { data: Response | null } = useFetch('/inventoryData/organization_department.json');
    console.log(data)
    const [expandedTeams, setExpandedTeams] = useState<DataTableExpandedRows>({});
    const [skillFilter, setSkillFilter] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<string[]>([]);

    const allSkills = ['AWS', 'Cisco', 'Python'];
    const allStatuses = ['On Track', 'Behind Schedule', 'Completed'];

    const getStatusSeverity = (status: string): 'success' | 'danger' | 'info' | undefined => {
        switch (status) {
            case 'On Track':
                return 'success';
            case 'Behind Schedule':
                return 'danger';
            case 'Completed':
                return 'info';
            default:
                return undefined;
        }
    };

    const teamIdTemplate = (rowData: any) => {
        return 'aa'
    }

    const teamRowExpansionTemplate = (team: Team) => {
        const filteredMembers = team.members.filter((m) => {
            const skillMatch = skillFilter.length === 0 || m.skills.some((s) => skillFilter.includes(s));
            const statusMatch =
                statusFilter.length === 0 ||
                m.projects.some((p) => statusFilter.includes(p.status));
            return skillMatch && statusMatch;
        });

        return (
            <DataTable value={filteredMembers}>
                <Column field="name" header="Name" />
                <Column field="role" header="Role" />
                <Column
                    header="Skills"
                    body={(member: Member) =>
                        member.skills.map((skill, idx) => (
                            <Tag key={idx} value={skill} className="mr-1" />
                        ))
                    }
                />
                <Column
                    header="Projects"
                    body={(member: Member) =>
                        member.projects.map((project, idx) => (
                            <div key={idx} className="mb-2">
                                <strong>{project.name}</strong> -{' '}
                                <Tag severity={getStatusSeverity(project.status)} value={project.status} />
                                <ProgressBar value={project.completion} className="mt-1" />
                            </div>
                        ))
                    }
                />
            </DataTable>
        );
    };

    const departmentRowExpansionTemplate = (department: Department) => {
        return (
            <DataTable
                value={department.teams}
                dataKey="team_id"
                expandedRows={expandedTeams}
                onRowToggle={(e: any) => setExpandedTeams(e.data)}
                rowExpansionTemplate={teamRowExpansionTemplate}
            >
                <Column expander style={{ width: '3em' }} />
                <Column field="team_id" header="Team ID" />
                <Column
                    header="Member Count"
                    body={(team: Team) => team.members.length}
                />
                <Column
                    header="Budget Utilization"
                    body={() => <ProgressBar value={65} />}
                />
            </DataTable>
        );
    };

    return (
        <div className="card">
            <h3>Organization Overview</h3>

            <div className="flex gap-3 mb-4">
                <MultiSelect
                    value={skillFilter}
                    options={allSkills}
                    onChange={(e) => setSkillFilter(e.value)}
                    placeholder="Filter by Skills"
                    className="w-60"
                />
                <MultiSelect
                    value={statusFilter}
                    options={allStatuses}
                    onChange={(e) => setStatusFilter(e.value)}
                    placeholder="Filter by Project Status"
                    className="w-60"
                />
            </div>

            <DataTable
                value={data?.organization?.departments}
                dataKey="dept_id"
                expandedRows={expandedDepartments}
                onRowToggle={(e: any) => setExpandedDepartments(e.data)}
                rowExpansionTemplate={departmentRowExpansionTemplate}
            >
                <Column expander style={{ width: '3em' }} />
                <Column field="name" header="Department" />
                <Column field={'teams'} header={"Team ID"} body={teamIdTemplate} />
                <Column field="head_count" header="Head Count" />
            </DataTable>
        </div>
    );
};

export default TestTable;
