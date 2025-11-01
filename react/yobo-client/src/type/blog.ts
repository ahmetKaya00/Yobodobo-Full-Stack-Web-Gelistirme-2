export type BlogItem = {
    id: number;
    title: string;
    slug: string;
    content: string;
    isPusblished: boolean;
    createdAt: string;
    updatedAt?: string | null;
    authorId: string;
    authorEmail?:string | null;
    authorFullName?:string | null;
}

export type BlogCreateRequest = {
    title: string;
    content: string;
    isPublished: boolean;
}

export type BlogUpdateRequest = BlogCreateRequest;