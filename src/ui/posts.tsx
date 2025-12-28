import { useState } from "react";

interface PostProps {
    title: string;
    body: string;
}

export function LoadingView() {
    return <div className="loading-state" id="loadingState">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading posts</p>
        <div className="loading-dots">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
        </div>
    </div>;
}

export function ErrorView({ error, onRetry }: { error: string, onRetry: () => void }) {
    return <div className="error-state" id="errorState">
        <h2 className="error-title">Unable to Load Content</h2>
        <p className="error-message">{error}</p>
        <button className="btn btn-primary" onClick={onRetry}>
            <i className="fas fa-redo"></i> Try Again
        </button>
    </div>;
}

export function EmptyView() {
    return <div className="empty-state" id="emptyState">
        <div className="empty-icon">
            <i className="far fa-folder-open"></i>
        </div>
        <h2 className="empty-title">No Posts Available</h2>
        <p className="empty-message">There are no posts to display at the moment. Add new posts using the "Show Posts" button above.</p>
    </div>;
}

export function Post({
    title, body
}: PostProps
) {
    const [isReadingMore, setIsReadingMore] = useState(false);
    return <article className="card">
        <div className="card-content">
            <h2 className="card-title" title={title}>{title}</h2>
            <div className="card-body">
                <p>{isReadingMore ? body : body.slice(0, 100)+'...'}</p>
            </div>
        </div>
        <div className="card-footer">
            { body.length > 100 && (
                <a href="javascript:void(0)" className="read-more" onClick={(e) => {
                    e.preventDefault();
                    setIsReadingMore(value=>!value);
                }}> {isReadingMore ? 'Show Less' : 'Read More'}<i className="fas fa-arrow-right"></i>
                </a>
            )}
        </div>
    </article>;
}