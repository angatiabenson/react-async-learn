import { EmptyView, ErrorView, LoadingView, Post } from "@/ui/posts";
import axios from "axios";
import { useEffect, useState } from "react";

interface IPost {
    id: number;
    title: string;
    body: string;
    userId: number;
}

export function TheDataFetcher() {

    const [posts, setPosts] = useState<IPost[]>([]);
    const [loading, setLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [creatingError, setCreatingError] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState('');
    const [newBody, setNewBody] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    async function fetchPosts(): Promise<IPost[] | undefined> {
        try {
            setLoading(true);
            const response = await axios.get('https://jsonplaceholder.typicode.com/posts?_limit=10');
            console.log(response.data);
            setPosts(response.data);
            return response.data;
        } catch (err) {
            console.log(`Error fetching posts: ${err}`);
            setError(`Error fetching posts: ${err}`);
            return undefined;
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log('Form submit (UI-only):', { title: newTitle, body: newBody });
        setCreatingError(null);
        try {
            if (!newTitle.trim() || !newBody.trim()) {
                setCreatingError('Title and Body are required to create a post.');
                return;
            }
            setIsCreating(true);
            const payload = {
                title: newTitle,
                body: newBody,
                userId: 1
            };
            const response = await axios.post('https://jsonplaceholder.typicode.com/posts', payload);
            if (response.status === 201 || response.status === 200) {
                const fetched = await fetchPosts();
                const created = response.data as IPost;
                if (fetched) {
                    setPosts([created, ...fetched]);
                } else {
                    setPosts(prev => [created, ...prev]);
                }
            }
            setNewTitle('');
            setNewBody('');
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err) {
            console.log(`Error creating new post: ${err}`);
            setCreatingError(`Error creating new post: ${err}`);
        } finally {
            setIsCreating(false);
        }
    }

        function handleClear() {
            setNewTitle('');
            setNewBody('');
        }

        return <div className="container">
            <header>
                <h1>Your Posts</h1>
                <p className="subtitle">This is an example app showing how to handle loading, error and success state in React.</p>
            </header>

            <div className="content-layout">
                <div className="posts-column">
                    {loading && <LoadingView />}
                    {error && <ErrorView error={error} onRetry={fetchPosts} />}
                    {!loading && !error && posts.length === 0 && <EmptyView />}
                    {!loading && !error && posts.length > 0 && (
                        <div className="card-container" id="postsContainer">
                            {posts.map((post: any) => (
                                <Post key={post.id} title={post.title} body={post.body} />
                            ))}
                        </div>
                    )}
                </div>

                <aside className="form-column">
                    <div className="form-panel">
                        <h3>Add New Post</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="postTitle">Title</label>
                                <input id="postTitle" className="form-control" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Enter post title" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="postBody">Body</label>
                                <textarea id="postBody" className="form-control" value={newBody} onChange={e => setNewBody(e.target.value)} placeholder="Enter post body" />
                            </div>

                            {creatingError && <p className="error-message"> {creatingError} </p>}
                            {showSuccess && <p className="success-message">Post created successfully!</p>}

                            <div className="form-actions">
                                <button type="button" className="btn btn-outline" onClick={handleClear}>Clear</button>
                                <button type="submit" className="btn-submit" disabled = {isCreating}>{isCreating ? 'Creating...' : 'Create Post'}</button>
                            </div>
                        </form>
                    </div>
                </aside>
            </div>

            <footer>
                <p>YourPosts • Designed by Angatia Benson</p>
            </footer>
        </div>;
    }