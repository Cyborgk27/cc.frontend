export interface TableColumn {
    key: string;
    label: string;
    class?: string;   // El signo '?' indica que es opcional
    type?: 'text' | 'boolean' | 'date' | 'badge';
}