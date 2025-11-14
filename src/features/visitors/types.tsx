// types/visitorStats.ts

/** 🔹 방문자 추적 요청 쿼리 */
export interface VisitorTrackQuery {
    /** 방문 페이지 경로 (optional) */
    path?: string;
  }
  
  /** 🔹 세션 기준 방문 통계 조회 응답 */
  export interface SessionStats {
    today: number;
    thisMonth: number;
    all: number;
  }
  