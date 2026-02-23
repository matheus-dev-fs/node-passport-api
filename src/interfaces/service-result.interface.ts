export interface ServiceResult<T> {
    isValid: boolean;
    status: number;
    message: string;
    data?: T;
}