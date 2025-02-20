export interface DataType {
    stt: number;
    code: string;
    discount: number;
    start_date: string;
    end_date: string;
  }
  
  export interface TableGiftProps {
    data: DataType[];
  }
  