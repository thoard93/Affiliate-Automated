import { getCommissionStats, getRecentCommissions, getCreatorsList } from '@/actions/commissions';
import CommissionsClient from './CommissionsClient';

export const dynamic = 'force-dynamic';

export default async function CommissionsPage() {
  const stats = await getCommissionStats();
  const transactions = await getRecentCommissions();
  const creators = await getCreatorsList();

  return (
    <CommissionsClient
      initialStats={stats}
      initialTransactions={transactions}
      creators={creators}
    />
  );
}

