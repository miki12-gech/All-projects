import HistoryView from "@/features/history/history.view";
import { historyAlbums, thenAndNowData } from "@/features/history/history.data";

export default function HistoryPage() {
    return <HistoryView albums={historyAlbums} thenAndNow={thenAndNowData} />;
}
