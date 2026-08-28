export interface HistoryImage {
    src: string;
    alt: string;
}

export interface HistoryAlbum {
    year: string;
    title: string;
    description: string;
    images: HistoryImage[];
}

export interface ThenAndNow {
    then: {
        src: string;
        year: string;
        description: string;
    };
    now: {
        src: string;
        year: string;
        description: string;
    };
}
