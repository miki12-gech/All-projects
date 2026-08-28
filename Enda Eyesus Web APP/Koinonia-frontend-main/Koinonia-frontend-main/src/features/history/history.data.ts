import { HistoryAlbum, ThenAndNow } from './history.types';

export const historyAlbums: HistoryAlbum[] = [
    {
        year: '2017',
        title: 'Foundations of Growth',
        description: 'The early years were marked by a small but dedicated group of students gathering for prayer and Scripture study. Foundations were laid for what would become a cornerstone of spiritual growth at Mekelle University.',
        images: [
            { src: '/history/2017/photo1.jpg', alt: 'Gathering in 2017' },
            { src: '/history/2017/photo2.jpg', alt: 'Prayer service 2017' }
        ]
    },
    {
        year: '2018',
        title: 'Expanding the Fellowship',
        description: 'As more students joined, the fellowship expanded its activities. We began organizing regular service classes and outreach programs, building a strong community of faith.',
        images: [
            { src: '/history/2018/photo1.jpg', alt: 'Fellowship retreat 2018' },
            { src: '/history/2018/photo2.jpg', alt: 'Service class 2018' },
            { src: '/history/2018/photo3.jpg', alt: 'Choir practice 2018' }
        ]
    },
    {
        year: '2019',
        title: 'Strength in Unity',
        description: 'A year of significant spiritual milestones. The fellowship hosted its largest annual spiritual conference, bringing together Orthodox students from across different campuses.',
        images: [
            { src: '/history/2019/photo1.jpg', alt: 'Annual conference 2019' },
            { src: '/history/2019/photo2.jpg', alt: 'Spiritual trip 2019' }
        ]
    },
    {
        year: 'Present',
        title: 'Continuing the Legacy',
        description: 'Today, Enda Eyesus MU Fellowship remains a vibrant spiritual home. We continue to serve our community, firmly rooted in our Orthodox Tewahedo faith and values.',
        images: [
            { src: '/p1.png', alt: 'Recent gathering' },
            { src: '/p2.png', alt: 'Sunday service' },
            { src: '/p3.png', alt: 'Community outreach' },
            { src: '/p4.png', alt: 'Fellowship members' }
        ]
    }
];

export const thenAndNowData: ThenAndNow = {
    then: {
        src: '/history/2017/photo1.jpg',
        year: '2017',
        description: 'Our humble beginnings with a small prayer group.'
    },
    now: {
        src: '/p1.png',
        year: 'Present',
        description: 'A thriving community of faithful students.'
    }
};
