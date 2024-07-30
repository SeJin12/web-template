export interface NoticeType {
    total_count: number;
    notice_id: number;
    title: string;
    content: string;
    view_count: number;
    writer: string;
    created_id: string;
    created_at: Date;
    updated_id: string;
    updated_at: Date;
    deleted_id: string;
    deleted_at: string;
}

export interface NoticeDetailType {
    total_count: number;
    notice_id: number;
    comment: string;
    writer: string;
    created_id: string;
    created_at: Date;
    updated_id: string;
    updated_at: Date;
    deleted_id: string;
    deleted_at: string;
}