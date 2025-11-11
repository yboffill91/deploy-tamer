
class RoleFunctionalityVO {
    readonly id?: number
    readonly mode?: ('READ' | 'WRITE' | 'FULL_ACCESS')[]
}

export class RolesEntity {

    readonly id?: number
    readonly name?: string
    readonly roleFunctionality?: RoleFunctionalityVO[]
}
