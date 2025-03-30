import React, { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import { FixedSizeGrid as Grid } from 'react-window';
import { debounce } from 'lodash';
import { ErrorBoundary } from 'react-error-boundary';

// Add this placeholder generator function
const getPlaceholder = (title) => {
    const initials = title
        .split(' ')
        .slice(0, 2)
        .map(word => word[0]?.toUpperCase() || '')
        .join('');
    
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450">
            <rect width="300" height="450" fill="#1F2937"/>
            <text 
                x="150" 
                y="225" 
                font-family="system-ui" 
                font-size="64" 
                fill="#4B5563" 
                text-anchor="middle" 
                dominant-baseline="middle"
            >${initials}</text>
        </svg>
    `)}`;
};

// Separate BookCard into its own component
const BookCard = React.memo(({ book, style }) => {
    if (book.dummy) {
        return (
            <div style={style} className="group relative bg-gray-800/30 rounded-xl md:rounded-2xl backdrop-blur-xl border border-dashed border-gray-700/50 flex items-center justify-center h-64 md:h-96">
                <p className='text-gray-400 text-sm md:text-base'>No Book</p>
            </div>
        );
    }

    return (
        <div style={style} id='hero' key={book.id} className='group relative bg-gray-800/30 rounded-xl md:rounded-2xl backdrop-blur-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2 shadow-lg hover:shadow-cyan-400/10 overflow-hidden'>
            <a href={book.infoLink}
                target='_blank' rel='noopener noreferrer'
                className='absolute inset-0 z-10 cursor-pointer'
                aria-label={`View ${book.title}`}></a>
            <div className='p-4 md:p-6'>
                <div className='relative aspect-[4/5] w-full rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-400/10 to-blue-400/10'>
                    <img src={book.imageUrl || getPlaceholder(book.title)} alt={book.title}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                        style={{ imageRendering: '-webkit-optimize-contrast' }}
                        onError={(e) => (e.target.src = getPlaceholder(book.title))} />
                    <div className='absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent' />
                    <div className='absolute bottom-0 left-0 right-0 p-2 md:p-4 bg-gradient-to-t from-gray-900/90 to-transparent'>
                        <span className='text-xs md:text-sm font-medium text-cyan-300 truncate block'>
                            {book.printType}
                        </span>
                    </div>
                </div>
                <div className='mt-4 md:mt-6'>
                    <h3 className='text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 truncate'>
                        {book.title}
                    </h3>
                    <p className='text-gray-400 mt-1 md:mt-2 text-sm md:text-base truncate'>
                        {book.authors}
                    </p>
                </div>

                <span className='text-gray-400 mt-1 md:mt-2 text-sm md:text-base'>
                    {book.rating > 0 ? `★ ${book.rating}` : 'No rating'}
                </span>
                
                <div className="grid grid-cols-2 gap-2 md:mt-4 text-xs md:text-sm">
                    <div className="flex items-center space-x-1 md:space-x-2 truncate">
                        <span className="text-gray-400 whitespace-nowrap">Pages:</span>
                        <span className="text-cyan-300 truncate">{book.pageCount}</span>
                    </div>

                    <div className="flex items-center space-x-1 md:space-x-2 truncate">
                        <span className="text-gray-400 whitespace-nowrap">Format:</span>
                        <span className="text-purple-300 truncate">{book.printType}</span>
                    </div>

                    <div className="flex items-center space-x-1 md:space-x-2 truncate">
                        <span className="text-gray-400 whitespace-nowrap">Rating:</span>
                        <span className="text-blue-300 truncate">
                            {book.ratingsCount > 0 ? book.ratingsCount : 'N/A'}
                        </span>
                    </div>
                </div>

                <div className='mt-2 md:mt-4 flex flex-wrap gap-1 md:gap-2'>
                    {book.categories.split(',').slice(0, 2).map((category, index) => (
                        <span key={index} className='px-2 py-1 md:px-3 md:py-1 rounded-full bg-gray-700/50 text-xs text-cyan-300 backdrop-blur-sm truncate max-w-[45%]'>
                            {category.trim()}
                            {index === 1 && book.categories.split(',').length > 2 && (
                                <span className='ml-1 text-gray-400'>
                                    +{book.categories.split(',').length - 2}
                                </span>
                            )}
                        </span>
                    ))}
                </div>
            </div>
            <div className='absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br from-cyan-400/20 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none' />
        </div>
    );
});

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
    <div className="text-center p-4">
        <p className="text-red-400 mb-4">Something went wrong: {error.message}</p>
        <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600"
        >
            Try again
        </button>
    </div>
);

