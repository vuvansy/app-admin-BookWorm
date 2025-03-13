export { };
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript
declare global {

    interface IRequest {
        url: string;
        method: string;
        body?: { [key: string]: any };
        queryParams?: any;
        useCredentials?: boolean;
        headers?: any;
        nextOption?: any;
    }

    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }

    interface ILogin {
        access_token: string;
        user: {
            email: string;
            phone: string;
            fullName: string;
            role: string;
            avatar: string;
            id: string;
        }
    }

    interface IRegister {
        _id: string;
        email: string;
        fullName: string;
    }

    interface IUser {
        _id: string;
        fullName: string;
        phone: string;
        email?: string;
        image?: string;
        address?: Address;
        role: "USER" | "ADMIN";
        isBlocked?: boolean;
        password: string;
        isActive?: boolean;
        reset_token?: string | null;
        createdAt?: Date;
        updatedAt?: Date;
    }

    interface IFetchAccount {
        user: IUser
    }

    interface Address {
        city: { key: string; name: string };
        district: { key: string; name: string };
        ward: { key: string; name: string };
        street?: string;
    }

    interface IUserTable {
        _id: string;
        fullName: string;
        phone: string;
        email?: string;
        image?: string;
        address?: Address;
        role: "USER" | "ADMIN";
        isBlocked?: boolean;
        password: string;
        isActive?: boolean;
        reset_token?: string | null;
        createdAt?: Date;
        updatedAt?: Date;
    }

    interface IResponseImport {
        countSuccess: number;
        countError: number;
        detail: any;
    }

    interface IBookTable {
        _id: string;
        thumbnail: string;
        slider: string[];
        mainText: string;
        author: string;
        price: number;
        sold: number;
        quantity: number;
        category: string;
        createdAt: Date;
        updatedAt: Date;
    }

    interface IAuthorTable {
        _id: string;
        name: string;
        delete: boolean;
        createdAt: Date;
        updatedAt: Date;
    }

    interface ICart {
        _id: string;
        quantity: number;
        detail: IBookTable;
    }
    interface Ward {
        Id: string;
        Name: string;
    }

    interface District {
        Id: string;
        Name: string;
        Wards: Ward[];
    }

    interface City {
        Id: string;
        Name: string;
        Districts: District[];
    }


}