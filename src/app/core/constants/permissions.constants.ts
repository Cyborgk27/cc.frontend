/**
 * Constantes de permisos mapeadas directamente desde la base de datos.
 * Evitan el uso de "Magic Strings" en toda la aplicación.
 */
export const PERMISSIONS = {
    CATALOGS: {
        CREATE: 'CATALOGS_CREATE',
        READ: 'CATALOGS_READ',
        UPDATE: 'CATALOGS_UPDATE',
        DELETE: 'CATALOGS_DELETE',
    },
    PROJECTS: {
        READ: 'PROJECT_READ',   // Nota: Tu JSON dice PROJECT (singular)
        CREATE: 'PROJECT_CREATE',
        UPDATE: 'PROJECT_UPDATE',
        DELETE: 'PROJECT_DELETE',
    },
    USERS: {
        READ: 'USERS_READ',
        CREATE: 'USERS_CREATE',
        UPDATE: 'USERS_UPDATE',
        DELETE: 'USERS_DELETE',
    },
    SECURITY: {
        READ: 'SECURITY_READ',
        CREATE: 'SECURITY_CREATE',
        UPDATE: 'SECURITY_UPDATE',
        DELETE: 'SECURITY_DELETE',
    }
} as const;

type ValueOf<T> = T[keyof T];
export type AppPermission = ValueOf<{
    [K in keyof typeof PERMISSIONS]: ValueOf<typeof PERMISSIONS[K]>
}>;