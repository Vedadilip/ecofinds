
import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { USERS } from '../constants';

const userMap = new Map<string, User>(USERS.map(u => [u.id, u]));

export const PurchasesPage: React.FC = () => {
    const { purchases } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

    const getSellerName = (sellerId: string) => {
        return userMap.get(sellerId)?.username || 'Unknown Seller';
    };

    const filteredAndSortedPurchases = useMemo(() => {
        let processedPurchases = [...purchases].reverse(); // Show most recent first by default

        if (searchTerm.trim()) {
            processedPurchases = processedPurchases.filter(item => 
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                getSellerName(item.sellerId).toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (sortBy === 'price-asc') {
            processedPurchases.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
            processedPurchases.sort((a, b) => b.price - a.price);
        }

        return processedPurchases;
    }, [purchases, searchTerm, sortBy]);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-text-primary mb-6">Previous Purchase</h1>

            <div className="mb-6 space-y-4">
                <input
                    type="search"
                    placeholder="Search ...."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                    aria-label="Search previous purchases"
                />
                <div className="flex flex-wrap gap-2">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'default' | 'price-asc' | 'price-desc')}
                        className="p-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400"
                        aria-label="Sort purchases"
                    >
                        <option value="default">Sort</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                    </select>
                    <button className="p-2 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50">Filter</button>
                    <button className="p-2 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50">Group by</button>
                </div>
            </div>

            {purchases.length > 0 ? (
                 filteredAndSortedPurchases.length > 0 ? (
                    <div className="space-y-4">
                        {filteredAndSortedPurchases.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="bg-surface rounded-lg shadow-md overflow-hidden p-4 flex items-start space-x-4">
                               <img src={item.imageUrl} alt={item.title} className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md flex-shrink-0" />
                               <div className="flex-grow">
                                   <h2 className="font-semibold text-lg text-text-primary">{item.title}</h2>
                                   <p className="text-primary font-bold mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                                   <p className="text-text-secondary text-sm mt-1">Category: {item.category}</p>
                                   <p className="text-text-secondary text-sm mt-1">Seller: {getSellerName(item.sellerId)}</p>
                               </div>
                           </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-surface rounded-lg">
                        <h2 className="text-2xl font-semibold text-text-primary">No purchases match your search.</h2>
                        <p className="text-text-secondary mt-2">Try a different search term.</p>
                    </div>
                )
            ) : (
                <div className="text-center py-16 bg-surface rounded-lg">
                    <h2 className="text-2xl font-semibold text-text-primary">You haven't made any purchases yet.</h2>
                    <Link to="/" className="text-primary hover:underline mt-4 inline-block">Start Shopping</Link>
                </div>
            )}
        </div>
    );
};
