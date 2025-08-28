
import React, { useState } from 'react';
import StarRating from './StarRating';

const ReviewForm: React.FC = () => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please select a rating.');
            return;
        }
        if (!comment.trim()) {
            alert('Please enter a comment.');
            return;
        }
        console.log('New Review Submitted:', { rating, comment });
        // Reset form after submission
        setRating(0);
        setComment('');
        alert('Thank you for your review!');
    };

    return (
        <div className="mt-8 border-t border-gray-700 pt-6">
            <h3 className="text-lg font-bold mb-4">Leave a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Your Rating</label>
                    <StarRating rating={rating} onRatingChange={setRating} interactive />
                </div>
                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-400 mb-2">Your Comment</label>
                    <textarea
                        id="comment"
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Share your thoughts about this experience..."
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-full transition-colors"
                    >
                        Submit Review
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;
