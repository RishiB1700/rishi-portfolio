import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Rishi Portfolio')
    .items([
      // Blog Section
      S.listItem()
        .title('✍️ Scribbles & Signals')
        .child(
          S.list()
            .title('Blog Management')
            .items([
              S.listItem()
                .title('📝 Posts')
                .child(S.documentTypeList('post').title('All Posts')),
              S.listItem()
                .title('👤 Authors')
                .child(S.documentTypeList('author').title('Authors')),
              S.listItem()
                .title('🏷️ Categories')
                .child(S.documentTypeList('category').title('Categories')),
            ])
        ),
      
      // Ad Archive Section
      S.listItem()
        .title('📺 Ad Archive')
        .child(S.documentTypeList('adArchive').title('Campaigns')),
      
      S.divider(),
      
      // Other document types (if any)
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['post', 'category', 'author', 'adArchive'].includes(item.getId()!),
      ),
    ])