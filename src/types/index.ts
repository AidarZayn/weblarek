export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type TPayment = 'card' | 'cash';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type IErrorsBayer = Partial<Record<keyof IBuyer, string>>

export interface IProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment | null;
    email: string;
    phone: string;
    address: string;
}

export interface ICatalogFromApi {
    total: number;
    items: IProduct[];
}

export interface IOrder {
    payment?: TPayment | null;
    email?: string;
    phone?: string;
    address?: string;
    total: number;
    items: string[];
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface ICardActions {
    onClick?: () => void;
    deleteButtonClickHandler?: () => void;
    purchaseButtonClickHandler?: () => void;
}

export interface IFormActions {
    submitButtonClickHandler?: () => void;
    paymentButtonClickHandler?: (payment: TPayment) => void;
    addressInputChangeHandler?: (address: string) => void;
    emailInputChangeHandler?: (email: string) => void;
    phoneInputChangeHandler?: (phone: string) => void;
}

export interface ISuccessActions {
    onOrdered?: () => void;
    successButtonClickHandler?: () => void;
}