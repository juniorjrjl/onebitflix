export const PageSerializer = (pageable: {page: number, perPage: number, total: number, content: any[]}, contentSerializer: (row: any) => any) =>{
    return{
        page: pageable.page,
        perPage: pageable.perPage,
        total: pageable.total,
        content: pageable.content && pageable.content.length ? pageable.content.map(r => contentSerializer(r)) : []
    }
}