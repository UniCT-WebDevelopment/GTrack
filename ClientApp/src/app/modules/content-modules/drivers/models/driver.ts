
export interface IDriver {
    uid: string,
    email: string, 
    name: string, 
    surname: string
    phoneNumber: string
}

export class Driver implements IDriver{
    uid: string = ""
    email: string = ""
    name: string = ""
    surname: string = ""
    phoneNumber: string = ""

    get _compositeName(): string{
        return this.name + " " + this.surname;
    }

    constructor(d : Driver){
        this.uid = d.uid;
        this.email = d.email;
        this.name = d.name;
        this.surname = d.surname;
        this.phoneNumber = d.phoneNumber;
    }
    
}

