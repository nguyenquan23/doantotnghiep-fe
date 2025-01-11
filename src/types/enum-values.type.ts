export type EnumValues<T extends Record<keyof T, string>> = T[keyof T]
