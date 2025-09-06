import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { Link } from 'react-router-dom';
import { User, Product } from '../types';
import { USERS } from '../constants';

const userMap = new Map<string, User>(USERS.map(u => [u.id, u]));

const PurchaseItem: React.FC<{ item: Product }> = ({ item }) => {
    const getSellerName = (sellerId: string) => {
        return userMap.get(sellerId)?.username || 'Unknown Seller';
    };

    return (
        <div className="bg-surface rounded-lg shadow-md overflow-hidden p-4 flex items-start space-x-4">
            <img src={item.imageUrl} alt={item.title} className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md flex-shrink-0" />
            <div className="flex-grow">
                <h2 className="font-semibold text-lg text-text-primary">{item.title}</h2>
                <p className="text-primary font-bold mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                <p className="text-text-secondary text-sm mt-1">Category: {item.category}</p>
                <p className="text-text-secondary text-sm mt-1">Seller: {getSellerName(item.sellerId)}</p>
            </div>
        </div>
    );
};


export const PurchasesPage: React.FC = () => {
    const { purchases } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'date-desc' | 'price-asc' | 'price-desc'>('date-desc');
    const [groupBy, setGroupBy] = useState<'none' | 'category'>('none');

    const getSellerName = (sellerId: string) => {
        return userMap.get(sellerId)?.username || 'Unknown Seller';
    };

    const processedPurchases = useMemo(() => {
        let tempPurchases = [...purchases];

        // 1. Filter by search term
        if (searchTerm.trim()) {
            tempPurchases = tempPurchases.filter(product =>
                product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                getSellerName(product.sellerId).toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 2. Sort
        switch (sortBy) {
            case 'price-asc':
                tempPurchases.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                tempPurchases.sort((a, b) => b.price - a.price);
                break;
            case 'date-desc':
            default:
                // The original purchases array is in chronological order of purchase.
                // We reverse a copy to get the newest items first.
                tempPurchases.reverse();
                break;
        }

        return tempPurchases;
    }, [purchases, searchTerm, sortBy]);
    
    const groupedPurchases = useMemo(() => {
        if (groupBy !== 'category') {
            return null;
        }
        return processedPurchases.reduce((acc, purchase) => {
            const key = purchase.category;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(purchase);
            return acc;
        }, {} as Record<string, Product[]>);

    }, [processedPurchases, groupBy]);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-text-primary mb-6">Previous Purchases</h1>

             <div className="bg-surface p-4 rounded-lg shadow-md mb-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="w-full md:flex-1">
                     <input
                        type="text"
                        placeholder="Search by title or seller..."
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Search previous purchases"
                    />
                </div>
                <div className="flex w-full md:w-auto gap-4">
                    <div className="flex-1">
                        <label htmlFor="sort-by" className="sr-only">Sort by</label>
                        <select
                            id="sort-by"
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value as typeof sortBy)}
                             className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        >
                            <option value="date-desc">Newest</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <label htmlFor="group-by" className="sr-only">Group by</label>
                        <select
                            id="group-by"
                            value={groupBy}
                            onChange={e => setGroupBy(e.target.value as typeof groupBy)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        >
                            <option value="none">Group By: None</option>
                            <option value="category">Group By: Category</option>
                        </select>
                    </div>
                </div>
            </div>


            {purchases.length > 0 ? (
                 processedPurchases.length > 0 ? (
                    <div className="space-y-6">
                        {groupBy === 'category' && groupedPurchases ? (
                            Object.entries(groupedPurchases).map(([category, items]) => (
                                <div key={category}>
                                    <h2 className="text-2xl font-semibold text-text-primary mb-4 pb-2 border-b-2 border-primary-light">{category}</h2>
                                    <div className="space-y-4">
                                        {items.map((item, index) => <PurchaseItem key={`${item.id}-${index}`} item={item} />)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            processedPurchases.map((item, index) => <PurchaseItem key={`${item.id}-${index}`} item={item} />)
                        )}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-surface rounded-lg">
                        <h2 className="text-2xl font-semibold text-text-primary">No purchases match your search.</h2>
                        <p className="text-text-secondary mt-2">Try a different search term or adjust filters.</p>
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