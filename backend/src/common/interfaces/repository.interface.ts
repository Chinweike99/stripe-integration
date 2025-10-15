export interface IRepository<T>{
    create(entit: Partial<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    findOne(filter: any): Promise<T | null>;
    findAll(filter?: any): Promise<T[]>;
    update(id: string, entity: Partial<T>): Promise<T |  null>;
    delete(id: string): Promise<boolean>;
}