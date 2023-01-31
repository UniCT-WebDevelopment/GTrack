export interface MenuItem{
    title: string;
    route: string;
    icon: string;
    subItems: MenuItem[]
}

export interface MenuGroup{
    title:string;
    items: MenuItem[];
}

export interface Menu{
    groups: MenuGroup[];
}
