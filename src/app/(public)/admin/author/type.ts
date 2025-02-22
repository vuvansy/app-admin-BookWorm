export interface Author {
    id: string;
    name: string;
}
export interface ModalEditProps {
    open: boolean;
    author: Author | null;
    onClose: () => void;
    onFinish: (values: Author) => void;
}
