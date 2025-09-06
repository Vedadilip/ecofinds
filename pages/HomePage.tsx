import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { Product, Category } from '../types';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <Link to={`/product/${product.id}`} className="group block bg-surface rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
        <div className="relative pt-[75%]"> {/* 4:3 Aspect Ratio */}
            <img src={product.imageUrl} alt={product.title} className="absolute top-0 left-0 w-full h-full object-cover" />
        </div>
        <div className="p-4">
            <h3 className="font-semibold text-lg text-text-primary truncate group-hover:text-primary">{product.title}</h3>
            <p className="text-2xl font-bold text-primary mt-2">₹{product.price.toLocaleString('en-IN')}</p>
        </div>
    </Link>
);

export const HomePage: React.FC = () => {
    const { products } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
    const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');


    const filteredProducts = useMemo(() => {
        let tempProducts = [...products];

        if (searchTerm.trim()) {
            const lowercasedTerm = searchTerm.toLowerCase();
            tempProducts = tempProducts.filter(product =>
                product.title.toLowerCase().includes(lowercasedTerm) ||
                product.description.toLowerCase().includes(lowercasedTerm)
            );
        }
        
        if (selectedCategory !== 'all') {
            tempProducts = tempProducts.filter(product => product.category === selectedCategory);
        }

        if (sortBy === 'price-asc') {
            tempProducts.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
            tempProducts.sort((a, b) => b.price - a.price);
        }

        return tempProducts;
    }, [products, searchTerm, selectedCategory, sortBy]);


    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-primary-light rounded-lg p-8 mb-8 text-center">
                <h1 className="text-4xl font-bold text-primary-dark mb-2">Welcome to EcoFinds!</h1>
                <p className="text-lg text-text-secondary">Your sustainable marketplace for pre-loved treasures.</p>
            </div>

            <div className="bg-surface p-4 rounded-lg shadow-md mb-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="w-full md:flex-1">
                     <input
                        type="text"
                        placeholder="Search by title..."
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Search for products"
                    />
                </div>
                <div className="flex w-full md:w-auto gap-4">
                    <div className="flex-1">
                        <label htmlFor="category-filter" className="sr-only">Filter by Category</label>
                        <select
                            id="category-filter"
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value as Category | 'all')}
                             className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        >
                            <option value="all">All Categories</option>
                            {Object.values(Category).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label htmlFor="sort-by" className="sr-only">Sort by</label>
                        <select
                            id="sort-by"
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value as typeof sortBy)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        >
                            <option value="default">Sort By</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <h2 className="text-2xl font-semibold text-text-primary">No products found</h2>
                    <p className="text-text-secondary mt-2">Try adjusting your search or filters.</p>
                </div>
            )}
            
            <Link
                to="/add-product"
                className="fixed bottom-8 right-8 bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary-dark transition-transform duration-300 hover:scale-110"
                aria-label="Add new product"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </Link>
        </div>
    );
};