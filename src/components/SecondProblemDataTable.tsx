// import React, { useRef, useState } from 'react';
// import { DataTable, DataTableExpandedRows, DataTableValueArray } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { Tag } from 'primereact/tag';
// import { ProgressBar } from 'primereact/progressbar';
// import { MultiSelect } from 'primereact/multiselect';
// import { Dropdown } from 'primereact/dropdown';
// import useFetch from "../hook/UseFetch";
// import { Toast } from "primereact/toast";
//
// interface Organization {
//     organization_id: string;
//     departments: Department[];
// }
//
// interface Department {
//     dept_id: string;
//     name: string;
//     head_count: number;
//     teams: Team[];
// }
//
// interface Team {
//     team_id: string;
//     members: Member[];
//     budget: number;
// }
//
// interface Member {
//     employee_id: string;
//     name: string;
//     role: string;
//     skills: string[];
//     projects: Project[];
// }
//
// interface Project {
//     project_id: string;
//     name: string;
//     status: string;
//     completion: number;
// }
//
// interface Response {
//     organizations: Organization[];
// }
//
// const statuses = ['On Track', 'Behind Schedule', 'Delayed', 'Completed'];
//
// export default function OrganizationDataTable() {
//     const { data }: { data: Response | null } = useFetch('/inventoryData/organization_department.json');
//     const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
//     const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
//     const [selectedStatus, setSelectedStatus] = useState<string>('');
//     const toast = useRef<Toast>(null);
//
//     // Extract all unique skills for filter
//     const allSkills = Array.from(new Set(
//         data?.organizations.flatMap(org =>
//             org.departments.flatMap(dept =>
//                 dept.teams.flatMap(team =>
//                     team.members.flatMap(member =>
//                         member.skills
//                     )
//                 )
//             )
//         ) || []
//     )).sort();
//
//     const budgetUtilizationTemplate = (rowData: Team) => {
//         const utilization = (rowData.budget / 500000) * 100; // Assuming max budget is 500k for visualization
//         return (
//             <div className="flex align-items-center gap-3">
//                 <ProgressBar
//                     value={utilization}
//                     showValue={false}
//                     style={{ height: '10px', width: '100px' }}
//                 />
//                 <span>${rowData.budget.toLocaleString()}</span>
//             </div>
//         );
//     };
//
//     const skillsTemplate = (rowData: Member) => {
//         return (
//             <div className="flex flex-wrap gap-1">
//                 {rowData.skills.map(skill => (
//                     <Tag
//                         key={skill}
//                         value={skill}
//                         severity={'info'}
//                         className="text-sm"
//                     />
//                 ))}
//             </div>
//         );
//     };
//
//     const statusTemplate = (project: Project) => {
//         const severity = getStatusSeverity(project.status);
//         return (
//             <Tag
//                 value={`${project.status} (${project.completion}%)`}
//                 severity={severity}
//                 icon={getStatusIcon(project.status)}
//             />
//         );
//     };
//
//     const getSeverity = (skill: string) => {
//         switch (skill.toLowerCase()) {
//             case 'aws': return 'success';
//             case 'python': return 'info';
//             case 'java': return 'warning';
//             case 'seo': return 'help';
//             default: return null;
//         }
//     };
//
//     const getStatusSeverity = (status: string) => {
//         switch (status) {
//             case 'On Track': return 'success';
//             case 'Behind Schedule': return 'warning';
//             case 'Delayed': return 'danger';
//             case 'Completed': return 'info';
//             default: return null;
//         }
//     };
//
//     const getStatusIcon = (status: string) => {
//         switch (status) {
//             case 'On Track': return 'pi pi-check';
//             case 'Behind Schedule': return 'pi pi-exclamation-triangle';
//             case 'Delayed': return 'pi pi-clock';
//             case 'Completed': return 'pi pi-verified';
//             default: return '';
//         }
//     };
//
//     const departmentRowExpansionTemplate = (department: Department) => {
//         return (
//             <div className="p-3">
//                 <h4 className="mb-3">Teams in {department.name}</h4>
//                 <DataTable
//                     value={department.teams}
//                     dataKey="team_id"
//                     expandedRows={expandedRows}
//                     onRowToggle={(e) => setExpandedRows(e.data)}
//                 >
//                     <Column field="team_id" header="Team ID" />
//                     <Column header="Member Count" body={(team) => team.members.length} />
//                     <Column header="Budget Utilization" body={budgetUtilizationTemplate} />
//                 </DataTable>
//             </div>
//         );
//     };
//
//     const teamRowExpansionTemplate = (team: Team) => {
//         // Filter members based on selected skills
//         const filteredMembers = selectedSkills.length > 0
//             ? team.members.filter(member =>
//                 member.skills.some(skill => selectedSkills.includes(skill))
//             )
//             : team.members;
//
//         // Further filter if project status is selected
//         const membersWithFilteredProjects = selectedStatus
//             ? filteredMembers.map(member => ({
//                 ...member,
//                 projects: member.projects.filter(proj => proj.status === selectedStatus)
//             })).filter(member => member.projects.length > 0)
//             : filteredMembers;
//
//         return (
//             <div className="p-3">
//                 <h4 className="mb-3">Members of Team {team.team_id}</h4>
//                 <div className="flex gap-3 mb-3">
//                     <MultiSelect
//                         value={selectedSkills}
//                         options={allSkills}
//                         onChange={(e) => setSelectedSkills(e.value)}
//                         placeholder="Filter by Skills"
//                         maxSelectedLabels={3}
//                         className="w-full md:w-20rem"
//                     />
//                     <Dropdown
//                         value={selectedStatus}
//                         options={['', ...statuses]}
//                         onChange={(e) => setSelectedStatus(e.value)}
//                         placeholder="Filter by Project Status"
//                         className="w-full md:w-20rem"
//                     />
//                 </div>
//                 <DataTable
//                     value={membersWithFilteredProjects}
//                     dataKey="employee_id"
//                     expandedRows={expandedRows}
//                     onRowToggle={(e) => setExpandedRows(e.data)}
//                 >
//                     <Column field="name" header="Name" />
//                     <Column field="role" header="Role" />
//                     <Column header="Skills" body={skillsTemplate} />
//                 </DataTable>
//             </div>
//         );
//     };
//
//     const memberRowExpansionTemplate = (member: Member) => {
//         return (
//             <div className="p-3">
//                 <h4 className="mb-3">Projects for {member.name}</h4>
//                 <DataTable value={member.projects}>
//                     <Column field="project_id" header="ID" />
//                     <Column field="name" header="Project Name" />
//                     <Column header="Status" body={statusTemplate} />
//                 </DataTable>
//             </div>
//         );
//     };
//
//     return (
//         <div className="card">
//             <Toast ref={toast} />
//             <DataTable
//                 value={data?.organizations}
//                 dataKey="dept_id"
//                 expandedRows={expandedRows}
//                 onRowToggle={(e) => setExpandedRows(e.data)}
//                 // rowExpansionTemplate={departmentRowExpansionTemplate}
//                 paginator
//                 rows={10}
//                 rowsPerPageOptions={[5, 10, 25]}
//                 emptyMessage="No departments found."
//                 className="p-datatable-sm"
//             >
//                 <Column expander style={{ width: '3rem' }} />
//                 <Column field="name" header="Department" sortable />
//                 <Column header="Team Count" body={(dept) => dept.teams.length} sortable />
//                 <Column field="head_count" header="Head Count" sortable />
//             </DataTable>
//
//             {/* Nested tables will be rendered through row expansion templates */}
//         </div>
//     );
// }

import React from 'react';

const SecondProblemDataTable = () => {
    return (
        <div>
            second
        </div>
    );
};

export default SecondProblemDataTable;