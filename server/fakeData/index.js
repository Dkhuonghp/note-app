export default {
    authors: [
        {
            id: 123,
            name: 'John',
        },
        {
            id: 999,
            name: 'khuong'
        }
    ],
    folders: [
        {
            id: '1',
            name: 'Home',
            authorId: 123
        },
        {
            id: '2',
            name: 'New Folder',
            authorId: 999
        },
        {
            id: '3',
            name: 'Work',
            authorId: 123
        },
    ],
    notes: [
        {
            id: '123',
            content: '<p>Go to super</p>',
            folderId: '1'
        },
        {
            id: '234',
            content: '<p>Go to park</p>',
            folderId: '1'
        },
        {
            id: '123',
            content: '<p>Go to school</p>',
            folderId: '2'
        },
        
    ]
}