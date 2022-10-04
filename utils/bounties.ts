import {IOption} from "../components/shared/form/SelectElement";

export const typeOptions: IOption[] = [
    {id: "single_worker", name: "Single Worker"},
    {id: "many_workers", name: "Many Workers"},
];
export const permissionOptions: IOption[] = [
    {id: false, name: "Permissionless"},
    {id: true, name: "Require Permission"}
];
export const experienceOptions: IOption[] = [
    {id: "beginner", name: "Beginner"},
    {id: "intermediate", name: "Intermediate"},
    {id: "experienced", name: "Experienced"},
];
export const issueTypeOptions: IOption[] = [
    {id: "bug", name: "Bug"},
    {id: "feature", name: "Feature"},
    {id: "design", name: "Design"},
    {id: "other", name: "Other"},
];