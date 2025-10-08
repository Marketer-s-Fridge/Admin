export interface CommentRequestDto {
    enquiryId: number;
    content: string;
  }
  
  export interface CommentResponseDto {
    id: number;
    enquiryId: number;
    content: string;
    createdAt: string;
    updatedAt: string;
  }
  