'use client';
import { FC, useEffect, useState } from 'react';
import loyaltyData from '../../../data/operations/loyalty.json';
import { useLanguage } from '../../../context/LanguageContext';

const LoyaltyCards: FC = () => {
  const { t } = useLanguage();
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    setMembers(loyaltyData);
  }, []);

  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-2xl font-bold">{t['loyalty_cards']}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {members.map(member => (
          <div key={member.id} className="bg-slate-900 p-4 rounded shadow hover:scale-105 transition-transform">
            <h3 className="font-semibold">{member.name}</h3>
            <p>{t['level']}: {member.level}</p>
            <p>{t['points']}: {member.points}</p>
            <p>{t['orders']}: {member.orders}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoyaltyCards;
