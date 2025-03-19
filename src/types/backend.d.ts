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
            page: number;
            limit: number;
            pages: number;
            total: number;
        },
        result: T[]
    }


    interface ILogin {
        access_token: string;
        refresh_token: string;
        user: {
            id: string;
            email: string;
            phone: string;
            fullName: string;
            role: string;
            image: string;
            address: Address;
        }
    }

    interface IRegister {
        _id: string;
        email: string;
        fullName: string;
    }

    interface Address {
        city: { key: string; name: string };
        district: { key: string; name: string };
        ward: { key: string; name: string };
        street: { key: string; name: string };
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

    interface IGenre {
        productCount: number;
        _id: string;
        name: string;
        image: string;
    }

    export interface IAuthor {
        _id: string;
        name: string;
        deleted: boolean;
        createdAt: string;
        updatedAt: string;
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

    interface IBook {
        id: string;
        id_genre?: IGenre;
        name: string;
        image: string;
        slider?: string[];
        price_old: number;
        price_new?: number;
        quantity?: number;
        description?: string;
        status?: number;
        weight?: number;
        size?: string;
        publishers?: string;
        authors?: IAuthor[];
        year?: number;
        page_count?: number;
        book_cover?: string;
        rating?: number
        createdAt?: Date;
        updatedAt?: Date;
    }

    interface IBookTable {
        _id: string;
        id_genre: IGenre;
        name: string;
        image: string;
        slider?: string[];
        price_old: number;
        price_new: number;
        quantity: number;
        description?: string;
        status?: number;
        weight?: number;
        size?: string;
        publishers?: string;
        authors?: IAuthor[];
        year?: number;
        page_count?: number;
        book_cover?: string;
        rating?: number
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
    interface ICouponTable {
        _id: string ,
        code: string,
        value: number, 
        max_value: number, 
        min_total: number, 
        description: string ,
        quantity: number,
        status: boolean | string;
        start_date:Date,
        end_date: Date,
        createdAt?: Date;
        updatedAt?: Date;
      }
      interface IReView {
        _id: string
        name:  string,
        avgRating?:  number, 
        image: string,
        rating?:string,
        createdAt?:Date,
        updatedAt?:Date
      }
}