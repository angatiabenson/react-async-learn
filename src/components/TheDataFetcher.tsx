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
    const [error, setError] = useState<string | null>(null);

    async function fetchPosts() {
        try{
            setLoading(true);
            const response = await axios.get('https://jsonplaceholder.typicode.com/posts?_limit=10');
            console.log(response.data);
            setPosts(
                response.data
            );
        } catch (err) {
            console.log(`Error fetching posts: ${err}`);
            setError(`Error fetching posts: ${err}`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    return <div className="container">
        <header>
            <h1>Your Posts</h1>
            <p className="subtitle">This is an example app showing how to handle loading, error and success state in React.</p>
        </header>

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
        
        <footer>
            <p>YourPosts • Designed by Angatia Benson</p>
        </footer>
    </div>;
}