const Books = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('programming');
    const [hasMore, setHasMore] = useState(true);

    // Modified search function
    const handleSearchInput = useCallback((e) => {
        const query = e.target.value.trim();
        if (query) {
            setLoading(true);
            setBooks([]); // Clear existing books when searching
            setSearchQuery(query);
            setPage(1);
            setHasMore(true);
        }
    }, []);

    // Modified fetch function
    const fetchBooks = useCallback(async () => {
        if (!searchQuery) return;

        const cacheKey = `books-${searchQuery}-${page}`;
        const cachedData = sessionStorage.getItem(cacheKey);

        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            setBooks(prev => page === 1 ? parsedData : [...prev, ...parsedData]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&startIndex=${(page - 1) * 12}&maxResults=12&key=AIzaSyAtZxon2bKZvQUnvW-n1KSxScTAa9cLO3I`
            );
            
            if (!response.ok) throw new Error('Failed to fetch books');
            
            const data = await response.json();
            const mappedBooks = data.items?.map(item => ({
                id: item.id,
                title: item.volumeInfo.title || 'Untitled',
                authors: item.volumeInfo.authors?.join(', ') || 'Unknown Author',
                categories: item.volumeInfo.categories?.join(', ') || 'General',
                rating: item.volumeInfo.averageRating || 0,
                pageCount: item.volumeInfo.pageCount || 'N/A',
                printType: item.volumeInfo.printType || 'Unknown',
                ratingsCount: item.volumeInfo.ratingsCount || 0,
                imageUrl: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || '',
                infoLink: item.volumeInfo.infoLink || '#',
            })) || [];

            sessionStorage.setItem(cacheKey, JSON.stringify(mappedBooks));
            setBooks(prev => page === 1 ? mappedBooks : [...prev, ...mappedBooks]);
            setHasMore(mappedBooks.length === 12);
        } catch (error) {
            console.error('Error Fetching books:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [searchQuery, page]);

    // Update useEffect to respond to search query changes
    useEffect(() => {
        fetchBooks();
    }, [fetchBooks, searchQuery, page]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    setPage(prev => prev + 1);
                }
            },
            { threshold: 0.5 }
        );

        const target = document.getElementById('infinite-scroll-trigger');
        if (target) observer.observe(target);

        return () => observer.disconnect();
    }, [hasMore, loading]);

    // Update the grid configuration
    const gridConfig = useMemo(() => {
        const padding = 16; // Padding on each side
        const gap = 24; // Gap between cards
        const availableWidth = window.innerWidth - (padding * 2);
        
        // Calculate optimal column count based on screen width
        const getColumnCount = (width) => {
            if (width >= 1536) return 4;      // 2xl breakpoint
            if (width >= 1280) return 3;      // xl breakpoint
            if (width >= 768) return 2;       // md breakpoint
            return 1;                         // mobile
        };
        
        const columnCount = getColumnCount(window.innerWidth);
        const columnWidth = (availableWidth - (gap * (columnCount - 1))) / columnCount;

        return {
            columnCount,
            rowCount: Math.ceil(books.length / columnCount),
            columnWidth,
            rowHeight: columnWidth * 1.5, // Maintain aspect ratio
            gap,
        };
    }, [books.length]);

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <div className="min-h-screen bg-black text-white">
                {/* Search Section */}
                <div className="sticky top-0 z-10 pt-6 pb-4 px-4 backdrop-blur-xl bg-gray-900/30">
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                onChange={handleSearchInput}
                                placeholder="Search books..."
                                defaultValue={searchQuery}
                                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400 transition-colors"
                            />
                            {loading && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <div className="w-5 h-5 border-t-2 border-cyan-400 rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <Suspense fallback={<div className="loading">Loading...</div>}>
                    <div className="px-4">
                        <Grid
                            className="no-scrollbar"
                            width={window.innerWidth - 32} // Account for padding
                            height={window.innerHeight - 100}
                            columnCount={gridConfig.columnCount}
                            rowCount={gridConfig.rowCount}
                            columnWidth={gridConfig.columnWidth}
                            rowHeight={gridConfig.rowHeight}
                            itemData={books}
                        >
                            {({ columnIndex, rowIndex, style }) => {
                                const index = rowIndex * gridConfig.columnCount + columnIndex;
                                const book = books[index];
                                if (!book) return null;
                                
                                // Adjust style to include gap
                                const adjustedStyle = {
                                    ...style,
                                    left: `${parseInt(style.left) + (columnIndex * gridConfig.gap)}px`,
                                    top: `${parseInt(style.top) + (rowIndex * gridConfig.gap)}px`,
                                    width: `${gridConfig.columnWidth}px`,
                                    height: `${gridConfig.rowHeight}px`,
                                    padding: '12px',
                                };

                                return <BookCard book={book} style={adjustedStyle} />;
                            }}
                        </Grid>
                    </div>

                    <div id="infinite-scroll-trigger" className="h-20" />
                </Suspense>
            </div>
        </ErrorBoundary>
    );
};

export default Books;
