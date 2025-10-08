export interface EnquiryRequestDto {
    title: string;
    category: string;
    status?: string;
    content: string;
    agreement?: boolean;
    imageURL?: string;
    writerEmail?: string;
  }
  
  export interface EnquiryResponseDto extends EnquiryRequestDto {
    id: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
  }
  