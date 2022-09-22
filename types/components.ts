export interface IPostItemTag {
    id: number;
    title: string;
}

export interface IPostItem {
    id: number;
    title: string;
    image_url: string;
    resource_url: string;
    category: string;
    category_id: number;
    description: string;
    author: string;
    tags?: IPostItemTag[];
    slug?: string;
}

export interface IPostItemGrid {
    title: string;
    description?: string;
    image_url?: string;
    resource_url: string;
    category?: string;
    author: string;
    slug?: string;
}

export interface ILink {
    label: string;
    url: string;
    icon?: any;
    openInNewTab?: boolean;
    disabled?: boolean;
}

export interface ILinksGroupProps {
    title?: string;
    links: ILink[];
}